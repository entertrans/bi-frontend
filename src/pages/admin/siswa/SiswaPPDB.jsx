import React, { useEffect, useState } from "react";
import {
  fetchAllPPDB,
  batalkanSiswa,
  terimaSiswa,
} from "../../../api/siswaAPI";
import { useNavigate, Link } from "react-router-dom";
import SiswaDetailPanel from "./SiswaDetailPanel"; // sesuaikan path-nya
import { showAlert } from "../../../utils/toast";
import Swal from "sweetalert2";

const SiswaPPDB = () => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // <-- dipindah ke sini
  const siswaPerPage = 5;
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleClosePanel = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedSiswa(null), 300);
  };
  const fetchData = async () => {
    try {
      const siswa = await fetchAllPPDB();
      setDataSiswa(siswa);
    } catch (err) {
      console.error("Gagal mengambil data PPDB:", err);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    async function getData() {
      try {
        const siswa = await fetchAllPPDB();
        setDataSiswa(siswa);
      } catch (err) {
        console.error("Gagal mengambil data PPDB:", err);
      }
    }
    getData();
  }, []);

  const handleLanjutkan = (nis) => {
    const siswa = dataSiswa.find((s) => s.siswa_nis === nis);
    if (siswa) {
      setSelectedSiswa(siswa);
      setIsDetailOpen(true);
    }
  };

  const handleBatalkan = async (nis) => {
    const result = await Swal.fire({
      title: "Yakin?",
      text: "Apakah kamu yakin ingin membatalkan siswa ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, batalkan!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center", // << ini untuk center tombol
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await batalkanSiswa(nis);
      showAlert("Siswa berhasil dibatalkan", "success");
      fetchData();
    } catch (error) {
      console.error("Gagal membatalkan siswa:", error);
      showAlert("Gagal membatalkan siswa", "error");
    }
  };

  const handleTerima = async (nis) => {
    const result = await Swal.fire({
      title: "Terima Siswa?",
      text: "Apakah kamu yakin ingin menerima siswa ini menjadi siswa aktif?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, terima!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await terimaSiswa(nis);
      showAlert("Siswa berhasil diterima.", "success");
      fetchData(); // refresh data
    } catch (error) {
      console.error("Gagal menerima siswa:", error);
      showAlert("Gagal menerima siswa.", "error");
    }
  };

  const filteredData = dataSiswa.filter(
    (siswa) =>
      siswa.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.siswa_nis.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / siswaPerPage); // <-- dipindah ke sini

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * siswaPerPage,
    currentPage * siswaPerPage
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nama atau NIS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
        />
        <Link
          to="/admin/siswa/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow"
        >
          Tambah Siswa
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Siswa</th>
              <th className="px-6 py-3 text-left">NISN</th>
              <th className="px-6 py-3 text-left">Jenis Kelamin</th>
              <th className="px-6 py-3 text-left">Cabang</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-gray-500 dark:text-gray-300"
                >
                  Belum ada siswa yang terdaftar di tahap PPDB.
                </td>
              </tr>
            ) : (
              paginatedData.map((siswa) => {
                // 👇 ambil foto profile dari lampiran jika ada
                const profilePicture =
                  (Array.isArray(siswa.lampiran) &&
                    siswa.lampiran.find(
                      (l) => l.dokumen_jenis === "profil-picture"
                    )?.url) ||
                  `https://placehold.co/40x40?text=AA&font=roboto`;

                return (
                  <tr key={siswa.siswa_nis}>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={profilePicture}
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
                      {siswa.siswa_jenkel === "L" ? "Laki-laki" : "Perempuan"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 mr-2"></div>
                        {siswa.Satelit?.satelit_nama || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-yellow-600 font-medium">
                      Pending
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleLanjutkan(siswa.siswa_nis)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded shadow"
                      >
                        Lanjutkan
                      </button>
                      <button
                        onClick={() => handleTerima(siswa.siswa_nis)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded shadow"
                      >
                        Terima
                      </button>
                      <button
                        onClick={() => handleBatalkan(siswa.siswa_nis)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded shadow"
                      >
                        Batalkan
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4 gap-2 flex-wrap text-sm">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => paginate(pageNum)}
            className={`px-3 py-1 rounded ${
              pageNum === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-600 dark:text-white"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
      {/* Backdrop saat panel aktif */}
      {isDetailOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleClosePanel}
        />
      )}

      {/* Panel Detail */}
      <SiswaDetailPanel
        siswa={selectedSiswa}
        isOpen={isDetailOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default SiswaPPDB;
