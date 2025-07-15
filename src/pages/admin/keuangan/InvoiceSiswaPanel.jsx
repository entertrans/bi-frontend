import React, { useState, useEffect } from "react";
import { updateTambahanTagihan } from "../../../api/siswaAPI";
import { showToast, showAlert } from "../../../utils/toast";

const formatRupiah = (angka) => `Rp${Number(angka).toLocaleString("id-ID")}`;

// ✅ Ditambahkan: mounted & showPanel state
const InvoiceSiswaPanel = ({ siswa, onClose }) => {
  const [mounted, setMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [tambahanTagihan, setTambahanTagihan] = useState([]);
  const [newTagihan, setNewTagihan] = useState({ nama: "", nominal: "" });

  // ✅ Ditambahkan: slide-in saat siswa tersedia
  useEffect(() => {
    if (siswa) {
      setMounted(true);
      setTimeout(() => setShowPanel(true), 10); // memicu translate-x-0
      setTambahanTagihan(siswa.tambahan_tagihan || []);
    }
  }, [siswa]);

  // ✅ handleClose diubah: untuk slide-out smooth
  const handleClose = () => {
    setShowPanel(false); // keluar pelan-pelan
    setTimeout(() => {
      setMounted(false); // unmount setelah animasi selesai
      onClose(); // jalankan callback
    }, 300);
  };

  // ✅ Ganti: hapus isClosing, langsung pakai mounted dan showPanel
  if (!mounted || !siswa) return null;

  const totalTagihanAwal =
    siswa.invoice?.tagihan?.reduce((acc, item) => acc + item.nominal, 0) || 0;

  const totalTambahan = tambahanTagihan.reduce(
    (acc, item) => acc + Number(item.nominal),
    0
  );

  const totalBayar = totalTagihanAwal + totalTambahan - siswa.potongan;

  const handleAddTagihan = () => {
    if (!newTagihan.nama || !newTagihan.nominal) return;
    setTambahanTagihan([...tambahanTagihan, { ...newTagihan }]);
    setNewTagihan({ nama: "", nominal: "" });
  };

  const handleDeleteTagihan = (idx) => {
    const updated = tambahanTagihan.filter((_, i) => i !== idx);
    setTambahanTagihan(updated);
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setNewTagihan((prev) => ({
      ...prev,
      [name]: name === "nominal" ? Number(value.replace(/[^0-9]/g, "")) : value,
    }));
  };

  return (
    <>
      {/* ✅ Tambahkan background overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ✅ Ganti logika isClosing → showPanel */}
      <div
        className={`fixed top-0 right-0 w-full max-w-2xl h-full bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Detail Invoice Siswa</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ❌
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <p>
              <strong>Nama:</strong> {siswa.siswa?.siswa_nama}
            </p>
            <p>
              <strong>Kelas:</strong> {siswa.siswa?.kelas?.kelas_nama}
            </p>
            <p>
              <strong>NIS:</strong> {siswa.nis}
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Tagihan Awal</h3>
            {siswa.invoice?.tagihan?.length > 0 ? (
              <table className="w-full text-sm border border-gray-300 dark:border-gray-700">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2 text-left">Jenis Tagihan</th>
                    <th className="p-2 text-left">Nominal</th>
                  </tr>
                </thead>
                <tbody>
                  {siswa.invoice.tagihan.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2">{item.nama}</td>
                      <td className="p-2">{formatRupiah(item.nominal)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Tidak ada tagihan awal
              </p>
            )}
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-2">Tambahan Tagihan</h3>
            <table className="min-w-full text-sm border border-gray-300 dark:border-gray-700">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
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

          <div className="pt-4">
            <p>
              <strong>Potongan:</strong> {formatRupiah(siswa.potongan)}
            </p>
          </div>

          <div className="border-t pt-3 font-bold text-lg">
            Total Bayar: {formatRupiah(totalBayar)}
          </div>

          <div className="mt-4 flex justify-end">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
              onClick={async () => {
                try {
                  await updateTambahanTagihan(siswa.id, tambahanTagihan);
                  showToast("Perubahan berhasil disimpan!");
                  handleClose();
                } catch (err) {
                  showAlert("Gagal menyimpan:", "error");
                }
              }}
            >
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceSiswaPanel;
