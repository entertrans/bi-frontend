import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  HiPencil,
  HiTrash,
  HiPlus,
  HiLink,
  HiClock,
  HiCalendar,
  HiDocumentText,
} from "react-icons/hi";
import Swal from "sweetalert2";
import SlideFormKelasOnline from "./SlideFormKelasOnline";
import SlideKelolaMateri from "./SlideKelolaMateri";
import { getKelasOnlineByMapel } from "../../../api/guruAPI";

const DetailKelasOnline = () => {
  const { kelas_id, mapel } = useParams();
  const location = useLocation();
  const { idpelajaran } = location.state || {};

  const [listKelas, setListKelas] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingData, setEditingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showMateri, setShowMateri] = useState(false);
  const [selectedKelasId, setSelectedKelasId] = useState(null);

  // Dummy data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getKelasOnlineByMapel(idpelajaran);
        console.log(data);
        // Mapping response backend → listKelas
        const mapped = data.map((item) => ({
          id_kelas_online: item.id_kelas_online,
          judul_kelas: item.judul_kelas,
          nama_guru: item.nama_guru,
          nama_mapel: mapel,
          tanggal_kelas: item.tanggal_kelas,
          jam_mulai: item.jam_mulai,
          jam_selesai: item.jam_selesai,
          status: item.status,
          link_kelas: item.link_kelas,
        }));

        setListKelas(mapped);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Gagal memuat data kelas online", "error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [idpelajaran, mapel]);

  // Hapus data
  const handleDelete = (id) => {
    Swal.fire({
      title: "Yakin hapus kelas?",
      text: "Data kelas online akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: true,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    }).then((res) => {
      if (res.isConfirmed) {
        setListKelas(listKelas.filter((x) => x.id_kelas_online !== id));
        Swal.fire("Terhapus!", "Kelas online berhasil dihapus.", "success");
      }
    });
  };

  // Edit data
  const handleEdit = (item) => {
    setEditingData(item);
    setShowForm(true);
  };

  // Tambah data baru
  const handleAdd = () => {
    setEditingData(null);
    setShowForm(true);
  };

  // Simpan form
  const handleSave = (formData) => {
    if (formData.id_kelas_online) {
      // Edit existing
      setListKelas(
        listKelas.map((x) =>
          x.id_kelas_online === formData.id_kelas_online ? formData : x
        )
      );
      Swal.fire("Berhasil!", "Kelas online berhasil diupdate.", "success");
    } else {
      // Tambah baru
      const newData = {
        ...formData,
        id_kelas_online: Date.now(),
        nama_guru: "Nisrina Agustama",
        nama_mapel: mapel,
        status: "akan_berlangsung",
      };
      setListKelas([...listKelas, newData]);
      Swal.fire("Berhasil!", "Kelas online berhasil ditambahkan.", "success");
    }

    setShowForm(false);
    setEditingData(null);
  };

  // Format waktu
  const formatWaktu = (jam) => {
    return jam ? jam.substring(0, 5) : "-";
  };

  // Format tanggal
  const formatTanggal = (tanggal) => {
    if (!tanggal) return "-";
    const date = new Date(tanggal);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusStyles = {
      akan_berlangsung:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      sedang_berlangsung:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      selesai: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return (
      statusStyles[status] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusLabels = {
      akan_berlangsung: "Akan Datang",
      sedang_berlangsung: "Sedang Berlangsung",
      selesai: "Selesai",
    };
    return statusLabels[status] || status;
  };
  // Function untuk handle kelola materi
  const handleKelolaMateri = (idKelasOnline) => {
    setSelectedKelasId(idKelasOnline);
    setShowMateri(true);
  };
  // Function untuk handle simpan materi (dummy)
  const handleSaveMateri = (materiData) => {
    console.log("Materi disimpan untuk kelas:", selectedKelasId, materiData);
    // Di sini nanti akan integrate dengan API
    Swal.fire("Berhasil!", "Materi berhasil disimpan.", "success");
    setShowMateri(false);
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Kelas Online {mapel}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            ID Pelajaran: {idpelajaran} | Kelas ID: {kelas_id}
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-200"
          onClick={handleAdd}
        >
          <HiPlus className="text-lg" />
          Tambah Kelas Online
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Memuat data kelas online...
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Judul Kelas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Link
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {listKelas.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <HiCalendar className="text-4xl text-gray-300 dark:text-gray-600 mb-2" />
                      <p className="text-lg font-medium">
                        Belum ada kelas online
                      </p>
                      <p className="text-sm">
                        Klik tombol "Tambah Kelas Online" untuk membuat kelas
                        pertama
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                listKelas.map((item) => (
                  <tr
                    key={item.id_kelas_online} // INI YANG DIPERBAIKI
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.judul_kelas}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {item.nama_mapel} - {item.nama_guru}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatTanggal(item.tanggal_kelas)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <div className="flex items-center gap-1">
                        <HiClock className="text-gray-400" />
                        {formatWaktu(item.jam_mulai)} -{" "}
                        {formatWaktu(item.jam_selesai)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.link_kelas ? (
                        <a
                          href={item.link_kelas}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                        >
                          <HiLink />
                          Buka Link
                        </a>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex justify-center gap-3">
                        {/* Button Kelola Materi */}
                        <button
                          onClick={() =>
                            handleKelolaMateri(item.id_kelas_online)
                          }
                          className="text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-150"
                          title="Kelola Materi"
                        >
                          <HiDocumentText className="text-lg" />
                        </button>

                        <button
                          onClick={() => handleEdit(item)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-150"
                          title="Edit"
                        >
                          <HiPencil className="text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id_kelas_online)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                          title="Hapus"
                        >
                          <HiTrash className="text-lg" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Slide Form */}
      <SlideFormKelasOnline
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingData(null);
        }}
        onSubmit={handleSave}
        editingData={editingData}
      />
      <SlideKelolaMateri
        isOpen={showMateri}
        onClose={() => {
          setShowMateri(false);
          setSelectedKelasId(null);
        }}
        onSubmit={handleSaveMateri}
        kelasOnlineId={selectedKelasId}
      />
    </div>
  );
};

export default DetailKelasOnline;