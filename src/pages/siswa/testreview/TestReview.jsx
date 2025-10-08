import React, { useEffect, useState, useMemo } from "react";
import {
  gettestbykelas,
  startTest,
  getActiveTestSession,
} from "../../../api/testOnlineAPI";
import { fetchAllMapelByKelas } from "../../../api/siswaAPI";
import Swal from "sweetalert2";
import { useAuth } from "../../../contexts/AuthContext";
import FilterSection from "../testonline/common/FilterSection";
import LoadingState from "../testonline/common/LoadingState";
import ActiveTestsTableTR from "../testonline/common/ActiveTestsTableTR";

const TestReview = () => {
  const [tests, setTests] = useState([]);
  const [activeSessions, setActiveSessions] = useState({});
  const [mapelOptions, setMapelOptions] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;
  const kelasId = user?.siswa?.kelas?.kelas_id;
  const typeTest = "tr";

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "UJIAN_SELESAI") {
        refreshAll();
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [nis, kelasId]);

  const refreshAll = async () => {
    try {
      if (!kelasId) return;
      setLoading(true);
      const data = await gettestbykelas(typeTest, kelasId);
      setTests(data);
      if (nis) await checkActiveSessions(data);
    } catch (err) {
      console.error("Gagal refresh data TR:", err);
      Swal.fire("Error", "Gagal refresh data Test Review", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMapelOptions = async () => {
    try {
      if (!kelasId) return;
      const data = await fetchAllMapelByKelas(kelasId);
      setMapelOptions(data);
    } catch (err) {
      console.error("Gagal ambil data mapel:", err);
    }
  };

  const checkActiveSessions = async (testsData) => {
    const sessions = {};
    for (const test of testsData) {
      try {
        const session = await getActiveTestSession(test.test_id, nis);
        if (session) sessions[test.test_id] = session;
      } catch {
        sessions[test.test_id] = null;
      }
    }
    setActiveSessions(sessions);
  };

  useEffect(() => {
    if (kelasId) {
      fetchMapelOptions();
      refreshAll();
    }
  }, [kelasId]);

  const filteredTests = useMemo(() => {
    if (!selectedMapel) return tests;
    return tests.filter(
      (test) => test.mapel?.kd_mapel?.toString() === selectedMapel
    );
  }, [tests, selectedMapel]);

  const handleKerjakan = async (testId, testJudul, testDurasi) => {
    try {
      if (!nis) {
        Swal.fire("Error", "NIS tidak ditemukan", "error");
        return;
      }

      const active = Object.values(activeSessions).find(
        (s) => s && !s.SubmittedAt
      );
      if (active) {
        Swal.fire(
          "Peringatan",
          "Kamu sudah punya Test Review yang sedang berlangsung. Selesaikan dulu sebelum memulai yang baru.",
          "warning"
        );
        return;
      }

      const session = await startTest(testId, nis, kelasId);
      setActiveSessions((prev) => ({ ...prev, [testId]: session }));

      if (!session?.SessionID) {
        Swal.fire("Error", "Session ID tidak ditemukan", "error");
        return;
      }

      window.open(`/siswa/ujian/${session.SessionID}`, "_blank");

      Swal.fire({
        title: "Test Review Dimulai!",
        html: `
          <div>
            <p><strong>${testJudul}</strong></p>
            <p>Durasi: ${testDurasi} menit</p>
            <p>Gunakan test ini untuk berlatih sebelum ujian sebenarnya.</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Mengerti",
      });
    } catch (err) {
      console.error("Error mulai test review:", err);
      Swal.fire(
        "Error",
        err.response?.data?.error || "Gagal memulai Test Review",
        "error"
      );
    }
  };

  const handleLanjutkan = (session) => {
    if (!session?.SessionID) return;
    window.open(`/siswa/ujian/${session.SessionID}`, "_blank");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Judul dengan gaya yang sama seperti di ActiveTestsTableTR */}

      <FilterSection
        selectedMapel={selectedMapel}
        setSelectedMapel={setSelectedMapel}
        mapelOptions={mapelOptions}
        judul="Test Review"
      />

      {loading ? (
        <LoadingState />
      ) : (
        <ActiveTestsTableTR
          tests={filteredTests}
          activeSessions={activeSessions}
          onKerjakan={handleKerjakan}
          onLanjutkan={handleLanjutkan}
        />
      )}
    </div>
  );
};

export default TestReview;
