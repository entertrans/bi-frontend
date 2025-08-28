// src/pages/siswa/testonline/CBTUjian.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTestSession,
  getSoalByTestId,
  saveJawaban,
  submitTest,
} from "../../../api/testOnlineAPI";
import Swal from "sweetalert2";
import { useAuth } from "../../../contexts/AuthContext";

const CBTUjian = () => {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;

  // COMMAND: STATE
  const [session, setSession] = useState(null);
  const [soal, setSoal] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [waktu, setWaktu] = useState(0);
  const [judul, setJudul] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // COMMAND: RENDER SOAL
  const renderSoal = (s) => {
    switch (s.tipe_soal) {
      case "pg": // pilihan ganda
        return JSON.parse(s.pilihan_jawaban).map((opt, idx) => (
          <label
            key={idx}
            className="flex items-center space-x-3 p-3 mb-2 bg-gray-700 rounded"
          >
            <input
              type="radio"
              name={`soal_${s.soal_id}`}
              value={opt}
              checked={jawaban[s.soal_id] === opt}
              onChange={() => handleJawab(s.soal_id, opt)}
            />
            <span>{opt}</span>
          </label>
        ));

      case "pg_kompleks": // multiple answer
        return JSON.parse(s.pilihan_jawaban).map((opt, idx) => (
          <label
            key={idx}
            className="flex items-center space-x-3 p-3 mb-2 bg-gray-700 rounded"
          >
            <input
              type="checkbox"
              name={`soal_${s.soal_id}`}
              value={opt}
              checked={jawaban[s.soal_id]?.includes(opt)}
              onChange={(e) => {
                const prev = jawaban[s.soal_id] || [];
                const newVal = e.target.checked
                  ? [...prev, opt]
                  : prev.filter((v) => v !== opt);
                handleJawab(s.soal_id, newVal);
              }}
            />
            <span>{opt}</span>
          </label>
        ));

      case "isian_singkat":
        return (
          <input
            type="text"
            className="w-full p-2 rounded bg-gray-700"
            value={jawaban[s.soal_id] || ""}
            onChange={(e) => handleJawab(s.soal_id, e.target.value)}
          />
        );

      case "uraian":
        return (
          <textarea
            rows={4}
            className="w-full p-2 rounded bg-gray-700"
            value={jawaban[s.soal_id] || ""}
            onChange={(e) => handleJawab(s.soal_id, e.target.value)}
          />
        );

      case "matching":
        const pairs = JSON.parse(s.pilihan_jawaban);

        const rightOptions = pairs.map((item, idx) => ({
          label: String.fromCharCode(65 + idx), // A, B, C...
          text: item.right,
        }));

        return (
          <div className="grid grid-cols-2 gap-6">
            {/* Kolom kiri: pernyataan + dropdown */}
            <div>
              {pairs.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 mb-3 bg-gray-700 p-3 rounded"
                >
                  <span className="w-1/2">{item.left}</span>
                  <select
                    className="flex-1 p-2 rounded bg-gray-800"
                    value={jawaban[s.soal_id]?.[item.left] || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      const newJawaban = {
                        ...(jawaban[s.soal_id] || {}),
                        [item.left]: val,
                      };
                      setJawaban((prev) => ({
                        ...prev,
                        [s.soal_id]: newJawaban,
                      }));
                      handleJawab(s.soal_id, newJawaban);
                    }}
                  >
                    <option value="">-- Pilih --</option>
                    {rightOptions.map((opt) => {
                      const used = Object.values(
                        jawaban[s.soal_id] || {}
                      ).includes(opt.label);
                      return (
                        <option
                          key={opt.label}
                          value={opt.label}
                          disabled={
                            used &&
                            jawaban[s.soal_id]?.[item.left] !== opt.label
                          }
                        >
                          {opt.label}
                        </option>
                      );
                    })}
                  </select>
                </div>
              ))}
            </div>

            {/* Kolom kanan: daftar pilihan */}
            <div className="bg-gray-700 p-3 rounded">
              {rightOptions.map((opt) => (
                <p key={opt.label} className="mb-2">
                  {opt.label}. {opt.text}
                </p>
              ))}
            </div>
          </div>
        );

      default:
        return <p className="text-red-400">Tipe soal tidak dikenali</p>;
    }
  };

  // COMMAND: LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const sessionData = await getTestSession(sessionId);
        setSession(sessionData);

        if (sessionData?.test?.durasi_menit) {
          setWaktu(sessionData.test.durasi_menit * 60);
        }

        if (sessionData?.TestID) {
          const soalData = await getSoalByTestId(sessionData.TestID);
          setSoal(soalData);

          if (sessionData.test?.judul) {
            setJudul(sessionData.test.judul);
          } else if (soalData.length > 0 && soalData[0]?.test_judul) {
            setJudul(soalData[0].test_judul);
          }
        }
      } catch (err) {
        Swal.fire(
          "Error",
          err.response?.data?.error || "Gagal memuat ujian",
          "error"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [sessionId]);

  // COMMAND: TIMER
  useEffect(() => {
    if (waktu > 0) {
      const timer = setInterval(() => {
        setWaktu((w) => {
          if (w <= 1) {
            clearInterval(timer);
            handleSubmit();
            return 0;
          }
          return w - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [waktu]);

  // COMMAND: HANDLE JAWAB
  const handleJawab = async (soalId, val) => {
    try {
      setJawaban((prev) => ({ ...prev, [soalId]: val }));
      await saveJawaban({
        session_id: parseInt(sessionId),
        soal_id: soalId,
        jawaban_siswa: JSON.stringify({ jawaban: val }),
        skor_objektif: 0,
      });
    } catch (err) {
      Swal.fire("Error", "Gagal menyimpan jawaban", "error");
    }
  };

  // COMMAND: SUBMIT
  const handleSubmit = async () => {
    try {
      await submitTest(sessionId);
      Swal.fire({
        title: "Selesai",
        text: "Ujian sudah dikumpulkan!",
        icon: "success",
      }).then(() => {
        window.close();
      });
    } catch (err) {
      Swal.fire(
        "Error",
        err.response?.data?.error || "Gagal mengumpulkan ujian",
        "error"
      );
    }
  };

  // COMMAND: FORMAT TIME
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // COMMAND: LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-3">Memuat ujian...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">Session tidak ditemukan</p>
      </div>
    );
  }

  // COMMAND: RENDER MAIN UI
  return (
    <div className="w-screen h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 p-4 shadow-md">
        <div>
          <h1 className="text-lg font-bold">
            {judul || `Ujian #${session.TestID}`}
          </h1>
          <p className="text-sm text-gray-400">
            Session ID: {session.SessionID}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-red-500 font-mono text-xl font-bold bg-gray-700 px-4 py-2 rounded">
            ⏳ {formatTime(waktu)}
          </div>
          <button className="bg-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700">
            📑 Daftar Soal
          </button>
        </div>
      </div>

      {/* Konten soal */}
      <div className="flex-1 overflow-y-auto p-6">
        {soal.length > 0 && (
          <div
            key={soal[currentIndex].soal_id}
            className="p-6 bg-gray-800 rounded-lg shadow mb-6"
          >
            <p className="font-semibold mb-4 text-gray-100">
              <span className="text-blue-400">{currentIndex + 1}.</span>{" "}
              {soal[currentIndex].pertanyaan}
            </p>
            {renderSoal(soal[currentIndex])}
          </div>
        )}
      </div>

      {/* Navigasi bawah */}
      <div className="flex justify-between items-center bg-gray-800 p-4 shadow-lg">
        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
        >
          ⬅ Soal Sebelumnya
        </button>

        <button className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">
          ⚠ Ragu-ragu
        </button>

        <button
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, soal.length - 1))
          }
          disabled={currentIndex === soal.length - 1}
        >
          Soal Selanjutnya ➡
        </button>
      </div>
    </div>
  );
};

export default CBTUjian;
