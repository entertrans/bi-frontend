import React, { useEffect, useState, useMemo } from "react";
import {
  gettestbykelas,
  startTest,
  getActiveTestSession,
} from "../../../api/testOnlineAPI";
import { fetchAllMapelByKelas } from "../../../api/siswaAPI";
import Swal from "sweetalert2";
import { useAuth } from "../../../contexts/AuthContext";
import FilterSection from "./common/FilterSection";
import LoadingState from "./common/LoadingState";
import ActiveTestsTable from "./common/ActiveTestsTable";
import ExpiredTestsTable from "./common/ExpiredTestsTable";
import Pagination from "./common/Pagination";

const ListUjian = () => {
  const [tests, setTests] = useState([]);
  const [activeSessions, setActiveSessions] = useState({});
  const [mapelOptions, setMapelOptions] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;
  const kelasId = user?.siswa?.kelas?.kelas_id;
  const typeTest = "ub";

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === "UJIAN_SELESAI") {
        refreshAll(); // 🚀 langsung refresh daftar + sessions
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [nis, kelasId]);

  // 🔥 helper untuk refresh tests + sessions
  const refreshAll = async () => {
    try {
      if (!kelasId) return;

      setLoading(true);
      const data = await gettestbykelas(typeTest, kelasId);
      setTests(data);

      if (nis) {
        await checkActiveSessions(data);
      }
    } catch (err) {
      console.error("Gagal refresh data:", err);
      Swal.fire("Error", "Gagal refresh data ujian", "error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data mapel
  const fetchMapelOptions = async () => {
    try {
      if (!kelasId) return;
      const data = await fetchAllMapelByKelas(kelasId);
      setMapelOptions(data);
    } catch (err) {
      console.error("Gagal ambil data mapel:", err);
    }
  };

  // Fetch data ujian

  // Cek session aktif
  const checkActiveSessions = async (testsData) => {
    const sessions = {};

    for (const test of testsData) {
      try {
        const session = await getActiveTestSession(test.test_id, nis);
        if (session) {
          sessions[test.test_id] = session; // ✅ simpan meskipun submitted
        }
      } catch (err) {
        sessions[test.test_id] = null;
      }
    }

    setActiveSessions(sessions);
  };

  // Handler untuk lanjutkan ujian
  const handleLanjutkan = async (testId) => {
    try {
      if (!nis) {
        Swal.fire("Error", "NIS tidak ditemukan", "error");
        return;
      }

      const session = await startTest(testId, nis);

      if (!session || !session.SessionID) {
        Swal.fire("Error", "Session aktif tidak ditemukan", "error");
        return;
      }

      window.open(`/siswa/ujian/${session.SessionID}`, "_blank");
    } catch (err) {
      const msg = err.response?.data?.error || "Gagal melanjutkan ujian";

      Swal.fire("Error", msg, "error").then(() => {
        if (msg.includes("waktu ujian sudah habis")) {
          refreshAll(); // 🚀 biar tombol langsung jadi "Lihat Nilai"
        }
      });
    }
  };

  useEffect(() => {
    if (kelasId) {
      fetchMapelOptions();
      refreshAll();
    }
  }, [kelasId]);

  // Filter tests
  const filteredTests = useMemo(() => {
    if (!selectedMapel) return tests;
    return tests.filter(
      (test) => test.mapel?.kd_mapel?.toString() === selectedMapel
    );
  }, [tests, selectedMapel]);

  const activeTests = filteredTests.filter((test) => {
    if (!test.deadline) return true;
    return new Date(test.deadline) > new Date();
  });

  const expiredTests = filteredTests.filter((test) => {
    if (!test.deadline) return false;
    return new Date(test.deadline) <= new Date();
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActiveTests = activeTests.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(activeTests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleKerjakan = async (testId, testJudul, testDurasi) => {
    try {
      if (!nis) {
        Swal.fire("Error", "NIS tidak ditemukan", "error");
        return;
      }

      const session = await startTest(testId, nis,kelasId);
      setActiveSessions((prev) => ({ ...prev, [testId]: session }));

      if (!session.SessionID) {
        Swal.fire("Error", "Session ID tidak ditemukan", "error");
        return;
      }

      window.open(`/siswa/ujian/${session.SessionID}`, "_blank");

      Swal.fire({
        title: "Ujian Dimulai!",
        html: `
          <div>
            <p><strong>${testJudul}</strong></p>
            <p>Durasi: ${testDurasi} menit</p>
            <p>Tab ujian telah dibuka. Jangan tutup browser selama ujian berlangsung.</p>
          </div>
        `,
        icon: "success",
        confirmButtonText: "Mengerti",
        buttonsStyling: false,
        customClass: {
          actions: "flex justify-center",
          confirmButton:
            "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        },
      });
    } catch (err) {
      console.error("Error mulai ujian:", err);
      Swal.fire(
        "Error",
        err.response?.data?.error || "Gagal memulai ujian",
        "error"
      );
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <FilterSection
        selectedMapel={selectedMapel}
        setSelectedMapel={setSelectedMapel}
        mapelOptions={mapelOptions}
        judul="Daftar Ujian"
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <ActiveTestsTable
            tests={currentActiveTests}
            activeSessions={activeSessions}
            onKerjakan={handleKerjakan}
            onLanjutkan={handleLanjutkan}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {expiredTests.length > 0 && (
            <ExpiredTestsTable tests={expiredTests.slice(0, 5)} />
          )}
        </>
      )}
    </div>
  );
};

export default ListUjian;
