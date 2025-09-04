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
import HeaderUjian from "./common/HeaderUjian";
import SoalRenderer from "./common/SoalRenderer";
import NavigationControls from "./common/NavigationControls";
import DaftarSoalModal from "./common/DaftarSoalModal";
import LoadingState from "./common/LoadingState";
import ErrorState from "./common/ErrorState";
import { processSoalWithShuffle } from "./common/shuffleUtils"; // Import fungsi shuffle

const CBTUjian = () => {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;

  // State management
  const [soal, setSoal] = useState([]);
  const [jawaban, setJawaban] = useState({});
  const [raguRagu, setRaguRagu] = useState({});
  const [judul, setJudul] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showDaftarSoal, setShowDaftarSoal] = useState(false);
  const [targetDate, setTargetDate] = useState(null);


  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const sessionData = await getTestSession(sessionId);
        setSession(sessionData);

        if (sessionData?.EndTime) {
          setTargetDate(new Date(sessionData.EndTime).getTime());
        }

        if (sessionData?.test?.judul) {
          setJudul(sessionData.test.judul);
        }

        if (sessionData?.TestID) {
          const response = await getSoalByTestId(sessionData.TestID);

          // ✅ PERBAIKAN DI SINI - Ambil array soal dari response.soal
          const soalData = response.soal || [];

          // Proses soal dengan shuffle
          const processedSoal = processSoalWithShuffle(soalData);
          setSoal(processedSoal);

          // ✅ BARU: Set jawaban yang sudah tersimpan dari backend
          const savedJawaban = {};
          processedSoal.forEach((soalItem) => {
            if (soalItem.jawaban_tersimpan) {
              // Handle different response formats
              if (
                typeof soalItem.jawaban_tersimpan === "object" &&
                soalItem.jawaban_tersimpan.jawaban
              ) {
                // Format: { jawaban: value }
                savedJawaban[soalItem.soal_id] =
                  soalItem.jawaban_tersimpan.jawaban;
              } else if (Array.isArray(soalItem.jawaban_tersimpan)) {
                // Format: array (untuk bs, pg_kompleks)
                savedJawaban[soalItem.soal_id] = soalItem.jawaban_tersimpan;
              } else if (typeof soalItem.jawaban_tersimpan === "string") {
                // Format: string (untuk isian_singkat, uraian)
                try {
                  // Coba parse JSON jika string adalah JSON
                  const parsed = JSON.parse(soalItem.jawaban_tersimpan);
                  if (parsed && parsed.jawaban) {
                    savedJawaban[soalItem.soal_id] = parsed.jawaban;
                  } else {
                    savedJawaban[soalItem.soal_id] = soalItem.jawaban_tersimpan;
                  }
                } catch {
                  // Jika bukan JSON, gunakan langsung
                  savedJawaban[soalItem.soal_id] = soalItem.jawaban_tersimpan;
                }
              } else {
                // Default: simpan langsung
                savedJawaban[soalItem.soal_id] = soalItem.jawaban_tersimpan;
              }
            }
          });

          setJawaban(savedJawaban);
          console.log("Jawaban tersimpan yang di-load:", savedJawaban);

          // Simpan session_id jika ada
          if (response.session_id) {
            console.log("Session ID dari soal:", response.session_id);
          }

          if (!judul && sessionData.test?.judul) {
            setJudul(sessionData.test.judul);
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

  // Cek jawaban kosong - tambahkan case untuk "bs"
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
      case "bs":
        if (!Array.isArray(jawabanSiswa)) return true;
        return jawabanSiswa.some((j) => !j || j === "");
      default:
        return true;
    }
  };

  // Get status soal
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

  // Handle jawab
  const handleJawab = async (soalId, val) => {
    try {
      const soalItem = soal.find((s) => s.soal_id === soalId);
      if (!soalItem) return;
      console.log("datamentah:", [val]);
      let payload = val;

      // Format jawaban sesuai tipe soal
      switch (soalItem.tipe_soal) {
        case "bs":
          if (!Array.isArray(val)) payload = [];
          break;
        case "matching":
          if (!Array.isArray(val)) payload = [];
          break;
        case "pg_kompleks":
          if (!Array.isArray(val)) payload = [];
          break;
        case "pg":
          if (Array.isArray(val)) {
            payload = val; // sudah array, biarkan
          } else {
            payload = [val]; // kalau single value, bungkus array
          }
          break;

        case "isian_singkat":
        case "uraian":
        default:
          if (typeof val !== "string") payload = String(val || "");
          break;
      }

      // Update state lokal
      setJawaban((prev) => ({ ...prev, [soalId]: payload }));

      // Data yang akan dikirim ke backend
      const requestData = {
        session_id: parseInt(sessionId),
        soal_id: soalId,
        jawaban_siswa: JSON.stringify(payload),
        skor_objektif: 0,
      };

      console.log("Data yang dikirim ke backend:", requestData);
      console.log("Detail soal:", {
        tipe_soal: soalItem.tipe_soal,
        payload_asli: payload,
        payload_stringified: JSON.stringify(payload),
      });

      // Simpan ke backend
      await saveJawaban(requestData);
    } catch (err) {
      console.error("Gagal simpan jawaban:", err);
    }
  };

  // Toggle ragu-ragu
  const toggleRaguRagu = (soalId) => {
    setRaguRagu((prev) => ({
      ...prev,
      [soalId]: !prev[soalId],
    }));
  };

  // Validasi sebelum submit
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

  // Submit final
  const handleSubmitFinal = async () => {
    try {
      console.log("Mengirim permintaan submit untuk session:", sessionId);

      const response = await submitTest(sessionId);

      console.log("Response dari submit:", response);

      Swal.fire({
        title: "Ujian Selesai!",
        text: "Jawaban Anda telah berhasil dikumpulkan.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Tutup",
      }).then(() => {
        if (window.opener) {
          // window.opener.postMessage({ type: "UJIAN_SELESAI", sessionId }, "*");
        }
        window.close();
      });
    } catch (err) {
      console.error("Error saat submit:", err);
      Swal.fire(
        "Error",
        err.response?.data?.error || "Gagal mengumpulkan ujian",
        "error"
      );
    }
  };

  // Handle submit
  const handleSubmit = () => {
    if (validasiSebelumSubmit()) {
      handleSubmitFinal();
    }
  };

  // Handle countdown complete
  const handleCountdownComplete = () => {
    handleSubmitFinal();
  };

  // Render loading state
  if (loading) {
    return <LoadingState />;
  }

  // Render error state
  if (!session) {
    return <ErrorState />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white flex flex-col">
      <HeaderUjian
        judul={judul}
        targetDate={targetDate}
        onCountdownComplete={handleCountdownComplete}
        onShowDaftarSoal={() => setShowDaftarSoal(true)}
      />

      <div className="flex-1 p-4 lg:p-6 max-w-4xl mx-auto w-full">
        {soal.length > 0 && (
          <SoalRenderer
            soal={soal[currentIndex]}
            jawaban={jawaban}
            onJawab={handleJawab}
            raguRagu={raguRagu}
            onToggleRaguRagu={toggleRaguRagu}
            currentIndex={currentIndex}
            totalSoal={soal.length}
          />
        )}
      </div>

      <NavigationControls
        currentIndex={currentIndex}
        totalSoal={soal.length}
        onPrev={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
        onNext={() => setCurrentIndex((i) => Math.min(i + 1, soal.length - 1))}
        onSubmit={handleSubmit}
        getStatusSoal={getStatusSoal}
      />

      {showDaftarSoal && (
        <DaftarSoalModal
          soal={soal}
          currentIndex={currentIndex}
          getStatusSoal={getStatusSoal}
          onClose={() => setShowDaftarSoal(false)}
          onSelectSoal={(index) => {
            setCurrentIndex(index);
            setShowDaftarSoal(false);
          }}
        />
      )}
    </div>
  );
};

export default CBTUjian;
