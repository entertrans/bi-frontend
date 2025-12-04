import React, { useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import { HiEye, HiPlay } from "react-icons/hi";
import Swal from "sweetalert2";
import { showAlert } from "../../../utils/toast";
import { getAllMapelList } from "../../../api/siswaAPI";


const GuruKelasOnline = () => {
  const [dataMapel, setDataMapel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchMapel = async () => {
      try {
        const res = await getAllMapelList();
        setDataMapel(res);
      } catch (err) {
        console.error("Gagal ambil data mapel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMapel();
  }, []);

  // Filter berdasarkan kelas jika dipilih
  const filteredData = selectedKelas
    ? dataMapel.filter((item) => item.kelas_id === parseInt(selectedKelas))
    : dataMapel;

  // Pagination
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const goToPreviousPage = () =>
    currentPage > 1 && setCurrentPage(currentPage - 1);
  const goToNextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);

  // Aksi tombol
  const handleDetail = (id) => {
    showAlert(`Lihat detail pelajaran ID: ${id}`, "info");
  };

  const handleOpenClass = (id) => {
    Swal.fire({
      title: "Aktifkan Kelas Online?",
      text: "Kelas ini akan dianggap sedang berlangsung.",
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

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        Daftar Kelas & Mapel
      </h1>

      {/* Filter Kelas */}
      <div className="mb-4">
        <select
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
        >
          <option value="">-- Semua Kelas --</option>
          {[...new Set(dataMapel.map((d) => d.kelas_id))].map((id) => {
            const namaKelas = dataMapel.find((d) => d.kelas_id === id)
              ?.kelas_nama;
            return (
              <option key={id} value={id}>
                {namaKelas}
              </option>
            );
          })}
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
                <th className="px-6 py-3 text-left">Guru</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {currentData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-4 text-gray-500 dark:text-gray-400"
                  >
                    Tidak ada data mapel.
                  </td>
                </tr>
              ) : (
                currentData.map((item) => (
                  <tr key={item.pelajaran_id}>
                    <td className="px-6 py-4">
                      {item.kelas_nama.replace(/^Kelas\s*/i, "")}
                    </td>
                    <td className="px-6 py-4">{item.nm_mapel}</td>
                    <td className="px-6 py-4">
                      {item.guru_mapels || "Belum ada guru"}
                    </td>
                    <td className="p-3 flex justify-center gap-3">
                      <HiEye
                        title="Detail Kelas"
                        className="text-blue-600 cursor-pointer hover:text-blue-700 text-lg"
                        onClick={() =>
                          navigate(`/guru/kelas-online/${item.kelas_id}/${item.nm_mapel}`, {
                            state: { idpelajaran: item.pelajaran_id, mapel: item.nm_mapel },
                          })
                        }
                      />
                      <HiPlay
                        title="Buka Kelas"
                        className="text-green-600 cursor-pointer hover:text-green-700 text-lg"
                        onClick={() => handleOpenClass(item.pelajaran_id)}
                      />
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
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Halaman {currentPage} dari {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                &gt;
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GuruKelasOnline;
