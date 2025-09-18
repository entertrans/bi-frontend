import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllRekapNilai } from "../../../api/guruAPI";
import { fetchAllkelas, fetchAllMapelByKelas } from "../../../api/siswaAPI";

const RekapNilai = () => {
  const [rekapData, setRekapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kelasList, setKelasList] = useState({ aktif: [] });
  const [mapelList, setMapelList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [openMenu, setOpenMenu] = useState(null); // Untuk mengontrol menu yang terbuka
  const menuRefs = useRef({});
  const navigate = useNavigate();

  // Fungsi untuk menutup menu ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openMenu) {
        const menuElement = document.getElementById(openMenu);
        if (menuElement && !menuElement.contains(event.target)) {
          // Cek jika yang diklik bukan tombol menu itu sendiri
          const buttonElement = event.target.closest("button");
          if (!buttonElement || !buttonElement.contains(event.target)) {
            setOpenMenu(null);
          }
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenu]);

  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? null : menuId);
  };

  const fetchRekap = async () => {
    try {
      const data = await getAllRekapNilai();
      setRekapData(data);
    } catch (err) {
      console.error("Gagal ambil rekap nilai:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await fetchAllkelas();
      setKelasList({
        aktif: res.aktif || [],
      });
    } catch (err) {
      console.error("Gagal ambil kelas:", err);
    }
  };

  useEffect(() => {
    const fetchMapel = async () => {
      if (selectedKelas) {
        try {
          const data = await fetchAllMapelByKelas(selectedKelas);
          setMapelList(data);
          setSelectedMapel("");
        } catch (err) {
          console.error("Gagal ambil mapel:", err);
          setMapelList([]);
          setSelectedMapel("");
        }
      } else {
        setMapelList([]);
        setSelectedMapel("");
      }
    };

    fetchMapel();
  }, [selectedKelas]);

  useEffect(() => {
    fetchRekap();
    fetchKelas();
  }, []);

  const filteredData = rekapData.filter((item) => {
    const matchKelas = selectedKelas
      ? item.kelas_id === parseInt(selectedKelas)
      : true;
    const matchMapel = selectedMapel
      ? item.mapel_id === parseInt(selectedMapel)
      : true;
    return matchKelas && matchMapel;
  });

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Fungsi untuk generate pagination numbers dengan ellipsis
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
        Rekap Nilai
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:space-x-2 mb-4">
        <select
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
        >
          <option value="">-- Pilih Kelas --</option>
          {kelasList.aktif.map((k) => (
            <option key={k.kelas_id} value={k.kelas_id}>
              {k.kelas_nama}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={selectedMapel}
          onChange={(e) => setSelectedMapel(e.target.value)}
          disabled={!selectedKelas}
        >
          <option value="">-- Pilih Mapel --</option>
          {mapelList.map((m) => (
            <option key={m.kd_mapel} value={m.kd_mapel}>
              {m.nm_mapel}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Kelas</th>
                <th className="px-6 py-3 text-left">Mapel</th>
                <th className="px-6 py-3 text-left">Ulangan Bulanan</th>
                <th className="px-6 py-3 text-left">Test Review</th>
                <th className="px-6 py-3 text-left">Tugas</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Tidak ada data rekap nilai.
                  </td>
                </tr>
              )}

              {currentData.map((row) => {
                const menuId = `menu-${row.kelas_id}-${row.mapel_id}`;
                const isMenuOpen = openMenu === menuId;

                return (
                  <tr key={`${row.kelas_id}-${row.mapel_id}`}>
                    <td className="px-6 py-4">
                      {row.kelas_nama.replace(/^Kelas\s*/i, "") || "-"}
                    </td>
                    <td className="px-6 py-4">{row.mapel_nama}</td>
                    <td className="px-6 py-4">{row.jml_ub || 0}</td>
                    <td className="px-6 py-4">{row.jml_tr || 0}</td>
                    <td className="px-6 py-4">{row.jml_tugas || 0}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block text-left">
                        <button
                          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          onClick={() => toggleMenu(menuId)}
                        >
                          ⋮
                        </button>
                        <div
                          id={menuId}
                          ref={(el) => (menuRefs.current[menuId] = el)}
                          className={`absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded shadow-lg z-10 ${
                            isMenuOpen ? "" : "hidden"
                          }`}
                        >
                          <button
                            onClick={() => {
                              navigate(
                                `/guru/nilai/ub/${row.kelas_id}/${row.mapel_id}`
                              );
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Detail UB
                          </button>
                          <button
                            onClick={() => {
                              navigate(
                                `/guru/nilai/tr/${row.kelas_id}/${row.mapel_id}`
                              );
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Detail TR
                          </button>
                          <button
                            onClick={() => {
                              navigate(
                                `/guru/nilai/tugas/${row.kelas_id}/${row.mapel_id}`
                              );
                              setOpenMenu(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            Detail Tugas
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Enhanced Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &lt;
              </button>

              {/* Page Numbers */}
              {getPaginationNumbers().map((page, index) => (
                <button
                  key={index}
                  onClick={() =>
                    typeof page === "number" ? setCurrentPage(page) : null
                  }
                  className={`px-3 py-2 rounded border ${
                    currentPage === page
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  } ${
                    typeof page !== "number"
                      ? "cursor-default hover:bg-transparent"
                      : ""
                  }`}
                  disabled={typeof page !== "number"}
                >
                  {page}
                </button>
              ))}

              {/* Next Button */}
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>

              {/* Total Pages Info */}
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

export default RekapNilai;
