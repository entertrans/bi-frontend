import React, { useEffect, useState, useCallback } from "react";
import { HiChevronLeft, HiChevronRight, HiEye, HiPlay } from "react-icons/hi";
import Swal from "sweetalert2";
import { fetchAllkelas, fetchAllMapelByKelas } from "../../../api/siswaAPI";
import { showAlert } from "../../../utils/toast";

// nanti ganti ini ke API sesungguhnya
const dummyKelasOnline = [
  {
    id_kelas_online: 1,
    kelas: "7A",
    mapel: "Matematika",
    guru: "Alvin Putra",
    link: "",
  },
  {
    id_kelas_online: 2,
    kelas: "8B",
    mapel: "IPA",
    guru: "Nisrina Agustama",
    link: "https://meet.google.com/xyz-abc-pqr",
  },
];

const GuruKelasOnline = () => {
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");
  const [data, setData] = useState(dummyKelasOnline);
  const [filteredData, setFilteredData] = useState(dummyKelasOnline);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const loadKelas = useCallback(async () => {
    try {
      const data = await fetchAllkelas();
      setKelasList(data.aktif || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadMapel = useCallback(async (kelasId) => {
    try {
      const data = await fetchAllMapelByKelas(kelasId);
      setMapelList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    loadKelas();
  }, [loadKelas]);

  useEffect(() => {
    let result = data;
    if (selectedKelas) {
      result = result.filter((d) => d.kelas === selectedKelas);
    }
    if (selectedMapel) {
      result = result.filter((d) => d.mapel === selectedMapel);
    }
    setFilteredData(result);
    setCurrentPage(1);
  }, [selectedKelas, selectedMapel, data]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => setCurrentPage(page);

  const handleOpenClass = (id) => {
    Swal.fire({
      title: "Aktifkan Kelas Online?",
      text: "Kelas akan dianggap sedang berlangsung.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, buka kelas",
      cancelButtonText: "Batal",
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#6b7280",
    }).then((result) => {
      if (result.isConfirmed) {
        showAlert("Kelas berhasil diaktifkan", "success");
      }
    });
  };

  const handleDetail = (id) => {
    // nanti diarahkan ke halaman detail kelas
    showAlert(`Menuju ke detail kelas ID: ${id}`, "info");
  };

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

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded shadow flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat data kelas online...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manajemen Kelas Online
        </h2>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-4 mb-6">
        <select
          value={selectedKelas}
          onChange={(e) => {
            setSelectedKelas(e.target.value);
            loadMapel(e.target.value);
          }}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
        >
          <option value="">Semua Kelas</option>
          {kelasList.map((k) => (
            <option key={k.kelas_id} value={k.kelas_nama}>
              {k.kelas_nama}
            </option>
          ))}
        </select>

        <select
          value={selectedMapel}
          onChange={(e) => setSelectedMapel(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          disabled={!selectedKelas}
        >
          <option value="">Semua Mapel</option>
          {mapelList.map((m) => (
            <option key={m.kd_mapel} value={m.nm_mapel}>
              {m.nm_mapel}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border p-3 text-left">No</th>
              <th className="border p-3 text-left">Kelas</th>
              <th className="border p-3 text-left">Mapel</th>
              <th className="border p-3 text-left">Guru</th>
              <th className="border p-3 text-left">Link Meet</th>
              <th className="border p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr
                  key={item.id_kelas_online}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border p-3">{indexOfFirst + i + 1}</td>
                  <td className="border p-3">{item.kelas}</td>
                  <td className="border p-3">{item.mapel}</td>
                  <td className="border p-3">{item.guru}</td>
                  <td className="border p-3 text-blue-600 dark:text-blue-400 truncate max-w-[200px]">
                    {item.link || "Belum diatur"}
                  </td>
                  <td className="border p-3 text-center flex justify-center gap-3">
                    <HiEye
                      title="Detail Kelas"
                      className="text-blue-600 cursor-pointer hover:text-blue-700 text-lg"
                      onClick={() => handleDetail(item.id_kelas_online)}
                    />
                    <HiPlay
                      title="Buka Kelas"
                      className="text-green-600 cursor-pointer hover:text-green-700 text-lg"
                      onClick={() => handleOpenClass(item.id_kelas_online)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="border p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada data kelas online
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2 flex-wrap items-center text-sm">
          <button
            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
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
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 rounded ${
                  num === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                }`}
              >
                {num}
              </button>
            )
          )}

          <button
            onClick={() =>
              handlePageChange(Math.min(totalPages, currentPage + 1))
            }
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

export default GuruKelasOnline;
