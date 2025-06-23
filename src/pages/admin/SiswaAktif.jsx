import React, { useEffect, useState } from "react";
import { fetchAllSiswa } from "../../api/siswaAPI";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaUserSlash,
  FaUserCheck,
  FaVideo,
  FaVideoSlash,
} from "react-icons/fa";

const SiswaAktifTable = () => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const siswaPerPage = 10;

  useEffect(() => {
    fetchAllSiswa()
      .then((data) => setDataSiswa(data))
      .catch((err) => console.error("Gagal ambil data siswa:", err));
  }, []);

  const filteredData = dataSiswa.filter((siswa) => {
    const kelasMatch = selectedKelas
      ? siswa.siswa_kelas_id.toString() === selectedKelas
      : true;
    const searchMatch =
      siswa.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.siswa_nis.includes(searchTerm);
    return kelasMatch && searchMatch;
  });

  const totalPages = Math.ceil(filteredData.length / siswaPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * siswaPerPage,
    currentPage * siswaPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleKelasOnline = (nis) => {
    if (!window.confirm("Masukkan atau keluarkan dari kelas online?")) return;

    const updated = dataSiswa.map((siswa) =>
      siswa.siswa_nis === nis
        ? {
            ...siswa,
            kelas_online: !siswa.kelas_online,
            kelas_offline: siswa.kelas_online ? siswa.kelas_offline : false,
          }
        : siswa
    );
    setDataSiswa(updated);
  };

  const toggleKelasOffline = (nis) => {
    if (!window.confirm("Masukkan atau keluarkan dari kelas offline?")) return;

    const updated = dataSiswa.map((siswa) =>
      siswa.siswa_nis === nis
        ? {
            ...siswa,
            kelas_offline: !siswa.kelas_offline,
            kelas_online: siswa.kelas_offline ? siswa.kelas_online : false,
          }
        : siswa
    );
    setDataSiswa(updated);
  };

  const kelasOptions = [
    { id: "", label: "Semua Kelas" },
    { id: "14", label: "Kelas X IPA" },
    { id: "15", label: "Kelas XI IPA" },
    { id: "16", label: "Kelas XII IPA" },
  ];

  // Helper untuk buat pagination dengan "..." kalau halaman panjang
  const getPaginationButtons = () => {
    const range = [];
    const total = totalPages;

    if (total <= 7) {
      for (let i = 1; i <= total; i++) range.push(i);
    } else {
      if (currentPage <= 4) {
        range.push(1, 2, 3, 4, 5, "...", total);
      } else if (currentPage >= total - 3) {
        range.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        range.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          total
        );
      }
    }

    return range;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <select
          className="border text-sm border-gray-300 rounded-lg p-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          value={selectedKelas}
          onChange={(e) => {
            setSelectedKelas(e.target.value);
            setCurrentPage(1);
          }}
        >
          {kelasOptions.map((kelas) => (
            <option key={kelas.id} value={kelas.id}>
              {kelas.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Cari siswa..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="block p-2 text-sm border border-gray-300 rounded-lg w-72 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider">Siswa</th>
              <th className="px-6 py-3 text-left">NISN</th>
              <th className="px-6 py-3 w-32 text-left">Kelas</th>
              <th className="px-6 py-3 text-left">Telp</th>
              <th className="px-6 py-3 w-32 text-left">Cabang</th>
              <th className="px-6 py-3 text-left">Program</th>
              <th className="px-6 py-3 w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((siswa) => (
              <tr key={siswa.siswa_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        siswa.siswa_photo
                          ? `https://placehold.co/40x40?text=AA&font=roboto`
                          : `https://placehold.co/40x40?text=AA&font=roboto`
                      }
                      alt={siswa.siswa_nama}
                      className="w-10 h-10 rounded-full border object-cover"
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
                <td className="px-6 py-4">
                  {siswa.kelas?.kelas_nama?.replace(/^Kelas\s*/i, "") || "-"}
                </td>
                <td className="px-6 py-4">{siswa.siswa_no_telp}</td>
                <td className="px-6 py-4">{siswa.Satelit.satelit_nama}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col items-start space-y-1">
                    {siswa.oc === 1 && (
                      <span className="bg-blue-600 text-white px-3 py-1 text-xs rounded shadow">
                        Kelas Online
                      </span>
                    )}
                    {siswa.kc === 1 && (
                      <span className="bg-red-600 text-white px-3 py-1 text-xs rounded shadow">
                        Kelas Offline
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center space-y-1">
                  <div className="flex flex-wrap justify-center gap-1">
                    <Link to={`/admin/siswa/edit/${siswa.siswa_nis}`}>
                      <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
                        Edit
                      </button>
                    </Link>
                    <button className="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700">
                      Keluarkan
                    </button>
                    <button className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                      Absensi
                    </button>
                    <button
                      onClick={() => toggleKelasOnline(siswa.siswa_nis)}
                      className={`px-2 py-1 text-xs rounded transition ${
                        siswa.oc === 1
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Online
                    </button>

                    <button
                      onClick={() => toggleKelasOffline(siswa.siswa_nis)}
                      className={`px-2 py-1 text-xs rounded ${
                        siswa.kc === 1
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Offline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 gap-2 flex-wrap text-sm">
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
      </div>
    </div>
  );
};

export default SiswaAktifTable;
