import React, { useEffect, useState } from "react";
import { getAllBankSoalTO } from "../../api/testOnlineAPI";
import { FaEdit, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { showAlert } from "../../utils/toast";

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
        soal.mapel.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;
      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";
      return sortOrder === "asc"
        ? aVal.toString().localeCompare(bVal.toString())
        : bVal.toString().localeCompare(aVal.toString());
    });

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
      <h1 className="text-2xl font-bold mb-4 text-blue-600 dark:text-blue-400">
        Daftar Bank Soal Test Online
      </h1>

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
                onClick={() => handleSort("soal_id")}
              >
                No{" "}
                {sortField === "soal_id"
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
              <th className="px-6 py-3 text-left">Tipe Soal</th>
              <th className="px-6 py-3 text-left">Pertanyaan</th>
              <th className="px-6 py-3 text-left">Bobot</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada data soal.
                </td>
              </tr>
            )}

            {paginatedData.map((soal, idx) => (
              <tr key={soal.soal_id}>
                <td className="px-6 py-4">{soal.soal_id}</td>
                <td className="px-6 py-4">{soal.mapel}</td>
                <td className="px-6 py-4">{soal.tipe_soal}</td>
                <td className="px-6 py-4 truncate max-w-xs">
                  {soal.pertanyaan}
                </td>
                <td className="px-6 py-4">{soal.bobot}</td>
                <td className="px-6 py-4 space-x-2 text-gray-500 dark:text-gray-300">
                  <FaEdit
                    title="Edit Soal"
                    className="inline-block cursor-pointer hover:text-blue-600"
                    // onClick={() => handleEdit(soal.soal_id)}
                  />
                  <FaTrash
                    title="Hapus Soal"
                    className="inline-block cursor-pointer hover:text-red-600"
                    onClick={() => handleDelete(soal.soal_id)}
                  />
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
    </div>
  );
};

export default TestOnline;
