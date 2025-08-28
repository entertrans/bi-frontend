import React, { useEffect, useState, useMemo } from "react";
import { getUBTestsByKelas, startTest } from "../../../api/testOnlineAPI";
import { fetchAllMapelByKelas } from "../../../api/siswaAPI";
import {
  HiPlay,
  HiFilter,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import { formatTanggalLengkap } from "../../../utils/date";
import Swal from "sweetalert2";
import { useAuth } from "../../../contexts/AuthContext";

const ListUjian = () => {
  const [tests, setTests] = useState([]);
  const [mapelOptions, setMapelOptions] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);

  const { user, setTestSession } = useAuth();
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
    } catch (err) {
      console.error("Gagal ambil data UB:", err);
      Swal.fire("Error", "Gagal mengambil data ujian", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kelasId) {
      fetchMapelOptions();
      fetchUBTests();
    }
  }, [kelasId]);

  // Filter tests berdasarkan mapel
  const filteredTests = useMemo(() => {
    if (!selectedMapel) return tests;

    return tests.filter(
      (test) => test.mapel?.kd_mapel?.toString() === selectedMapel
    );
  }, [tests, selectedMapel]);

  // Filter hanya test yang belum lewat deadline
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
  const currentExpiredTests = expiredTests.slice(0, 5); // Tampilkan maksimal 5 expired tests

  const totalPages = Math.ceil(activeTests.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleKerjakan = async (testId, testJudul) => {
    try {
      if (!nis) {
        Swal.fire("Error", "NIS tidak ditemukan", "error");
        return;
      }

      const session = await startTest(testId, nis);
      console.log("DEBUG session:", session);

      localStorage.setItem("activeTestSession", JSON.stringify(session));

      const sessionId = session.SessionID; // ✅ pakai PascalCase

      if (!sessionId) {
        Swal.fire("Error", "Session ID tidak ditemukan", "error");
        return;
      }

      window.open(`/siswa/ujian/${sessionId}`, "_blank");

      Swal.fire({
        title: "Ujian Dimulai!",
        html: `
        <div>
          <p><strong>${testJudul}</strong></p>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-purple-600 mb-4 md:mb-0">
          Daftar Ujian
        </h1>

        {/* Filter Mapel */}
        <div className="flex items-center gap-3">
          <HiFilter className="text-gray-600 text-xl" />
          <select
            value={selectedMapel}
            onChange={(e) => setSelectedMapel(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="">Semua Mata Pelajaran</option>
            {mapelOptions.map((mapel) => (
              <option key={mapel.kd_mapel} value={mapel.kd_mapel}>
                {mapel.nm_mapel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Memuat data ujian...</p>
        </div>
      ) : (
        <>
          {/* Active Tests */}
          <div className="mb-8">
            {activeTests.length === 0 ? (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 text-center">
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedMapel
                    ? "Tidak ada ujian aktif untuk mata pelajaran ini"
                    : "Tidak ada ujian aktif"}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left">Judul Ujian</th>
                        <th className="px-6 py-3 text-left">Mata Pelajaran</th>
                        <th className="px-6 py-3 text-left">Jumlah Soal</th>
                        <th className="px-6 py-3 text-left">Durasi</th>
                        <th className="px-6 py-3 text-left">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {currentActiveTests.map((test) => (
                        <tr
                          key={test.test_id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-6 py-4 font-medium">
                            <div>
                              <div className="font-semibold">{test.judul}</div>
                              {test.deskripsi && (
                                <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                  {test.deskripsi}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {test?.mapel?.nm_mapel || "-"}
                          </td>
                          <td className="px-6 py-4">
                            {test.jumlah_soal_tampil || 0} soal
                          </td>
                          <td className="px-6 py-4">
                            {test.durasi_menit} menit
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleKerjakan(test.test_id, test.judul)
                              }
                              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              <HiPlay className="text-lg" />
                              Kerjakan
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <HiChevronLeft className="text-xl" />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-2 rounded-lg border ${
                              currentPage === page
                                ? "bg-purple-600 text-white border-purple-600"
                                : "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
                      >
                        <HiChevronRight className="text-xl" />
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Expired Tests */}
          {expiredTests.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-red-600 mb-4">
                Ujian Kadaluarsa ({expiredTests.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 opacity-70">
                  <thead className="bg-gray-100 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left">Judul Ujian</th>
                      <th className="px-6 py-3 text-left">Mata Pelajaran</th>
                      <th className="px-6 py-3 text-left">Jumlah Soal</th>
                      <th className="px-6 py-3 text-left">Durasi</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {currentExpiredTests.map((test) => (
                      <tr key={test.test_id}>
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium">{test.judul}</div>
                            {test.deskripsi && (
                              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {test.deskripsi}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {test?.mapel?.nm_mapel || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {test.jumlah_soal_tampil || 0} soal
                        </td>
                        <td className="px-6 py-4">{test.durasi_menit} menit</td>
                        <td className="px-6 py-4 text-red-500 font-semibold">
                          Kadaluarsa
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ListUjian;
