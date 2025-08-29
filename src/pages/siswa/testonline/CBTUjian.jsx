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
import HeaderUjian from "./HeaderUjian";
import SoalRenderer from "./SoalRenderer";
import NavigationControls from "./NavigationControls";
import DaftarSoalModal from "./DaftarSoalModal";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";
import { processSoalWithShuffle } from "./shuffleUtils"; // Import fungsi shuffle

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
          const soalData = await getSoalByTestId(sessionData.TestID);
          // Proses soal dengan shuffle
          const processedSoal = processSoalWithShuffle(soalData);
          setSoal(processedSoal);

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
      await submitTest(sessionId);
      Swal.fire({
        title: "Ujian Selesai!",
        text: "Jawaban Anda telah berhasil dikumpulkan.",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Tutup",
      }).then(() => {
        // 🚀 kirim sinyal ke tab utama
        if (window.opener) {
          window.opener.postMessage({ type: "UJIAN_SELESAI", sessionId }, "*");
        }
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
