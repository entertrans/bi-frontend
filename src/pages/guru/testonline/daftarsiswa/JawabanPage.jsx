// src/pages/guru/JawabanPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchJawabanSiswaDetail,
  fetchJawabanBySiswa,
} from "../../../../api/testOnlineAPI";
import { formatTanggalIndo } from "../../../../utils/format";

// ✅ Komponen kecil untuk status
const StatusBadge = ({ status, submited }) => {
  let classes =
    "px-2 py-1 rounded text-xs font-medium whitespace-nowrap select-none ";

  if (status.includes("✅") || submited) {
    classes +=
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  } else if (status.includes("⚠️")) {
    classes +=
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  } else {
    classes += "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  }

  return (
    <span className={classes}>
      {status || (submited ? "✅ sudah dikerjakan" : "❌ belum dikerjakan")}
    </span>
  );
};

// ✅ Komponen kecil untuk review
const ReviewBadge = ({ butuhReview, reviewed }) => {
  if (!butuhReview) {
    return <span className="text-gray-400">-</span>;
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

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [siswaData, testData] = await Promise.all([
          fetchJawabanSiswaDetail(siswa_nis),
          fetchJawabanBySiswa(siswa_nis),
        ]);
        setSiswa(siswaData);
        setTests(testData?.results || []);
      } catch (err) {
        console.error("❌ Gagal ambil data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [siswa_nis]);

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
    setCurrentPage(1); // reset halaman ke 1
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat data jawaban...
          </p>
        </div>
      </div>
    );
  }

  if (!siswa) {
    return (
      <div className="p-8">
        <p>Data siswa tidak ditemukan untuk NIS: {siswa_nis}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Manajemen Jawaban - {siswa.siswa_nama || "Siswa"}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          ← Kembali
        </button>
      </div>

      {/* Info Siswa */}
      <div className="mb-6 text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium">NIS:</span> {siswa.siswa_nis}
        </p>
        <p>
          <span className="font-medium">Kelas:</span>{" "}
          {siswa.kelas.kelas_nama || "-"}
        </p>
        <p>
          <span className="font-medium">Jenis Kelamin:</span>{" "}
          {siswa.siswa_jenkel === "L" ? "Laki-laki" : "Perempuan"}
        </p>
      </div>

      {/* Filter */}
      <div className="mb-4 flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Filter Jenis Test:
        </label>
        <select
          value={filterJenis}
          onChange={handleFilterChange}
          className="px-3 py-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          {jenisOptions.map((j) => (
            <option key={j} value={j}>
              {j === "all" ? "Semua" : j.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Table Test */}
      <div className="overflow-x-auto">
        {paginatedTests.length > 0 ? (
          <table className="w-full text-sm text-left border dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3">Jenis Test</th>
                <th className="px-4 py-3">Mapel</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Nilai</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Review</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTests.map((t) => (
                <tr key={t.test_id} className="border-b dark:border-gray-600">
                  <td className="px-4 py-3">{t.jenis}</td>
                  <td className="px-4 py-3">{t.mapel}</td>
                  <td className="px-4 py-3">{t.judul}</td>
                  <td className="px-4 py-3">
                    {t.nilai !== null && t.nilai !== undefined ? (
                      <span className="font-medium">{t.nilai}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={t.status} submited={t.submited} />
                  </td>
                  <td className="px-4 py-3">
                    <ReviewBadge
                      butuhReview={t.butuh_review}
                      reviewed={t.reviewed}
                    />
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    {t.submited || t.butuh_review ? (
                      <button className="text-blue-600 hover:underline text-sm dark:text-blue-400">
                        Detail Jawaban
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">Belum ada</span>
                    )}
                    <button className="text-red-600 hover:underline text-sm dark:text-red-400">
                      Reset Test
                    </button>
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
            Halaman {currentPage} dari {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600 dark:text-white"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JawabanPage;
