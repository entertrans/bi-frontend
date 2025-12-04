import React, { useState, useEffect } from "react"; // <-- Tambahkan useEffect
import { HiX } from "react-icons/hi";
import Swal from "sweetalert2";

const FormMateri = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  kelasInfo,
  isSubmitting 
}) => {
  const [formMateri, setFormMateri] = useState({
    judul: "",
    tipe: "file",
    url_file: "",
    keterangan: ""
  });

  // Reset form ketika initialData berubah atau form dibuka
  useEffect(() => {
    if (initialData) {
      // Jika ada data yang akan diedit, isi form dengan data tersebut
      setFormMateri({
        judul: initialData.judul || "",
        tipe: initialData.tipe || "file",
        url_file: initialData.url_file || "",
        keterangan: initialData.keterangan || ""
      });
    } else {
      // Jika tidak ada initialData (tambah baru), reset form
      setFormMateri({
        judul: "",
        tipe: "file",
        url_file: "",
        keterangan: ""
      });
    }
  }, [initialData, isOpen]); // Tambahkan isOpen sebagai dependency

  const handleSubmit = () => {
    // Validation
    if (!formMateri.judul.trim()) {
      Swal.fire("Error!", "Judul materi harus diisi.", "error");
      return;
    }

    if (formMateri.tipe !== "catatan" && !formMateri.url_file.trim()) {
      Swal.fire("Error!", "URL/file harus diisi untuk tipe ini.", "error");
      return;
    }

    onSave(formMateri);
  };

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white dark:bg-gray-800">
      <div className="flex flex-col h-full">
        {/* Header Form Materi */}
        <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20">
          <div>
            <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {initialData ? "Edit Materi" : "Tambah Materi"}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Kelas: {kelasInfo?.topik || "Kelas Online"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            disabled={isSubmitting}
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
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Masukkan judul materi"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tipe Materi
              </label>
              <select
                value={formMateri.tipe}
                onChange={(e) => setFormMateri({ 
                  ...formMateri, 
                  tipe: e.target.value, 
                  url_file: e.target.value === 'catatan' ? '' : formMateri.url_file 
                })}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                <option value="file">File</option>
                <option value="link">Link</option>
                <option value="catatan">Catatan</option>
              </select>
            </div>

            {formMateri.tipe !== 'catatan' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {formMateri.tipe === 'file' ? 'URL File' : 'URL Link'} *
                </label>
                <input
                  type="text"
                  value={formMateri.url_file}
                  onChange={(e) => setFormMateri({ ...formMateri, url_file: e.target.value })}
                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={formMateri.tipe === 'file' ? 'https://example.com/files/nama-file.pdf' : 'https://example.com'}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formMateri.tipe === 'file' 
                    ? 'Masukkan URL lengkap menuju file (PDF, DOC, dll)' 
                    : 'Masukkan URL lengkap (dimulai dengan http:// atau https://)'}
                </p>
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
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Deskripsi singkat tentang materi ini..."
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div>

        {/* Footer Form Materi */}
        <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            )}
            {initialData ? "Update Materi" : "Simpan Materi"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormMateri;