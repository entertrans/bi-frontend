import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { HiX, HiDocument, HiLink, HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import Swal from "sweetalert2";
import { getKelasOnlineById } from "../../../api/guruAPI";


const SlideKelolaMateri = ({ isOpen, onClose, onSubmit, kelasOnlineId }) => {
  const [materiList, setMateriList] = useState([]);
  const [showFormMateri, setShowFormMateri] = useState(false);
  const [editingMateri, setEditingMateri] = useState(null);
  const [formMateri, setFormMateri] = useState({
    judul: "",
    tipe: "file",
    link: "",
    keterangan: ""
  });

  // 🔥 Pindahkan ke atas
  const [infoKelas, setInfoKelas] = useState({
    topik: "",
    tanggal: "",
    guru: "",
  });

  useEffect(() => {
    const loadData = async () => {
      if (!isOpen || !kelasOnlineId) return;

      try {
        const data = await getKelasOnlineById(kelasOnlineId);

        setMateriList(
          (data.materi || []).map(m => ({
            id: m.id,
            judul: m.judul,
            tipe: m.tipe,
            link: m.link,
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
        console.error(err);
        Swal.fire("Error", "Gagal memuat data kelas online.", "error");
      }
    };

    loadData();
  }, [isOpen, kelasOnlineId]);

  // 🔥 Ganti dummy menjadi:
  const dataKelas = infoKelas;

  // Reset form materi
  useEffect(() => {
    if (!showFormMateri) {
      setFormMateri({
        judul: "",
        tipe: "file",
        link: "",
        keterangan: ""
      });
      setEditingMateri(null);
    }
  }, [showFormMateri]);

  const handleTambahMateri = () => {
    setEditingMateri(null);
    setShowFormMateri(true);
  };

  const handleEditMateri = (materi) => {
    setEditingMateri(materi);
    setFormMateri(materi);
    setShowFormMateri(true);
  };

  const handleHapusMateri = (id) => {
    Swal.fire({
      title: "Yakin hapus materi?",
      text: "Materi akan dihapus permanen",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        setMateriList(materiList.filter(m => m.id !== id));
        Swal.fire("Terhapus!", "Materi berhasil dihapus.", "success");
      }
    });
  };

  const handleSimpanMateri = () => {
    if (!formMateri.judul.trim()) {
      Swal.fire("Error!", "Judul materi harus diisi.", "error");
      return;
    }

    if (formMateri.tipe !== "catatan" && !formMateri.link.trim()) {
      Swal.fire("Error!", "Link/file harus diisi untuk tipe ini.", "error");
      return;
    }

    if (editingMateri) {
      // Edit existing
      setMateriList(materiList.map(m => 
        m.id === editingMateri.id ? { ...formMateri, id: editingMateri.id } : m
      ));
    } else {
      // Tambah baru
      const newMateri = {
        ...formMateri,
        id: Date.now()
      };
      setMateriList([...materiList, newMateri]);
    }

    setShowFormMateri(false);
    Swal.fire("Berhasil!", "Materi berhasil disimpan.", "success");
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

        {/* Slide Panel - PERBAIKAN: Gunakan div wrapper */}
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
                    {dataKelas.topik || "Kelas Online"} - {dataKelas.guru || "Guru"}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 transition-colors duration-150"
                  >
                    <HiPlus className="text-lg" />
                    Tambah Materi
                  </button>
                </div>

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
                      <div key={materi.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow duration-150">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                              {getIconByType(materi.tipe)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                                  {materi.judul}
                                </h3>
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(materi.tipe)} ml-2 flex-shrink-0`}>
                                  {getTypeLabel(materi.tipe)}
                                </span>
                              </div>
                              {materi.keterangan && (
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                                  {materi.keterangan}
                                </p>
                              )}
                              {materi.link && materi.tipe !== 'catatan' && (
                                <div className="text-sm">
                                  {materi.tipe === 'link' ? (
                                    <a 
                                      href={materi.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                      {materi.link}
                                    </a>
                                  ) : (
                                    <span className="text-gray-500 dark:text-gray-400">{materi.link}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              onClick={() => handleEditMateri(materi)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1"
                              title="Edit"
                            >
                              <HiPencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleHapusMateri(materi.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                              title="Hapus"
                            >
                              <HiTrash className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors duration-150"
                >
                  Tutup
                </button>
              </div>
            </div>

            {/* Slide Form Materi - PERBAIKAN: Pisahkan dari slide utama */}
            <Transition show={showFormMateri}>
              <div className="absolute inset-0 bg-white dark:bg-gray-800">
                <div className="flex flex-col h-full">
                  {/* Header Form Materi */}
                  <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20">
                    <div>
                      <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {editingMateri ? "Edit Materi" : "Tambah Materi"}
                      </h3>
                    </div>
                    <button
                      onClick={() => setShowFormMateri(false)}
                      className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <HiX className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Form Content */}
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Judul Materi *
                        </label>
                        <input
                          type="text"
                          value={formMateri.judul}
                          onChange={(e) => setFormMateri({ ...formMateri, judul: e.target.value })}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Masukkan judul materi"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Tipe Materi
                        </label>
                        <select
                          value={formMateri.tipe}
                          onChange={(e) => setFormMateri({ ...formMateri, tipe: e.target.value, link: e.target.value === 'catatan' ? '' : formMateri.link })}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="file">File</option>
                          <option value="link">Link</option>
                          <option value="catatan">Catatan</option>
                        </select>
                      </div>

                      {formMateri.tipe !== 'catatan' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {formMateri.tipe === 'file' ? 'Path/Nama File' : 'URL Link'} *
                          </label>
                          <input
                            type="text"
                            value={formMateri.link}
                            onChange={(e) => setFormMateri({ ...formMateri, link: e.target.value })}
                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={formMateri.tipe === 'file' ? '/files/nama-file.pdf' : 'https://example.com/link'}
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Keterangan
                        </label>
                        <textarea
                          value={formMateri.keterangan}
                          onChange={(e) => setFormMateri({ ...formMateri, keterangan: e.target.value })}
                          rows={3}
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Deskripsi singkat tentang materi ini..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Form Materi */}
                  <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
                    <button
                      onClick={() => setShowFormMateri(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSimpanMateri}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      {editingMateri ? "Update Materi" : "Simpan Materi"}
                    </button>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SlideKelolaMateri;