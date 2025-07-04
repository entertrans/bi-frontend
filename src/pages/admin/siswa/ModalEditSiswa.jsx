import React, { useState } from "react";


const ModalEditSiswa = ({ siswa, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    siswa_nama: siswa?.siswa_nama || "",
    siswa_alamat: siswa?.siswa_alamat || "",
    siswa_no_telp: siswa?.siswa_no_telp || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // panggil callback parent
    onClose(); // tutup modal
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4 dark:text-white">Edit Data Siswa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Nama</label>
            <input
              type="text"
              name="siswa_nama"
              value={formData.siswa_nama}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">Alamat</label>
            <input
              type="text"
              name="siswa_alamat"
              value={formData.siswa_alamat}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-white">No. Telp</label>
            <input
              type="text"
              name="siswa_no_telp"
              value={formData.siswa_no_telp}
              onChange={handleChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-white"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEditSiswa;
