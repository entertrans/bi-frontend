import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Countdown from "react-countdown";
import {
  getTestSession,
  getSoalByTestId,
  saveJawaban,
  submitTest,
} from "../../../api/testOnlineAPI";
import Swal from "sweetalert2";
import { useAuth } from "../../../contexts/AuthContext";
import { removeHTMLTags } from "../../../utils/format";

const CBTUjian = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;

  // COMMAND: STATE
  const [soal, setSoal] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [waktuSisa, setWaktuSisa] = useState(0); // dalam milidetik untuk Countdown
  const [judul, setJudul] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [raguRagu, setRaguRagu] = useState({});
  const [showDaftarSoal, setShowDaftarSoal] = useState(false);
  const [targetDate, setTargetDate] = useState(null); // Target waktu untuk countdown

  // COMMAND: CEK JAWABAN KOSONG
  const cekJawabanKosong = (soalId, jawabanSiswa, tipeSoal) => {
    if (!jawabanSiswa) return true;

    switch (tipeSoal) {
      case "pg":
        return jawabanSiswa === "";
      case "pg_kompleks":
        return jawabanSiswa.length === 0;
      case "isian_singkat":
      case "uraian":
        return jawabanSiswa.trim() === "";
      case "matching":
        return Object.values(jawabanSiswa).some((value) => value === "");
      default:
        return true;
    }
  };

  // COMMAND: GET STATUS SOAL
  const getStatusSoal = (index) => {
    const soalItem = soal[index];
    if (!soalItem) return "belum-dijawab";

    const jawabanSiswa = jawaban[soalItem.soal_id];
    const kosong = cekJawabanKosong(
      soalItem.soal_id,
      jawabanSiswa,
      soalItem.tipe_soal
    );

    if (kosong) return "belum-dijawab";
    if (raguRagu[soalItem.soal_id]) return "ragu-ragu";
    return "sudah-dijawab";
  };

  // COMMAND: RENDER SOAL
  const renderSoal = (s) => {
    switch (s.tipe_soal) {
      case "pg": // pilihan ganda
        return JSON.parse(s.pilihan_jawaban).map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            <input
              id={`soal_${s.soal_id}_${idx}`}
              type="radio"
              name={`soal_${s.soal_id}`}
              value={opt}
              checked={jawaban[s.soal_id] === opt}
              onChange={() => handleJawab(s.soal_id, opt)}
              className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor={`soal_${s.soal_id}_${idx}`}
              className="ms-3 text-white text-sm cursor-pointer flex-1"
              dangerouslySetInnerHTML={{ __html: opt }}
            />
          </div>
        ));

      case "pg_kompleks": // multiple answer
        return JSON.parse(s.pilihan_jawaban).map((opt, idx) => (
          <div
            key={idx}
            className="flex items-center mb-4 p-3 bg-gray-750 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors"
          >
            <input
              id={`soal_${s.soal_id}_${idx}`}
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
              className="w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              htmlFor={`soal_${s.soal_id}_${idx}`}
              className="ms-3 text-white text-sm cursor-pointer flex-1"
              dangerouslySetInnerHTML={{ __html: opt }}
            />
          </div>
        ));

      case "isian_singkat":
        return (
          <input
            type="text"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={jawaban[s.soal_id] || ""}
            onChange={(e) => handleJawab(s.soal_id, e.target.value)}
            placeholder="Ketik jawaban Anda di sini..."
          />
        );

      case "uraian":
        return (
          <textarea
            id="message"
            rows="6"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={jawaban[s.soal_id] || ""}
            onChange={(e) => handleJawab(s.soal_id, e.target.value)}
            placeholder="Tulis Jawaban Disini..."
          />
        );

      case "matching":
        const pairs = JSON.parse(s.pilihan_jawaban);
        const rightOptions = pairs.map((item, idx) => ({
          label: String.fromCharCode(65 + idx),
          text: item.right,
        }));

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Kolom kiri: pernyataan + dropdown */}
            <div className="space-y-3">
              {pairs.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-4 bg-gray-750 rounded-lg border border-gray-600"
                >
                  <span className="w-1/2 text-white font-medium text-sm">
                    <span dangerouslySetInnerHTML={{ __html: item.left }} />
                  </span>
                  <select
                    className="flex-1 w-1 p-2 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 transition-colors"
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
                          className="text-white bg-gray-800"
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
            <div className="bg-gray-750 p-4 rounded-lg border border-gray-600">
              {rightOptions.map((opt) => (
                <div key={opt.label} className="mb-3 p-2 bg-gray-700 rounded">
                  <span className="font-bold text-blue-400 text-sm">
                    {opt.label}.
                  </span>
                  <span
                    className="text-white ml-2 text-sm"
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <p className="text-red-400 p-4 bg-red-900 rounded">
            Tipe soal tidak dikenali
          </p>
        );
    }
  };

  // COMMAND: LOAD DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const sessionData = await getTestSession(sessionId);
        setSession(sessionData);

        // ✅ Pakai EndTime langsung dari backend
        if (sessionData?.EndTime) {
          setTargetDate(new Date(sessionData.EndTime).getTime());
        }

        // Judul ujian
        if (sessionData?.test?.judul) {
          setJudul(sessionData.test.judul);
        }

        // Ambil soal
        if (sessionData?.TestID) {
          const soalData = await getSoalByTestId(sessionData.TestID);
          setSoal(soalData);

          if (!judul && soalData.judul_test) {
            setJudul(soalData.judul_test);
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

  // COMMAND: TOGGLE RAGU-RAGU
  const toggleRaguRagu = (soalId) => {
    setRaguRagu((prev) => ({
      ...prev,
      [soalId]: !prev[soalId],
    }));
  };

  // --- VALIDASI SEBELUM SUBMIT ---
  const validasiSebelumSubmit = () => {
    const soalBelumDijawab = soal.filter((s) =>
      cekJawabanKosong(s.soal_id, jawaban[s.soal_id], s.tipe_soal)
    );

    const soalRaguRagu = soal.filter((s) => raguRagu[s.soal_id]);

    if (soalBelumDijawab.length > 0) {
      Swal.fire({
        title: "Soal Belum Dijawab",
        html: `Masih ada <b>${soalBelumDijawab.length} soal</b> yang belum dijawab.`,
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Periksa Lagi",
      });
      return false;
    }

    if (soalRaguRagu.length > 0) {
      Swal.fire({
        title: "Soal Ragu-Ragu",
        html: `Anda masih menandai <b>${soalRaguRagu.length} soal</b> sebagai ragu-ragu.`,
        icon: "warning",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Periksa Lagi",
      });
      return false;
    }

    return true;
  };

  // COMMAND: SUBMIT FINAL
  const handleSubmitFinal = async () => {
    try {
      await submitTest(sessionId);
      Swal.fire({
        title: "Ujian Selesai!",
        text: "Jawaban Anda telah berhasil dikumpulkan.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Tutup",
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

  // COMMAND: HANDLE SUBMIT
  const handleSubmit = () => {
    if (validasiSebelumSubmit()) {
      handleSubmitFinal();
    }
  };

  // Renderer untuk Countdown component
  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span className="text-red-500">00:00</span>;
  }

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const textColor = totalSeconds < 300 ? "text-red-500" : "text-white";

  return (
    <span className={textColor}>
      {hours > 0 ? `${hours}:` : ""}
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </span>
  );
};


  // Handler ketika countdown selesai
  const handleCountdownComplete = () => {
    handleSubmitFinal();
  };

  // COMMAND: RENDER DAFTAR SOAL
  const renderDaftarSoal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Daftar Soal</h3>
          <button
            onClick={() => setShowDaftarSoal(false)}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {soal.map((_, index) => {
            const status = getStatusSoal(index);
            const bgColor =
              status === "belum-dijawab"
                ? "bg-red-600"
                : status === "ragu-ragu"
                ? "bg-yellow-500"
                : "bg-green-600";

            return (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setShowDaftarSoal(false);
                }}
                className={`w-10 h-10 rounded flex items-center justify-center text-white font-semibold text-sm transition-transform hover:scale-110 ${
                  currentIndex === index ? "ring-2 ring-blue-400" : ""
                } ${bgColor}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
            <span>Sudah Dijawab</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Ragu-Ragu</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span>Belum Dijawab</span>
          </div>
        </div>
      </div>
    </div>
  );

  // COMMAND: LOADING
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-white text-lg">Memuat soal ujian...</p>
          <p className="text-gray-400 text-sm mt-2">Harap tunggu sebentar</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-xl mb-2">Session tidak ditemukan</p>
          <p className="text-gray-400">Silakan hubungi pengawas ujian</p>
        </div>
      </div>
    );
  }

  // COMMAND: RENDER MAIN UI
  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-gray-800 p-4 shadow-md border-b border-gray-700 sticky top-0 z-40">
        <div>
          <h1 className="text-xl font-bold text-white">
            {removeHTMLTags(judul || "Ujian Online")}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div
            className={`font-mono text-xl font-bold px-4 py-2 rounded-lg border transition-colors ${
              targetDate && targetDate - Date.now() < 5 * 60 * 1000
                ? "bg-red-600 border-red-500"
                : "bg-gray-700 border-gray-600"
            }`}
          >
            ⏳{" "}
            {targetDate ? (
              <Countdown
                date={targetDate}
                renderer={countdownRenderer}
                onComplete={handleCountdownComplete}
              />
            ) : (
              "00:00"
            )}
          </div>

          <button
            onClick={() => setShowDaftarSoal(true)}
            className="bg-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <span>📑</span>
            <span>Daftar Soal</span>
          </button>
        </div>
      </div>

      {/* Konten soal */}
      <div className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
        {soal.length > 0 && (
          <div className="p-6 bg-gray-800 rounded-xl shadow-2xl border border-gray-700 mb-6">
            {/* Header Soal */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
              <div>
                <p className="font-semibold text-lg text-blue-400">
                  Soal {currentIndex + 1} dari {soal.length}
                </p>
              </div>
              <button
                onClick={() => toggleRaguRagu(soal[currentIndex].soal_id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  raguRagu[soal[currentIndex].soal_id]
                    ? "bg-yellow-500 text-black shadow-lg"
                    : "bg-gray-700 text-white hover:bg-yellow-500 hover:text-black"
                }`}
              >
                {raguRagu[soal[currentIndex].soal_id]
                  ? "✓ Ragu-Ragu"
                  : "⚠ Tandai Ragu-Ragu"}
              </button>
            </div>

            {/* Pertanyaan */}
            <div className="mb-6 p-4 bg-gray-750 rounded-lg border border-gray-600">
              <div
                className="text-white text-lg leading-relaxed prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{
                  __html: soal[currentIndex].pertanyaan,
                }}
              />
            </div>

            {/* Jawaban */}
            <div className="space-y-4">{renderSoal(soal[currentIndex])}</div>
          </div>
        )}
      </div>

      {/* Navigasi bawah */}
      <div className="bg-gray-800 p-4 border-t border-gray-700 sticky bottom-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <button
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
            disabled={currentIndex === 0}
          >
            <span>⬅</span>
            <span>Sebelumnya</span>
          </button>

          <div className="text-center">
            <div className="text-sm text-gray-400">
              Soal {currentIndex + 1} dari {soal.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {getStatusSoal(currentIndex) === "belum-dijawab" &&
                "⚠ Belum dijawab"}
              {getStatusSoal(currentIndex) === "ragu-ragu" && "⚠ Ragu-ragu"}
              {getStatusSoal(currentIndex) === "sudah-dijawab" &&
                "✓ Sudah dijawab"}
            </div>
          </div>

          {currentIndex === soal.length - 1 ? (
            <button
              className="bg-green-600 px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2"
              onClick={handleSubmit}
            >
              <span>✅</span>
              <span>Kumpulkan</span>
            </button>
          ) : (
            <button
              className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              onClick={() =>
                setCurrentIndex((i) => Math.min(i + 1, soal.length - 1))
              }
            >
              <span>Selanjutnya</span>
              <span>➡</span>
            </button>
          )}
        </div>
      </div>

      {/* Modal Daftar Soal */}
      {showDaftarSoal && renderDaftarSoal()}
    </div>
  );
};

export default CBTUjian;
