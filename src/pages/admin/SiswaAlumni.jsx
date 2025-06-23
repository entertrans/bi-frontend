import React, { useState } from "react";
import siswaDummy from "../../data/siswaDummy";

import { Link } from "react-router-dom";
import { FaTrash, FaUndo } from "react-icons/fa";

const SiswaAlumni = () => {
  const [selectedKelas, setSelectedKelas] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = siswaDummy.filter((siswa) => {
    const kelasMatch = selectedKelas
      ? siswa.siswa_kelas_id === selectedKelas
      : true;
    const searchMatch =
      siswa.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.siswa_nis.includes(searchTerm);
    return kelasMatch && searchMatch;
  });
  const [dataSiswa, setDataSiswa] = useState(filteredData);

  const handleHapusPermanen = (nis) => {
    if (window.confirm("Yakin ingin menghapus data ini secara permanen?")) {
      console.log("Hapus data permanen siswa NIS:", nis);
      // Tambahkan logika API hapus
    }
  };

  const handleAktifkanKembali = (nis) => {
    if (window.confirm("Aktifkan kembali siswa ini?")) {
      console.log("Aktifkan kembali siswa NIS:", nis);
      // Update status jadi aktif, misal lewat API
    }
  };

  const tahunAjaran = [
    "2022/2023",
    "2023/2024",
    "2024/2025",
    "2025/2026",
  ];

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Filter & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <select
          className="border text-sm border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
        >
          <option value="">Tahun Ajaran</option>
          {tahunAjaran.map((ta) => (
            <option key={ta} value={ta}>
              {ta}
            </option>
          ))}
        </select>

        <div className="relative">
          <input
            type="text"
            placeholder="Cari siswa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-72 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left dark: tracking-wider">
                Siswa
              </th>
              <th className="px-6 py-3 text-left">NISN</th>
              <th className="px-6 py-3 text-left">Alumni</th>
              <th className="px-6 py-3 text-left">Telp</th>
              <th className="px-6 py-3 text-left">Cabang</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.map((siswa) => (
              <tr key={siswa.siswa_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <img
                      src={siswa.siswa_photo}
                      alt={siswa.siswa_nama}
                      className="w-10 h-10 rounded-full border"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {siswa.siswa_nama}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-300">
                        {siswa.siswa_nis}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">{siswa.siswa_nisn}</td>
                <td className="px-6 py-4">{siswa.siswa_kelas_id}</td>
                <td className="px-6 py-4">{siswa.siswa_no_telp}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    {siswa.satelit}
                  </div>
                </td>

                <td className="px-6 py-4 text-center space-x-2 text-gray-500 dark:text-gray-300">
                  <FaTrash
                    title="Hapus Permanen"
                    className="inline-block cursor-pointer hover:text-red-600"
                    onClick={() => handleHapusPermanen(siswa.siswa_nis)}
                  />
                  <FaUndo
                    title="Aktifkan Kembali"
                    className="inline-block cursor-pointer hover:text-green-600"
                    onClick={() => handleAktifkanKembali(siswa.siswa_nis)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiswaAlumni;
