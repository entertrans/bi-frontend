import React, { useState, useEffect } from "react";

const generateKodePeriode = (lokasi, lastKode = "") => {
  const tahun = new Date().getFullYear();
  const prefix = lokasi === "Serpong" ? "SPG" : "BGR";
  let nomor = 1;

  // Contoh: SPG-2025-02 -> extract '02'
  if (lastKode.startsWith(prefix)) {
    const parts = lastKode.split("-");
    if (parts.length === 3) {
      const lastNum = parseInt(parts[2], 10);
      if (!isNaN(lastNum)) nomor = lastNum + 1;
    }
  }

  const nomorStr = String(nomor).padStart(2, "0");
  return `${prefix}-${tahun}-${nomorStr}`;
};

const PettyCashPeriodeModal = ({
  isOpen,
  onClose,
  onSubmit,
  lokasiAktif = "Bogor",
  lastKodePeriode = "",
}) => {
  const [formData, setFormData] = useState({
    kode_periode: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_tutup: "",
    saldo_awal: 0,
    lokasi: lokasiAktif,
    status: "aktif",
  });

  useEffect(() => {
    if (isOpen) {
      const newKode = generateKodePeriode(lokasiAktif, lastKodePeriode);
      setFormData((prev) => ({
        ...prev,
        kode_periode: newKode,
        lokasi: lokasiAktif,
      }));
    }
  }, [isOpen, lokasiAktif, lastKodePeriode]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      saldo_awal: parseInt(formData.saldo_awal),
      tanggal_mulai: new Date(formData.tanggal_mulai),
      tanggal_tutup: formData.tanggal_tutup
        ? new Date(formData.tanggal_tutup)
        : null,
    };
    onSubmit(payload);
    console.log(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Tambah Periode Petty Cash
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Kode Periode (otomatis)
            </label>
            <div className="mt-1 text-sm text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
              {formData.kode_periode}
            </div>
          </div>

          <div>
            <label
              htmlFor="deskripsi"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Deskripsi
            </label>
            <input
              type="text"
              name="deskripsi"
              id="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="tanggal_mulai"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="tanggal_mulai"
              id="tanggal_mulai"
              value={formData.tanggal_mulai}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div>
            <label
              htmlFor="saldo_awal"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Saldo Awal
            </label>
            <input
              type="number"
              name="saldo_awal"
              id="saldo_awal"
              value={formData.saldo_awal}
              onChange={handleChange}
              className="mt-1 w-full border p-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="text-red-500 hover:underline"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PettyCashPeriodeModal;
