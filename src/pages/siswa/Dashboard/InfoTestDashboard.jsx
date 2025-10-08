import React, { useState } from "react";
import { Link } from "react-router-dom";
import { startTest } from "../../../api/testOnlineAPI";
import { useAuth } from "../../../contexts/AuthContext";
import Swal from "sweetalert2";
import TestCard from "./TestCard";
import AccordionSection from "./AccordionSection";
import EmptyState from "./EmptyState";

const InfoTestDashboard = ({ tests, onTestsUpdate }) => {
  const [expanded, setExpanded] = useState(true);
  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;
  const kelas = user?.siswa?.kelas?.kelas_id;

  // ===== Handle Kerjakan Test =====
  const handleKerjakan = async (testId, testJudul, testDurasi) => {
    try {
      if (!nis) {
        Swal.fire("Error", "NIS tidak ditemukan", "error");
        return;
      }

      const session = await startTest(testId, nis, kelas);

      if (!session?.SessionID) {
        Swal.fire("Error", "Session ID tidak ditemukan", "error");
        return;
      }

      // Buka test di tab baru
      window.open(`/siswa/ujian/${session.SessionID}`, "_blank");

      // Update parent state - hapus test yang dikerjakan
      onTestsUpdate((prev) => prev.filter((test) => test.test_id !== testId));

      Swal.fire({
        title: "Test Dimulai!",
        html: `
          <div class="text-center">
            <p class="font-semibold text-lg mb-2">${testJudul}</p>
            <p>Durasi: ${testDurasi} menit</p>
            <p class="text-sm text-gray-600 mt-2">Test telah dibuka di tab baru</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Mengerti",
      });
    } catch (err) {
      console.error("Error mulai test:", err);
      Swal.fire(
        "Error",
        err.response?.data?.error || "Gagal memulai test",
        "error"
      );
    }
  };

  return (
    <AccordionSection
      title="📚 Test & Tugas Terbaru"
      count={tests.length}
      isExpanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      {tests.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.slice(0, 4).map((test) => (
              <TestCard
                key={test.test_id}
                test={test}
                onKerjakan={handleKerjakan}
              />
            ))}
          </div>
          {tests.length > 4 && (
            <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-600">
              <Link
                to="/siswa/test"
                className="block w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg text-center transition-colors duration-200 text-sm"
              >
                Lihat Semua Test ({tests.length})
              </Link>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon="🎉"
          title="Tidak ada test baru"
          message="Semua test/tugas telah dikerjakan atau belum ada penugasan baru"
        />
      )}
    </AccordionSection>
  );
};

export default InfoTestDashboard;
