import React, { useState, useEffect } from "react";
import { createInvoice, cekInvoiceID } from "../../../api/siswaAPI";
import { formatToInputDate } from "../../../utils/date";
import TagihanModal from "./TagihanModal";
import { showToast, showAlert } from "../../../utils/toast";

const formatRupiah = (angka) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(angka);

const InvoiceSlidePanel = ({
  isOpen,
  onClose,
  fetchData,
  initialData,
  isEdit = false,
}) => {
  // ✅ Tambahkan state untuk animasi slide
  const [mounted, setMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  // ✅ Efek untuk slide-in saat panel muncul
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => setShowPanel(true), 10);
    }
  }, [isOpen]);

  // ✅ Efek reset saat close dan bukan edit
  useEffect(() => {
    if (!isOpen && !initialData) {
      setFormData({
        id_invoice: "",
        deskripsi: "",
        tgl_invoice: "",
        tgl_jatuh_tempo: "",
      });
      setTambahanTagihan([]);
    }
  }, [isOpen, initialData]);

  const [formData, setFormData] = useState({
    id_invoice: "",
    deskripsi: "",
    tgl_invoice: "",
    tgl_jatuh_tempo: "",
  });

  const [showTagihanModal, setShowTagihanModal] = useState(false);
  const handleSelectTagihan = (selected) => {
    setFormData({ ...formData, tagihan: [...formData.tagihan, ...selected] });
  };
  const [tambahanTagihan, setTambahanTagihan] = useState([]);
  const [newTagihan, setNewTagihan] = useState({ nama: "", nominal: "" });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id_invoice: initialData.id_invoice || "",
        deskripsi: initialData.deskripsi || "",
        tgl_invoice: formatToInputDate(initialData.tgl_invoice),
        tgl_jatuh_tempo: formatToInputDate(initialData.tgl_jatuh_tempo),
      });
      setTambahanTagihan(initialData.tagihan || []);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setNewTagihan((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddTagihan = () => {
    const nominal = parseInt(newTagihan.nominal);
    if (!newTagihan.nama || isNaN(nominal)) {
      showAlert("Isi nama dan nominal tagihan dengan benar", "error");
      return;
    }

    setTambahanTagihan((prev) => [...prev, { ...newTagihan, nominal }]);
    setNewTagihan({ nama: "", nominal: "" });
  };

  const handleDeleteTagihan = (idx) => {
    setTambahanTagihan((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSimpan = async () => {
    const { id_invoice, deskripsi, tgl_invoice, tgl_jatuh_tempo } = formData;

    if (!id_invoice || !deskripsi || !tgl_invoice || !tgl_jatuh_tempo) {
      showAlert(
        "Harap isi semua field termasuk ID Invoice dan minimal satu tagihan.",
        "error"
      );
      return;
    }

    if (tambahanTagihan.length === 0) {
      showAlert("Tambahkan minimal satu tagihan sebelum menyimpan.", "error");
      return;
    }

    try {
      const cek = await cekInvoiceID(id_invoice);
      if (cek.exists) {
        showAlert("ID Invoice sudah digunakan. Gunakan ID yang berbeda.", "error");
        return;
      }

      await createInvoice({
        id_invoice,
        deskripsi,
        tgl_invoice,
        tgl_jatuh_tempo,
        tagihan: tambahanTagihan,
      });

      showToast(`Invoice "${deskripsi}" berhasil disimpan`);
      handleClose(); // ✅ ganti dari langsung onClose()
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan invoice:", error);
      showAlert("Terjadi kesalahan saat menyimpan invoice.", "error");
    }
  };

  // ✅ Fungsi handleClose: animasi keluar lalu close
  const handleClose = () => {
    setShowPanel(false);
    setTimeout(() => {
      setMounted(false);
      onClose();
    }, 300); // durasi match dengan CSS transition
  };

  // ✅ Jangan render kalau belum mounted
  if (!mounted) return null;

  return (
    <>
      {/* ✅ Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ✅ Panel utama dengan animasi translate-x */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-5xl bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Buat Invoice Baru
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ❌
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-white">
              ID Invoice
            </label>
            <input
              name="id_invoice"
              type="text"
              value={formData.id_invoice}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Contoh: UNBK/2025/0001"
            />

            <label className="block text-sm font-medium text-gray-700 dark:text-white mt-2">
              Deskripsi
            </label>
            <input
              name="deskripsi"
              type="text"
              value={formData.deskripsi}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Contoh: SPP Semester 1"
            />
          </div>

          {/* Tanggal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Tanggal Invoice
              </label>
              <input
                name="tgl_invoice"
                type="date"
                value={formData.tgl_invoice}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-white">
                Tanggal Jatuh Tempo
              </label>
              <input
                name="tgl_jatuh_tempo"
                type="date"
                value={formData.tgl_jatuh_tempo}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          {/* Tambahan Tagihan */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">
              Tambahan Tagihan Baru
            </h3>
            <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white">
                  <th className="p-2 text-left">Jenis Tagihan</th>
                  <th className="p-2 text-left">Nominal</th>
                  <th className="p-2 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {tambahanTagihan.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2">{item.nama}</td>
                    <td className="p-2">{formatRupiah(item.nominal)}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleDeleteTagihan(idx)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td className="p-2">
                    <input
                      type="text"
                      name="nama"
                      placeholder="Jenis Tagihan"
                      value={newTagihan.nama}
                      onChange={handleChangeInput}
                      className="w-full px-2 py-1 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="text"
                      name="nominal"
                      placeholder="Nominal"
                      value={newTagihan.nominal}
                      onChange={handleChangeInput}
                      className="w-full px-2 py-1 border rounded bg-white text-gray-900 dark:bg-gray-700 dark:text-white"
                    />
                  </td>
                  <td className="p-2 text-center">
                    <button
                      onClick={handleAddTagihan}
                      className="text-green-600 hover:text-green-800"
                      title="Tambah"
                    >
                      ➕
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Aksi */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowTagihanModal(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow"
            >
              List Tagihan
            </button>

            <button
              onClick={handleSimpan}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
            >
              {isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </div>

        {/* Modal Pilih Tagihan */}
        {showTagihanModal && (
          <TagihanModal
            onClose={() => setShowTagihanModal(false)}
            onSelect={(selected) => {
              setTambahanTagihan((prev) => [...prev, ...selected]);
            }}
          />
        )}
      </div>
    </>
  );
};

export default InvoiceSlidePanel;
