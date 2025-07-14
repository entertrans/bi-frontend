import React, { useEffect, useState } from "react";
import {
  fetchAllTagihan,
  tambahTagihan,
  editTagihan,
  deleteTagihan,
} from "../../../api/siswaAPI";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { showAlert } from "../../../utils/toast";

const MySwal = withReactContent(Swal);

const Tagihan = () => {
  const [dataTagihan, setDataTagihan] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const tagihanPerPage = 10;

  const fetchData = async () => {
    try {
      const res = await fetchAllTagihan();
      setDataTagihan(res);
    } catch (err) {
      console.error("Gagal mengambil data tagihan:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = dataTagihan.filter(
    (item) =>
      item.jns_tagihan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nom_tagihan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / tagihanPerPage);

  const paginate = (pageNum) => setCurrentPage(pageNum);

  const paginatedData = filteredData.slice(
    (currentPage - 1) * tagihanPerPage,
    currentPage * tagihanPerPage
  );

  const handleTambahTagihan = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Tambah Tagihan Baru",
      html:
        '<input id="tagihan-jenis" class="swal2-input" placeholder="Jenis Tagihan">' +
        '<input id="tagihan-nominal" class="swal2-input" placeholder="Nominal Tagihan" type="number" oninput="this.value = this.value.replace(/[^0-9]/g, \'\')">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 mr-1 rounded",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 ml-1 rounded",
      },
      preConfirm: () => {
        const jenis = document.getElementById("tagihan-jenis").value;
        const nominal = document.getElementById("tagihan-nominal").value;

        if (!jenis || !nominal) {
          Swal.showValidationMessage("Semua field harus diisi.");
          return false;
        }

        if (isNaN(nominal) || Number(nominal) <= 0) {
          Swal.showValidationMessage(
            "Nominal harus berupa angka dan lebih dari 0."
          );
          return false;
        }

        return {
          jns_tagihan: jenis,
          nom_tagihan: Number(nominal),
        };
      },
    });

    if (formValues) {
      try {
        await tambahTagihan(formValues);
        showAlert("Tagihan berhasil ditambahkan", "success");
        fetchData(); // jika kamu ingin reload data tagihan
      } catch (error) {
        console.error("Gagal menambah tagihan:", error);
        showAlert("Gagal menambah tagihan", "error");
      }
    }
  };

  const handleEdit = async (tagihan) => {
    const { value: formValues } = await Swal.fire({
      title: "Edit Tagihan",
      html:
        `<input id="tagihan-jenis" class="swal2-input" placeholder="Jenis Tagihan" value="${tagihan.jns_tagihan}">` +
        `<input id="tagihan-nominal" class="swal2-input" placeholder="Nominal Tagihan" type="number" value="${tagihan.nom_tagihan}" oninput="this.value = this.value.replace(/[^0-9]/g, '')">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded mr-2",
        cancelButton:
          "bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded ml-2",
      },
      preConfirm: () => {
        const jenis = document.getElementById("tagihan-jenis").value;
        const nominal = document.getElementById("tagihan-nominal").value;

        if (!jenis || !nominal) {
          Swal.showValidationMessage("Semua field harus diisi.");
          return false;
        }

        if (isNaN(nominal) || Number(nominal) <= 0) {
          Swal.showValidationMessage(
            "Nominal harus berupa angka dan lebih dari 0."
          );
          return false;
        }

        return {
          jns_tagihan: jenis,
          nom_tagihan: Number(nominal),
        };
      },
    });

    if (formValues) {
      try {
        await editTagihan(tagihan.id_tagihan, formValues); // kamu buat API-nya ya
        showAlert("Tagihan berhasil diperbarui", "success");
        fetchData(); // refresh data
      } catch (err) {
        showAlert("Gagal mengupdate tagihan", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Hapus Tagihan?",
      text: "Tagihan akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded mr-2",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded ml-2",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteTagihan(id); // kamu buat API-nya ya
        showAlert("Tagihan berhasil dihapus", "success");
        fetchData(); // refresh data
      } catch (error) {
        showAlert("Gagal menghapus tagihan", "error");
      }
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari jenis atau nominal tagihan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleTambahTagihan}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow"
        >
          Tambah Tagihan
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">ID</th>
              <th className="px-6 py-3 text-left">Jenis Tagihan</th>
              <th className="px-6 py-3 text-left">Nominal</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length > 0 ? (
              paginatedData.map((item) => (
                <tr key={item.id_tagihan}>
                  <td className="px-6 py-4">{item.id_tagihan}</td>
                  <td className="px-6 py-4">{item.jns_tagihan}</td>
                  <td className="px-6 py-4">
                    Rp{Number(item.nom_tagihan).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(item)} // ← ini kamu sesuaikan dengan variable datamu
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded shadow"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id_tagihan)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded shadow"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-8 text-gray-500 dark:text-gray-300"
                >
                  Tidak ada data tagihan.
                </td>
              </tr>
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
    </div>
  );
};

export default Tagihan;
