import React, { useEffect, useState } from "react";
import { getAllBankSoalTO } from "../../../api/testOnlineAPI";
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import SlideTambahBankSoal from "./SlideTambahBankSoal";
import Swal from "sweetalert2";
import { showAlert } from "../../../utils/toast";

const TestOnline = () => {
  const [dataSoal, setDataSoal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const soalPerPage = 10;

  const fetchData = async () => {
    try {
      const data = await getAllBankSoalTO();
      setDataSoal(data);
    } catch (err) {
      console.error("Gagal ambil data bank soal:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleDelete = (soalID) => {
    Swal.fire({
      title: "Hapus Soal?",
      text: "Soal akan dihapus permanen dari bank soal.",
      icon: "warning",
      showCancelButton: true,
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
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Panggil API delete soal (bikin sendiri di api/testOnlineAPI.js)
          // await deleteBankSoal(soalID);
          setDataSoal((prev) => prev.filter((s) => s.soal_id !== soalID));
          showAlert("Soal berhasil dihapus.", "success");
        } catch (err) {
          console.error(err);
          showAlert("Gagal menghapus soal.", "error");
        }
      }
    });
  };

  // Filter & sort data
  const filteredData = dataSoal
    .filter(
      (soal) =>
        soal.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        soal.mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (soal?.kelas?.kelas_nama || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      let aVal = "";
      let bVal = "";

      if (sortField === "kelas_id") {
        aVal = a.kelas_id || 0;
        bVal = b.kelas_id || 0;
        // sorting numerik
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }

      if (sortField === "kelas_nama") {
        aVal = a?.kelas?.kelas_nama || "";
        bVal = b?.kelas?.kelas_nama || "";
        return sortOrder === "asc"
          ? aVal.toString().localeCompare(bVal.toString())
          : bVal.toString().localeCompare(aVal.toString());
      }

      aVal = a[sortField] || "";
      bVal = b[sortField] || "";

      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

  const [showTambahSoal, setShowTambahSoal] = useState(false);
  const handleTambahSoal = async (newSoal) => {
    try {
      // Contoh: panggil API simpan soal baru (buat sendiri di api/testOnlineAPI.js)
      // await addBankSoal(newSoal);
      // Refresh data soal
      await fetchData();
      setShowTambahSoal(false);
      showAlert("Soal berhasil ditambahkan", "success");
    } catch (err) {
      console.error(err);
      showAlert("Gagal menambahkan soal", "error");
    }
  };

  const totalPages = Math.ceil(filteredData.length / soalPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * soalPerPage,
    currentPage * soalPerPage
  );

  const paginate = (pageNum) => setCurrentPage(pageNum);

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Daftar Bank Soal Test Online
        </h1>
        <button
          onClick={() => setShowTambahSoal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Tambah Bank Soal
        </button>
      </div>

      <input
        type="text"
        placeholder="Cari soal / mapel..."
        className="mb-4 p-2 border rounded w-full md:w-80 dark:bg-gray-700 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700 cursor-pointer">
            <tr>
              <th
                className="px-6 py-3 text-left"
                onClick={() => handleSort("kelas_id")}
              >
                Kelas{" "}
                {sortField === "kelas_id"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                className="px-6 py-3 text-left"
                onClick={() => handleSort("mapel")}
              >
                Mapel{" "}
                {sortField === "mapel" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th className="px-6 py-3 text-left">Pembuat</th>
              <th className="px-6 py-3 text-left">Tipe Soal</th>
              <th className="px-6 py-3 text-left">Pertanyaan</th>
              <th className="px-6 py-3 text-left">Bobot</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada data soal.
                </td>
              </tr>
            )}

            {paginatedData.map((soal, idx) => (
              <tr key={soal.soal_id}>
                <td className="px-6 py-4">
                  {soal?.kelas?.kelas_nama.replace(/^Kelas\s*/i, "")}
                </td>
                <td className="px-6 py-4">{soal.mapel}</td>
                <td className="px-6 py-4">{soal?.guru?.guru_nama}</td>
                <td className="px-6 py-4">{soal.tipe_soal}</td>
                <td className="px-6 py-4 truncate max-w-xs">
                  {soal.pertanyaan}
                </td>
                <td className="px-6 py-4">{soal.bobot}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <HiPencil
                      title="Edit Soal"
                      className="inline-block cursor-pointer hover:text-blue-600 text-lg"
                    />
                    <HiTrash
                      title="Hapus Soal"
                      className="inline-block cursor-pointer hover:text-red-600 text-lg"
                      onClick={() => handleDelete(soal.soal_id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2 flex-wrap text-sm">
        {getPaginationButtons().map((num, idx) =>
          num === "..." ? (
            <span key={idx} className="px-3 py-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={idx}
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
      <SlideTambahBankSoal
        isOpen={showTambahSoal}
        onClose={() => setShowTambahSoal(false)}
        onSubmit={handleTambahSoal}
      />
    </div>
  );
};

export default TestOnline;