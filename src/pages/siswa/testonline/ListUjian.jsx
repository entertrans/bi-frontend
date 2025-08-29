import React, { useEffect, useState, useMemo } from "react";
import {
  getUBTestsByKelas,
  startTest,
  getActiveTestSession,
} from "../../../api/testOnlineAPI";
import { fetchAllMapelByKelas } from "../../../api/siswaAPI";
import Swal from "sweetalert2";
import { useAuth } from "../../../contexts/AuthContext";
import FilterSection from "./FilterSection";
import LoadingState from "./LoadingState";
import ActiveTestsTable from "./ActiveTestsTable";
import ExpiredTestsTable from "./ExpiredTestsTable";
import Pagination from "./Pagination";

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
  const fetchUBTests = async () => {
    try {
      if (!kelasId) {
        console.error("Kelas ID tidak ditemukan");
        return;
      }

      setLoading(true);
      const data = await getUBTestsByKelas(kelasId);
      setTests(data);

      if (nis) {
        checkActiveSessions(data);
      }
    } catch (err) {
      console.error("Gagal ambil data UB:", err);
      Swal.fire("Error", "Gagal mengambil data ujian", "error");
    } finally {
      setLoading(false);
    }
  };

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
      Swal.fire(
        "Error",
        err.response?.data?.error || "Gagal melanjutkan ujian",
        "error"
      );
    }
  };

  useEffect(() => {
    if (kelasId) {
      fetchMapelOptions();
      fetchUBTests();
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

      const session = await startTest(testId, nis);
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
