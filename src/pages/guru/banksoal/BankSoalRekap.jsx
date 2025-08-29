import React, { useEffect, useState } from "react";
import { getAllRekapBankSoal } from "../../../api/bankSoalAPI";
import { fetchAllkelas, fetchAllMapelByKelas } from "../../../api/siswaAPI";
import { useNavigate } from "react-router-dom";

const BankSoalRekap = () => {
  const [rekapData, setRekapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kelasList, setKelasList] = useState({ aktif: [] });
  const [mapelList, setMapelList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();

  const fetchRekap = async () => {
    try {
      const data = await getAllRekapBankSoal();
      setRekapData(data);
    } catch (err) {
      console.error("Gagal ambil rekap bank soal:", err);
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
    const maxVisiblePages = 5; // Jumlah halaman yang terlihat di tengah

    if (totalPages <= maxVisiblePages + 2) {
      // Jika total halaman sedikit, tampilkan semua
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      // Calculate start and end of visible pages
      let startPage = Math.max(
        2,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

      // Adjust if we're at the beginning
      if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
        endPage = maxVisiblePages + 1;
      }

      // Adjust if we're at the end
      if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
        startPage = totalPages - maxVisiblePages;
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pages.push("...");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i);
        }
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      // Always show last page
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
        Rekap Bank Soal Aktif
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
            {/* Table content sama seperti sebelumnya */}
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Kelas</th>
                <th className="px-6 py-3 text-left">Mapel</th>
                <th className="px-6 py-3 text-left">PG</th>
                <th className="px-6 py-3 text-left">PG Kompleks</th>
                <th className="px-6 py-3 text-left">Isian</th>
                <th className="px-6 py-3 text-left">True/False</th>
                <th className="px-6 py-3 text-left">Uraian</th>
                <th className="px-6 py-3 text-left">Mencocokkan</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    Tidak ada data rekap soal.
                  </td>
                </tr>
              )}

              {currentData.map((row) => (
                <tr key={`${row.kelas_id}-${row.mapel_id}`}>
                  <td className="px-6 py-4">
                    {row.kelas_nama.replace(/^Kelas\s*/i, "") || "-"}
                  </td>
                  <td className="px-6 py-4">{row.mapel_nama}</td>
                  <td className="px-6 py-4">{row.pg}</td>
                  <td className="px-6 py-4">{row.pg_kompleks}</td>
                  <td className="px-6 py-4">{row.isian_singkat}</td>
                  <td className="px-6 py-4">{row.true_false}</td>
                  <td className="px-6 py-4">{row.uraian}</td>
                  <td className="px-6 py-4">{row.mencocokkan}</td>
                  <td className="px-6 py-4 font-bold">{row.total}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/guru/banksoal/detail/${row.kelas_id}/${row.mapel_id}`
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
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

export default BankSoalRekap;
