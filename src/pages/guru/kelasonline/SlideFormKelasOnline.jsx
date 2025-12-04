import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { HiX, HiCalendar, HiClock, HiLink, HiAcademicCap } from "react-icons/hi";

const SlideFormKelasOnline = ({ isOpen, onClose, onSubmit, editingData }) => {
  const [formData, setFormData] = useState({
    id_kelas_online: null,
    judul_kelas: "",
    tanggal_kelas: "",
    jam_mulai: "",
    jam_selesai: "",
    link_kelas: "",
  });

  const [errors, setErrors] = useState({});

  // Reset form ketika editingData berubah
  useEffect(() => {
    if (editingData) {
      setFormData({
        id_kelas_online: editingData.id_kelas_online,
        judul_kelas: editingData.judul_kelas,
        tanggal_kelas: editingData.tanggal_kelas,
        jam_mulai: editingData.jam_mulai,
        jam_selesai: editingData.jam_selesai,
        link_kelas: editingData.link_kelas,
      });
    } else {
      setFormData({
        id_kelas_online: null,
        judul_kelas: "",
        tanggal_kelas: "",
        jam_mulai: "",
        jam_selesai: "",
        link_kelas: "",
      });
    }
    setErrors({});
  }, [editingData, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.judul_kelas.trim()) {
      newErrors.judul_kelas = "Judul kelas harus diisi";
    }

    if (!formData.tanggal_kelas) {
      newErrors.tanggal_kelas = "Tanggal harus diisi";
    }

    if (!formData.jam_mulai) {
      newErrors.jam_mulai = "Jam mulai harus diisi";
    }

    if (!formData.jam_selesai) {
      newErrors.jam_selesai = "Jam selesai harus diisi";
    }

    if (formData.jam_mulai && formData.jam_selesai && formData.jam_mulai >= formData.jam_selesai) {
      newErrors.jam_selesai = "Jam selesai harus setelah jam mulai";
    }

    if (!formData.link_kelas.trim()) {
      newErrors.link_kelas = "Link kelas harus diisi";
    } else if (!formData.link_kelas.startsWith('http')) {
      newErrors.link_kelas = "Link harus valid (dimulai dengan http/https)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  if (validateForm()) {
    const payload = {
      ...formData,
      tanggal_kelas: formData.tanggal_kelas + "T00:00:00Z", // 👈 FIX FORMAT
    };

    onSubmit(payload);
  }
};


  const handleClose = () => {
    setErrors({});
    onClose();
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
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />
        </Transition.Child>

        {/* Slide Panel */}
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="relative bg-white dark:bg-gray-800 w-full max-w-md h-full shadow-xl"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20">
              <div>
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {editingData ? "Edit Kelas Online" : "Tambah Kelas Online"}
                </h2>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  Isi detail kelas online Anda
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Judul Kelas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <HiAcademicCap className="inline w-4 h-4 mr-1" />
                    Judul Kelas *
                  </label>
                  <input
                    type="text"
                    value={formData.judul_kelas}
                    onChange={(e) => setFormData({ ...formData, judul_kelas: e.target.value })}
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.judul_kelas ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Masukkan judul kelas online"
                  />
                  {errors.judul_kelas && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.judul_kelas}</p>
                  )}
                </div>

                {/* Tanggal */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <HiCalendar className="inline w-4 h-4 mr-1" />
                    Tanggal Kelas *
                  </label>
                  <input
                    type="date"
                    value={formData.tanggal_kelas}
                    onChange={(e) => setFormData({ ...formData, tanggal_kelas: e.target.value })}
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.tanggal_kelas ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.tanggal_kelas && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tanggal_kelas}</p>
                  )}
                </div>

                {/* Jam Mulai & Selesai */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <HiClock className="inline w-4 h-4 mr-1" />
                      Jam Mulai *
                    </label>
                    <input
                      type="time"
                      value={formData.jam_mulai}
                      onChange={(e) => setFormData({ ...formData, jam_mulai: e.target.value })}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.jam_mulai ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.jam_mulai && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jam_mulai}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      <HiClock className="inline w-4 h-4 mr-1" />
                      Jam Selesai *
                    </label>
                    <input
                      type="time"
                      value={formData.jam_selesai}
                      onChange={(e) => setFormData({ ...formData, jam_selesai: e.target.value })}
                      className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.jam_selesai ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.jam_selesai && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.jam_selesai}</p>
                    )}
                  </div>
                </div>

                {/* Link Kelas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <HiLink className="inline w-4 h-4 mr-1" />
                    Link Kelas *
                  </label>
                  <input
                    type="url"
                    value={formData.link_kelas}
                    onChange={(e) => setFormData({ ...formData, link_kelas: e.target.value })}
                    className={`w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.link_kelas ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://meet.google.com/..."
                  />
                  {errors.link_kelas && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.link_kelas}</p>
                  )}
                </div>

                {/* Info */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">
                    Informasi:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Pastikan link meet valid dan dapat diakses</li>
                    <li>• Periksa kembali tanggal dan jam kelas</li>
                    <li>• Status kelas akan otomatis disesuaikan</li>
                  </ul>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors duration-150"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors duration-150"
              >
                {editingData ? "Update Kelas" : "Simpan Kelas"}
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SlideFormKelasOnline;