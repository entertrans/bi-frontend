import React, { useState, useEffect } from "react";
import { getAllKisiKisiByKelas, fetchAllMapelByKelas } from "../../../api/siswaAPI";
import { useAuth } from "../../../contexts/AuthContext";

const DetailKisiKisi = () => {
  const [kisiKisiData, setKisiKisiData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mapelList, setMapelList] = useState([]);
  const [selectedMapel, setSelectedMapel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const { user } = useAuth();
  const kelasId = user?.siswa?.kelas?.kelas_id;

 // Fetch mapel list berdasarkan kelas siswa
const fetchMapel = async () => {
  if (!kelasId) {
    setMapelList([]);
    return;
  }

  try {
    const data = await fetchAllMapelByKelas(kelasId);
    setMapelList(data); // langsung set hasil dari API
  } catch (err) {
    console.error("Gagal ambil mapel:", err);
    setMapelList([]);
  }
};

  // Fetch semua kisi-kisi berdasarkan kelas siswa
  const fetchAllKisiKisi = async () => {
    if (!kelasId) {
      setKisiKisiData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getAllKisiKisiByKelas(kelasId);
      setKisiKisiData(data);
    } catch (err) {
      console.error("Gagal ambil kisi-kisi:", err);
      setKisiKisiData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (kelasId) {
      fetchMapel();
      fetchAllKisiKisi();
    }
  }, [kelasId]);

  // Filter data berdasarkan mapel yang dipilih
  const filteredData = selectedMapel
    ? kisiKisiData.filter(
        (item) => item.kisikisi_mapel === parseInt(selectedMapel)
      )
    : kisiKisiData;

  // Pagination calculation
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Pagination numbers with ellipsis
  const getPaginationNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        endPage = maxVisiblePages + 1;
      }

      if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = totalPages - maxVisiblePages;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        KISI KISI - KELAS {user?.siswa?.kelas?.kelas_nama}
      </h1>

      {/* Filter Section - Hanya Mapel */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <div className="w-full md:w-1/3">
          <select
            className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={selectedMapel}
            onChange={(e) => {
              setSelectedMapel(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">-- Semua Mapel --</option>
            {mapelList.map((mapel) => (
              <option key={mapel.kd_mapel} value={mapel.kd_mapel}>
                {mapel.nm_mapel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info jumlah data */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Menampilkan {filteredData.length} kisi-kisi
        {selectedMapel && ` untuk ${mapelList.find(m => m.kd_mapel == selectedMapel)?.nm_mapel}`}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Memuat data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Mata Pelajaran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Semester
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  UB
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Kisi - Kisi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    {kelasId 
                      ? "Tidak ada data kisi-kisi untuk kelas ini" 
                      : "Tidak dapat mengakses data kisi-kisi"
                    }
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr
                    key={item.kisikisi_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {(currentPage - 1) * itemsPerPage + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.mapel?.nm_mapel || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      Semester {item.kisikisi_semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      UB {item.kisikisi_ub}
                    </td>
                    <td className="px-6 py-4 whitespace-pre-line">
                      {item.kisikisi_deskripsi}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 items-center space-x-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {getPaginationNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" && setCurrentPage(page)
                  }
                  className={`px-3 py-2 rounded border ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } ${
                    typeof page !== "number"
                      ? "cursor-default hover:bg-transparent dark:hover:bg-transparent"
                      : ""
                  }`}
                  disabled={typeof page !== "number"}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>

              <span className="text-sm text-gray-600 dark:text-gray-400 ml-4">
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailKisiKisi;