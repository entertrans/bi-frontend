import React, { useState, useEffect } from "react";
import { createPettyCashPeriode } from "../../../api/siswaAPI";
import { showToast } from "../../../utils/toast";

const generateKodePeriode = (lokasi, lastKode = "") => {
  const tahun = new Date().getFullYear();
  const prefix = lokasi === "Serpong" ? "SPG" : "BGR";
  let nomor = 1;

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
  onSuccess,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      saldo_awal: parseInt(formData.saldo_awal, 10),
      tanggal_mulai: new Date(formData.tanggal_mulai),
      tanggal_tutup: null,
      // tanggal_tutup: formData.tanggal_tutup
      //   ? new Date(formData.tanggal_tutup)
      //   : null,
    };

    try {
      await createPettyCashPeriode(payload);
      showToast("Periode berhasil ditambahkan", "success");
      onSuccess?.();
      onClose();
    } catch (error) {
      showToast("Gagal menambahkan periode", "error");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          Tambah Periode Petty Cash
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kode Periode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Kode Periode (otomatis)
            </label>
            <div className="mt-1 font-mono text-sm text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded">
              {formData.kode_periode}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Deskripsi
            </label>
            <input
              type="text"
              name="deskripsi"
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Tanggal Mulai */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Tanggal Mulai
            </label>
            <input
              type="date"
              name="tanggal_mulai"
              value={formData.tanggal_mulai}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Saldo Awal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Saldo Awal
            </label>
            <input
              type="number"
              name="saldo_awal"
              value={formData.saldo_awal}
              onChange={handleChange}
              className="w-full mt-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end pt-4 space-x-3">
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
