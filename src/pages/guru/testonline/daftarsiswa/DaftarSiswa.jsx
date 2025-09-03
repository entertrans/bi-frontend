// src/pages/guru/DaftarSiswa.jsx
import React, { useState, useEffect } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { fetchAllSiswa, fetchAllkelas } from "../../../../api/siswaAPI";
import { useNavigate } from "react-router-dom";

const DaftarSiswa = () => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [kelasOptions, setKelasOptions] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const siswaPerPage = 10;
  const navigate = useNavigate();

  // Fetch data siswa dan kelas
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [siswaData, kelasData] = await Promise.all([
          fetchAllSiswa(),
          fetchAllkelas(),
        ]);

        // Filter hanya siswa aktif (soft_deleted = 0 dan tgl_keluar null)
        const aktifSiswa = siswaData.filter(
          (siswa) => siswa.soft_deleted === 0 && siswa.tgl_keluar === null
        );
        setDataSiswa(aktifSiswa);

        // Format options kelas dari data aktif
        const options = [
          { id: "", label: "Semua Kelas" },
          ...kelasData.aktif.map((kelas) => ({
            id: kelas.kelas_id.toString(),
            label: kelas.kelas_nama,
          })),
        ];
        setKelasOptions(options);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data berdasarkan kelas dan pencarian
  const filteredData = dataSiswa.filter((siswa) => {
    const kelasMatch = selectedKelas
      ? siswa.siswa_kelas_id?.toString() === selectedKelas
      : true;
    const searchMatch =
      siswa.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.siswa_nis.includes(searchTerm);
    return kelasMatch && searchMatch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / siswaPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * siswaPerPage,
    currentPage * siswaPerPage
  );
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Fungsi untuk mendapatkan tombol pagination
  const getPaginationButtons = () => {
    const range = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage <= 4) {
        range.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        range.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        range.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return range;
  };

  // Fungsi untuk mendapatkan foto profil
  const getProfilePicture = (siswa) => {
    const profilePicture =
      Array.isArray(siswa.lampiran) &&
      siswa.lampiran.find((l) => l.dokumen_jenis === "profil-picture")?.url;

    return (
      profilePicture ||
      `https://placehold.co/40x40?text=${siswa.siswa_nama.charAt(0)}&font=roboto`
    );
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-white dark:bg-gray-800 shadow rounded-lg flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat data siswa...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        Daftar Siswa Aktif
      </h1>

      {/* Filter */}
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedKelas}
            onChange={(e) => {
              setSelectedKelas(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            {kelasOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari siswa..."
          className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider">Siswa</th>
              <th className="px-6 py-3 text-left">NIS</th>
              <th className="px-6 py-3 w-32 text-left">Kelas</th>
              <th className="px-6 py-3 text-left">Jumlah Uraian</th>
              <th className="px-6 py-3 w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((siswa) => (
                <tr
                  key={siswa.siswa_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <img
                        src={getProfilePicture(siswa)}
                        alt={siswa.siswa_nama}
                        className="w-10 h-10 rounded-full border object-cover"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {siswa.siswa_nama}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{siswa.siswa_nis}</td>
                  <td className="px-6 py-4">
                    {siswa.kelas?.kelas_nama?.replace(/^Kelas\s*/i, "") || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {/* Data uraian bisa diisi dari API khusus untuk guru */}
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-200">
                      Data uraian (dummy)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() =>
                        navigate(`/guru/jawaban/siswa/${siswa.siswa_nis}`)
                      }
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    >
                      Rincian Jawaban
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {searchTerm || selectedKelas
                    ? "Tidak ada siswa yang sesuai dengan filter"
                    : "Tidak ada data siswa"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4 gap-2 flex-wrap items-center text-sm">
          <button
            onClick={() => paginate(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className={`p-2 rounded ${
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            }`}
          >
            <HiChevronLeft className="h-4 w-4" />
          </button>

          {getPaginationButtons().map((num, index) =>
            num === "..." ? (
              <span key={index} className="px-3 py-1 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => paginate(num)}
                className={`px-3 py-1 rounded ${
                  num === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-600 dark:text-white"
                }`}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className={`p-2 rounded ${
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600"
                : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
            }`}
          >
            <HiChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default DaftarSiswa;
