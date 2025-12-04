import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { HiX, HiDocument, HiLink, HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import Swal from "sweetalert2";
import { getKelasOnlineById, createMateri, updateMateri, deleteMateri } from "../../../api/guruAPI";
import FormMateri from "./FormMateri"; // Import komponen FormMateri

const SlideKelolaMateri = ({ isOpen, onClose, onSubmit, kelasOnlineId }) => {
  const [materiList, setMateriList] = useState([]);
  const [showFormMateri, setShowFormMateri] = useState(false);
  const [editingMateri, setEditingMateri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [infoKelas, setInfoKelas] = useState({
    topik: "",
    tanggal: "",
    guru: "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isOpen || !kelasOnlineId) return;

      setIsLoading(true);
      try {
        const data = await getKelasOnlineById(kelasOnlineId);

        setMateriList(
          (data.materi || []).map(m => ({
            id: m.id,
            judul: m.judul,
            tipe: m.tipe,
            url_file: m.url_file || m.link,
            keterangan: m.keterangan,
            uploaded_at: m.uploaded_at
          }))
        );

        setInfoKelas({
          topik: data.topik,
          tanggal: data.tanggal,
          guru: data.guru,
        });

      } catch (err) {
        console.error("Error loading data:", err);
        Swal.fire("Error", "Gagal memuat data kelas online.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isOpen, kelasOnlineId]);

  const handleTambahMateri = () => {
    setEditingMateri(null);
    setShowFormMateri(true);
  };

  const handleEditMateri = (materi) => {
    setEditingMateri(materi);
    setShowFormMateri(true);
  };

  const handleHapusMateri = async (id) => {
    const result = await Swal.fire({
      title: "Yakin hapus materi?",
      text: "Materi akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        await deleteMateri(id);
        
        setMateriList(materiList.filter(m => m.id !== id));
        Swal.fire("Berhasil!", "Materi berhasil dihapus.", "success");
      } catch (err) {
        console.error("Error deleting materi:", err);
        Swal.fire("Error!", "Gagal menghapus materi.", "error");
      }
    }
  };

  const handleSimpanMateri = async (formData) => {
    setIsSubmitting(true);

    try {
      const payload = {
        judul: formData.judul.trim(),
        tipe: formData.tipe,
        url_file: formData.tipe !== "catatan" ? formData.url_file.trim() : null,
        keterangan: formData.keterangan.trim() || null,
        id_kelas_online: kelasOnlineId
      };

      let response;
      if (editingMateri) {
        // Update existing materi
        response = await updateMateri(editingMateri.id, payload);
        
        // Update local state
        setMateriList(materiList.map(m => 
          m.id === editingMateri.id ? { ...response.data, id: editingMateri.id } : m
        ));
      } else {
        // Create new materi
        response = await createMateri(payload);
        
        // Add to local state
        setMateriList([...materiList, { ...response.data, id: response.data.id || Date.now() }]);
      }

      setShowFormMateri(false);
      Swal.fire("Berhasil!", "Materi berhasil disimpan.", "success");
      
      // If there's an onSubmit callback, call it
      if (onSubmit) {
        onSubmit(materiList);
      }
    } catch (err) {
      console.error("Error saving materi:", err);
      
      const errorMessage = err.response?.data?.message || "Gagal menyimpan materi.";
      Swal.fire("Error!", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getIconByType = (tipe) => {
    switch (tipe) {
      case 'file':
        return <HiDocument className="text-blue-500 text-xl" />;
      case 'link':
        return <HiLink className="text-green-500 text-xl" />;
      case 'catatan':
        return <HiDocument className="text-purple-500 text-xl" />;
      default:
        return <HiDocument className="text-gray-500 text-xl" />;
    }
  };

  const getTypeLabel = (tipe) => {
    const labels = {
      'file': 'File',
      'link': 'Link', 
      'catatan': 'Catatan'
    };
    return labels[tipe] || tipe;
  };

  const getTypeBadge = (tipe) => {
    const typeStyles = {
      'file': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'link': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'catatan': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return typeStyles[tipe] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const MateriItem = ({ materi }) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-150">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            {getIconByType(materi.tipe)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {materi.judul}
                </h3>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(materi.tipe)}`}>
                  {getTypeLabel(materi.tipe)}
                </span>
              </div>
            </div>
            
            {materi.keterangan && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                {materi.keterangan}
              </p>
            )}
            
            {materi.url_file && materi.tipe !== 'catatan' && (
              <div className="text-sm mb-2">
                {materi.tipe === 'link' ? (
                  <a 
                    href={materi.url_file} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 break-all"
                  >
                    {materi.url_file}
                  </a>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400 break-all">{materi.url_file}</span>
                )}
              </div>
            )}
            
            {materi.uploaded_at && (
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Ditambahkan: {formatDate(materi.uploaded_at)}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          <button
            onClick={() => handleEditMateri(materi)}
            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Edit"
            disabled={isSubmitting}
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleHapusMateri(materi.id)}
            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Hapus"
            disabled={isSubmitting}
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* Backdrop */}
        <Transition.Child
          enter="transition-opacity ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
        </Transition.Child>

        {/* Slide Panel */}
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <div className="relative bg-white dark:bg-gray-800 w-full max-w-2xl h-full shadow-xl">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-purple-50 dark:bg-purple-900/20">
                <div>
                  <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    Kelola Materi Kelas
                  </h2>
                  <p className="text-sm text-purple-800 dark:text-purple-200 mt-1">
                    {infoKelas.topik || "Kelas Online"} - {infoKelas.guru || "Guru"}
                  </p>
                  {infoKelas.tanggal && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {infoKelas.tanggal}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Button Tambah Materi */}
                <div className="mb-6">
                  <button
                    onClick={handleTambahMateri}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    <HiPlus className="text-lg" />
                    Tambah Materi
                  </button>
                </div>

                {/* Loading State */}
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Memuat data...</p>
                  </div>
                ) : (
                  <>
                    {/* Daftar Materi */}
                    {materiList.length === 0 ? (
                      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        <HiDocument className="text-4xl mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                        <p className="text-lg font-medium">Belum ada materi</p>
                        <p className="text-sm">Tambahkan materi pertama untuk kelas ini</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {materiList.map((materi) => (
                          <MateriItem key={materi.id} materi={materi} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Form Materi */}
            <FormMateri
              isOpen={showFormMateri}
              onClose={() => setShowFormMateri(false)}
              onSave={handleSimpanMateri}
              initialData={editingMateri}
              kelasInfo={infoKelas}
              isSubmitting={isSubmitting}
            />
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SlideKelolaMateri;