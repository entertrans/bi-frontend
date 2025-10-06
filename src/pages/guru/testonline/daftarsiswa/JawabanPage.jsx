// src/pages/guru/JawabanPage.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchJawabanSiswaDetail,
  fetchJawabanBySiswa,
  resetTestSession,
} from "../../../../api/testOnlineAPI";
import Swal from "sweetalert2";
import { formatTanggalIndo } from "../../../../utils/format";
import { showAlert } from "../../../../utils/toast";
import {
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineArrowPath,
} from "react-icons/hi2";

// ✅ Komponen kecil untuk status
const StatusBadge = ({ status, submited }) => {
  const statusMap = {
    "✅ sudah dikerjakan": {
      class:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    "⚠️ sedang mengerjakan": {
      class:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    "❌ belum dikerjakan": {
      class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  };

  const statusText =
    status || (submited ? "✅ sudah dikerjakan" : "❌ belum dikerjakan");
  const statusClass =
    statusMap[statusText]?.class ||
    "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap select-none ${statusClass}`}
    >
      {statusText}
    </span>
  );
};

// ✅ Komponen kecil untuk review
const ReviewBadge = ({ butuhReview, reviewed }) => {
  if (!butuhReview) {
    return <span className="text-gray-500 dark:text-gray-400">-</span>;
  }

  if (reviewed) {
    return (
      <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
        Sudah Review
      </span>
    );
  }

  return (
    <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
      Butuh Review
    </span>
  );
};

const JawabanPage = () => {
  const { siswa_nis } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [siswa, setSiswa] = useState(null);
  const [tests, setTests] = useState([]);

  // 🔎 filter & pagination state
  const [filterJenis, setFilterJenis] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [siswaData, testData] = await Promise.all([
        fetchJawabanSiswaDetail(siswa_nis),
        fetchJawabanBySiswa(siswa_nis),
      ]);
      setSiswa(siswaData);
      setTests(testData?.results || []);
    } catch (err) {
      console.error("Gagal ambil data:", err);
      showAlert("Gagal memuat data jawaban", "error");
    } finally {
      setIsLoading(false);
    }
  }, [siswa_nis]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleResetTest = async (sessionId, testId, nisSiswa) => {
    const result = await Swal.fire({
      title: "Yakin reset test ini?",
      text: "Semua jawaban & data sesi akan dihapus permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, reset!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (result.isConfirmed) {
      try {
        // Kirim semua data yang diperlukan ke API
        await resetTestSession(sessionId, {
          test_id: testId,
          siswa_nis: nisSiswa,
        });
        showAlert("Test berhasil direset", "success");
        loadData();
      } catch (err) {
        console.error("Error reset test:", err);
        showAlert("Terjadi kesalahan saat mereset test", "error");
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // 🔎 daftar jenis test unik
  const jenisOptions = useMemo(() => {
    const setJenis = new Set(tests.map((t) => t.jenis));
    return ["all", ...Array.from(setJenis)];
  }, [tests]);

  // 🔎 data setelah difilter
  const filteredTests = useMemo(() => {
    return filterJenis === "all"
      ? tests
      : tests.filter((t) => t.jenis === filterJenis);
  }, [tests, filterJenis]);

  // 🔎 pagination
  const totalPages = Math.ceil(filteredTests.length / itemsPerPage);
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTests.slice(start, start + itemsPerPage);
  }, [filteredTests, currentPage]);

  // handle ganti filter
  const handleFilterChange = (e) => {
    setFilterJenis(e.target.value);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            &larr; Kembali
          </button>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Manajemen Jawaban
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Memuat data jawaban...
        </p>
      </div>
    );
  }

  if (!siswa) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            &larr; Kembali
          </button>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Manajemen Jawaban
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Data siswa tidak ditemukan untuk NIS: {siswa_nis}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          &larr; Kembali
        </button>
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Manajemen Jawaban
        </h1>
      </div>

      {/* Info Siswa */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              NIS
            </p>
            <p className="text-lg font-bold">{siswa.siswa_nis}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Nama
            </p>
            <p className="text-lg font-bold">{siswa.siswa_nama}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Kelas
            </p>
            <p className="text-lg font-bold">
              {siswa.kelas?.kelas_nama || "-"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Jenis Kelamin
            </p>
            <p className="text-lg font-bold">
              {siswa.siswa_jenkel === "L" ? "Laki-laki" : "Perempuan"}
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">
          Filter Jenis Test:
        </label>
        <select
          value={filterJenis}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          {jenisOptions.map((j) => (
            <option key={j} value={j}>
              {j === "all" ? "Semua Jenis" : j.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Table Test */}
      <div className="overflow-x-auto">
        {paginatedTests.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tipe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Mapel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Judul
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Nilai
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedTests.map((t) => (
                <tr
                  key={t.test_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4">{t.jenis}</td>
                  <td className="px-6 py-4">{t.mapel}</td>
                  <td className="px-6 py-4">{t.judul}</td>
                  <td className="px-6 py-4 font-bold">
                    {t.nilai !== null && t.nilai !== undefined ? t.nilai : "-"}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={t.status} submited={t.submited} />
                  </td>
                  <td className="px-6 py-4">
                    <ReviewBadge
                      butuhReview={t.butuh_review}
                      reviewed={t.reviewed}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {t.tanggal ? formatTanggalIndo(t.tanggal) : "-"}
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    {/* Tampilkan aksi hanya jika test sudah submitted */}
                    {t.submited ? (
                      <>
                        <button
                          onClick={() =>
                            navigate(
                              `/guru/jawaban/siswa/detail/${t.session_id}`,
                              {
                                state: { jenis: t.jenis },
                              }
                            )
                          }
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                          title="Detail Jawaban"
                        >
                          <HiOutlineDocumentMagnifyingGlass size={20} />
                        </button>

                        <button
                          onClick={() =>
                            handleResetTest(t.session_id, t.test_id, siswa_nis)
                          }
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                          title="Reset Test"
                        >
                          <HiOutlineArrowPath size={20} />
                        </button>
                      </>
                    ) : (
                      <span className="text-gray-500 dark:text-gray-400">
                        -
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Tidak ada test ditemukan untuk filter ini</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Menampilkan {paginatedTests.length} dari {filteredTests.length} test
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 dark:text-white"
            >
              Sebelumnya
            </button>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-100 rounded">
              {currentPage}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 dark:text-white"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JawabanPage;
