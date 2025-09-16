import React, { useEffect, useState } from "react";
import { HiChevronLeft, HiChevronRight, HiTrash } from "react-icons/hi";
import Swal from "sweetalert2";
import {
  getAllKisiKisiGuru,
  createKisiKisi,
  deleteKisiKisi,
} from "../../../api/guruAPI";
import { fetchAllMapelByKelas, fetchAllkelas } from "../../../api/siswaAPI";
import SlideTambahKisiKisi from "./SlideTambahKisiKisi";
import { showAlert } from "../../../utils/toast";

const GuruKisiKisi = () => {
  const [kisiKisi, setKisiKisi] = useState([]);
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [formMapelList, setFormMapelList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");
  const [isSlideOpen, setIsSlideOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    kisikisi_kelas_id: "",
    kisikisi_mapel: "",
    kisikisi_ub: "",
    kisikisi_semester: "",
    kisikisi_deskripsi: "",
  });

  const itemsPerPage = 10;

  useEffect(() => {
    loadData();
    loadKelas();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllKisiKisiGuru();
      setKisiKisi(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Gagal memuat data kisi-kisi");
      console.error("Error details:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadKelas = async () => {
    try {
      const data = await fetchAllkelas();
      const kelasAktif = data.aktif || [];
      setKelasList(kelasAktif);
    } catch (err) {
      setError("Gagal memuat data kelas");
      console.error(err);
    }
  };

  const loadMapel = async (kelasId, forForm = false) => {
    if (!kelasId) {
      if (forForm) {
        setFormMapelList([]);
      } else {
        setMapelList([]);
      }
      return;
    }

    try {
      const data = await fetchAllMapelByKelas(kelasId);
      const mapelData = Array.isArray(data) ? data : [];
      if (forForm) {
        setFormMapelList(mapelData);
      } else {
        setMapelList(mapelData);
      }
    } catch (err) {
      setError("Gagal memuat data mapel");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Kisi-kisi yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteKisiKisi(id);
        showAlert("Kisi-kisi berhasil dihapus.", "success");
        // Tampilkan notifikasi sukses

        loadData();
        setCurrentPage(1);
      } catch (err) {
        // Tampilkan notifikasi error
        showAlert("Gagal menghapus kisi-kisi.", "error");
        console.error(err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createKisiKisi({
        ...formData,
        kisikisi_kelas_id: parseInt(formData.kisikisi_kelas_id, 10),
        kisikisi_mapel: parseInt(formData.kisikisi_mapel, 10),
        kisikisi_semester: parseInt(formData.kisikisi_semester, 10),
        kisikisi_ub: formData.kisikisi_ub.toString(),
      });
      setIsSlideOpen(false);
      showAlert("Kisi-kisi berhasil ditambahkan.", "success");
      // ✅ Reset form
      setFormData({
        kisikisi_kelas_id: "",
        kisikisi_mapel: "",
        kisikisi_ub: "",
        kisikisi_semester: "",
        kisikisi_deskripsi: "",
      });

      setFormMapelList([]);
      loadData();
      setCurrentPage(1);
    } catch (err) {
      setError("Gagal menambah kisi-kisi");
      console.error(err);
    }
  };

  // Filter data tanpa pencarian
  const filteredData = kisiKisi.filter((item) => {
    const byKelas = selectedKelas
      ? String(item.kisikisi_kelas_id) === String(selectedKelas)
      : true;

    const byMapel = selectedMapel
      ? String(item.mapel?.kd_mapel) === String(selectedMapel)
      : true;

    return byKelas && byMapel;
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fungsi untuk mendapatkan tombol pagination yang advanced
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
            Memuat data kisi-kisi...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Manajemen Kisi-Kisi
        </h2>
        <button
          onClick={() => setIsSlideOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Tambah Kisi-Kisi</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Filter (tanpa search) */}
      <div className="flex flex-wrap gap-4 items-center mb-6">
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedKelas}
            onChange={(e) => {
              const kelasId = e.target.value;
              setSelectedKelas(kelasId);
              setSelectedMapel("");
              setCurrentPage(1);
              loadMapel(kelasId, false);
            }}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k.kelas_id} value={k.kelas_id}>
                {k.kelas_nama}
              </option>
            ))}
          </select>

          <select
            value={selectedMapel}
            onChange={(e) => {
              setSelectedMapel(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            disabled={!selectedKelas}
          >
            <option value="">Semua Mapel</option>
            {mapelList.map((m) => (
              <option key={m.kd_mapel} value={m.kd_mapel}>
                {m.nm_mapel}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Info Jumlah Data */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        Menampilkan {currentData.length} dari {filteredData.length} kisi-kisi
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300 dark:border-gray-600">
          <thead>
            <tr className="bg-gray-100 dark:bg-gray-700">
              <th className="border p-3 text-left">No</th>
              <th className="border p-3 text-left">Kelas</th>
              <th className="border p-3 text-left">Mapel</th>
              <th className="border p-3 text-left">Semester</th>
              <th className="border p-3 text-left">UB</th>
              <th className="border p-3 text-left">Deskripsi</th>
              <th className="border p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length > 0 ? (
              currentData.map((item, i) => (
                <tr
                  key={item.kisikisi_id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="border p-3">{indexOfFirst + i + 1}</td>
                  <td className="border p-3">
                    {item.kelas?.kelas_nama || "N/A"}
                  </td>
                  <td className="border p-3">
                    {item.mapel?.nm_mapel || "N/A"}
                  </td>
                  <td className="border p-3">
                    Semester {item.kisikisi_semester}
                  </td>
                  <td className="border p-3">UB {item.kisikisi_ub}</td>
                  <td className="border p-3">{item.kisikisi_deskripsi}</td>
                  <td className="border p-3 text-center">
                    <HiTrash
                      title="Hapus Kisi-Kisi"
                      className="inline-block cursor-pointer hover:text-red-600 text-lg text-red-500 transition-colors"
                      onClick={() => handleDelete(item.kisikisi_id)}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="border p-4 text-center text-gray-500 dark:text-gray-400"
                >
                  {selectedKelas || selectedMapel
                    ? "Tidak ada kisi-kisi yang sesuai dengan filter"
                    : "Tidak ada data kisi-kisi"}
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

      {/* Slide Form */}
      <SlideTambahKisiKisi
        isOpen={isSlideOpen}
        onClose={() => {
          setIsSlideOpen(false);
          setError("");
        }}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        kelasList={kelasList}
        formMapelList={formMapelList}
        error={error}
        loadMapel={loadMapel}
      />
    </div>
  );
};

export default GuruKisiKisi;
