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
import ActiveTugasTable from "../testonline/common/ActiveTugasTable";
import Pagination from "../testonline/common/Pagination";

const ListTugas = () => {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState({}); // mirip activeSessions
  const [mapelOptions, setMapelOptions] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;
  const kelasId = user?.siswa?.kelas?.kelas_id;
  const typeTest = "tugas"; // 👉 bedain dari ujian

  // 🔄 Refresh daftar tugas
  const refreshAll = async () => {
    try {
      if (!kelasId) return;
      setLoading(true);

      const data = await gettestbykelas(typeTest, kelasId);
      setTasks(data);

      if (nis) await checkSubmissions(data);
    } catch (err) {
      console.error("Gagal refresh data tugas:", err);
      Swal.fire("Error", "Gagal ambil data tugas", "error");
    } finally {
      setLoading(false);
    }
  };

  // 🔄 Ambil mapel
  const fetchMapelOptions = async () => {
    try {
      if (!kelasId) return;
      const data = await fetchAllMapelByKelas(kelasId);
      setMapelOptions(data);
    } catch (err) {
      console.error("Gagal ambil data mapel:", err);
    }
  };

  // 🔄 Cek apakah siswa sudah submit tugas tertentu
  const checkSubmissions = async (tasksData) => {
    const results = {};
    for (const task of tasksData) {
      try {
        const session = await getActiveTestSession(task.test_id, nis);
        if (session) results[task.test_id] = session;
      } catch {
        results[task.test_id] = null;
      }
    }
    setSubmissions(results);
  };

  useEffect(() => {
    if (kelasId) {
      fetchMapelOptions();
      refreshAll();
    }
  }, [kelasId]);

  // 🔎 Filter berdasarkan mapel
  const filteredTasks = useMemo(() => {
    if (!selectedMapel) return tasks;
    return tasks.filter(
      (task) => task.mapel?.kd_mapel?.toString() === selectedMapel
    );
  }, [tasks, selectedMapel]);

  // 🔎 Pisahin aktif & expired
  const activeTasks = filteredTasks.filter((task) => {
    if (!task.deadline) return true;
    return new Date(task.deadline) > new Date();
  });

  const expiredTasks = filteredTasks.filter((task) => {
    if (!task.deadline) return false;
    return new Date(task.deadline) <= new Date();
  });

  // 📄 Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentActiveTasks = activeTasks.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(activeTasks.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 📝 Handler mulai kerjakan tugas
  const handleKerjakan = async (taskId, taskJudul) => {
    try {
      if (!nis) {
        Swal.fire("Error", "NIS tidak ditemukan", "error");
        return;
      }

      let session = submissions[taskId];

      // Kalau sudah ada session, langsung buka lagi
      if (!session) {
        session = await startTest(taskId, nis);
        setSubmissions((prev) => ({ ...prev, [taskId]: session }));
      }

      if (!session?.SessionID) {
        Swal.fire("Error", "Session ID tidak ditemukan", "error");
        return;
      }

      window.open(`/siswa/ujian/${session.SessionID}`, "_blank");
    } catch (err) {
      console.error("Error mulai tugas:", err);
      Swal.fire("Error", "Gagal membuka tugas", "error");
    }
  };

  // 📄 Handler lihat hasil tugas
  const handleView = (taskId) => {
    const session = submissions[taskId];
    if (!session?.SessionID) {
      Swal.fire("Error", "Session ID tidak ditemukan", "error");
      return;
    }
    window.open(`/siswa/ujian/${session.SessionID}`, "_blank");
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <FilterSection
        selectedMapel={selectedMapel}
        setSelectedMapel={setSelectedMapel}
        mapelOptions={mapelOptions}
        judul="Daftar Tugas"
      />

      {loading ? (
        <LoadingState />
      ) : (
        <>
          <ActiveTugasTable
            tasks={currentActiveTasks}
            submissions={submissions}
            onKerjakan={handleKerjakan}
            onView={handleView}
          />

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}

          {expiredTasks.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-semibold mb-2">Tugas Berakhir</h2>
              <ActiveTugasTable
                tasks={expiredTasks}
                submissions={submissions}
                onKerjakan={handleKerjakan}
                onView={handleView}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListTugas;
