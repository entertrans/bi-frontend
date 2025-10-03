import React, { useState, useEffect } from "react";
import { getAllKisiKisiByKelas, fetchAllMapelByKelas } from "../../../api/siswaAPI";
import { useAuth } from "../../../contexts/AuthContext";
import { cardStyles } from "../../../utils/CardStyles";

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
      setMapelList(data);
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

  // Get alternating colors for rows
  const getRowColor = (index) => {
    const colors = [
      "bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20",
      "bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20",
      "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20",
      "bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`${cardStyles.base} ${cardStyles.blue.container} border-l-4`}>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        📚 KISI KISI - KELAS {user?.siswa?.kelas?.kelas_nama}
      </h1>

      {/* Filter Section - Hanya Mapel */}
      <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
        <div className="w-full md:w-1/3">
          <select
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={selectedMapel}
            onChange={(e) => {
              setSelectedMapel(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="" className="text-gray-500">-- Semua Mapel --</option>
            {mapelList.map((mapel) => (
              <option key={mapel.kd_mapel} value={mapel.kd_mapel} className="text-gray-800 dark:text-gray-200">
                {mapel.nm_mapel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info jumlah data */}
      <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
        <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
          📊 Menampilkan {filteredData.length} kisi-kisi
          {selectedMapel && ` untuk ${mapelList.find(m => m.kd_mapel == selectedMapel)?.nm_mapel}`}
        </span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Memuat data...</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  No
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  📖 Mata Pelajaran
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  📅 Semester
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  🎯 UB
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                  📝 Kisi - Kisi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-4xl mb-2">📭</span>
                      <p className="text-lg font-medium mb-1">Tidak ada data</p>
                      <p className="text-sm">
                        {kelasId 
                          ? "Tidak ada data kisi-kisi untuk kelas ini" 
                          : "Tidak dapat mengakses data kisi-kisi"
                        }
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr
                    key={item.kisikisi_id}
                    className={`transition-all duration-200 ${getRowColor(index)}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-gray-200">
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-xs font-bold">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {item.mapel?.nm_mapel || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
                        Semester {item.kisikisi_semester}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
                        UB {item.kisikisi_ub}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                      {item.kisikisi_deskripsi}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Menampilkan {indexOfFirst + 1}-{Math.min(indexOfLast, filteredData.length)} dari {filteredData.length} data
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      currentPage === 1
                        ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    }`}
                  >
                    &lt; Sebelumnya
                  </button>

                  <div className="flex space-x-1">
                    {getPaginationNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === "number" && setCurrentPage(page)
                        }
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
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
                  </div>

                  <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`px-3 py-2 rounded-lg border transition-all ${
                      currentPage === totalPages
                        ? "border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    }`}
                  >
                    Selanjutnya &gt;
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailKisiKisi;