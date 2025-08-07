import React, { useState, useEffect } from "react";
import { formatTanggalIndonesia } from "../../../utils/date";
import { tambahPembayaran, hapusPembayaranById } from "../../../api/siswaAPI";
import { showToast } from "../../../utils/toast";
import CetakKwitansi from "./CetakKwitansi";
import Swal from "sweetalert2";
const KwitansiBayarPanel = ({ isOpen, onClose, data, onRefresh }) => {
  const [mounted, setMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [pembayaranBaru, setPembayaranBaru] = useState({
    tanggal: "",
    nominal: "",
    keterangan: "",
    tujuan: "Yayasan Anak Panah Bangsa", // default
  });

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => setShowPanel(true), 10);
    }
  }, [isOpen]);
  const handleClose = () => {
    setShowPanel(false);
    setTimeout(() => {
      setMounted(false);
      onClose();
    }, 300); // match durasi transisi
  };

  const handleDeletePembayaran = async (idPembayaran) => {
    const result = await Swal.fire({
      title: "Hapus Pembayaran?",
      text: "Data pembayaran akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded",
      },
    });

    if (result.isConfirmed) {
      try {
        await hapusPembayaranById(idPembayaran); // dari siswaAPI
        showToast("Berhasil hapus pembayaran", "success");
        if (onRefresh) {
          await onRefresh();
        }
      } catch (error) {
        console.error("Gagal hapus pembayaran:", error);
        showToast("Gagal menghapus pembayaran", "error");
      }
    }
  };

  const handleTambahPembayaran = async () => {
    if (!pembayaranBaru.tanggal || !pembayaranBaru.nominal) {
      showToast("Tanggal dan nominal harus diisi", "warning");
      return;
    }

    const nominalInt = parseInt(pembayaranBaru.nominal);
    if (nominalInt > kurang) {
      showToast("Nominal melebihi total yang harus dibayar!", "error");
      return;
    }

    try {
      await tambahPembayaran({
        id_penerima: data.id,
        tanggal: pembayaranBaru.tanggal,
        nominal: nominalInt,
        keterangan: pembayaranBaru.keterangan,
        tujuan: pembayaranBaru.tujuan,
      });

      showToast("Pembayaran berhasil ditambahkan", "success");
      setPembayaranBaru({ tanggal: "", nominal: "", keterangan: "" });
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error("Gagal tambah pembayaran:", error);
      showToast("Gagal menambah pembayaran", "error");
    }
  };

  const totalTagihan = data?.total_tagihan || 0;
  const totalBayar = Array.isArray(data?.pembayaran)
    ? data.pembayaran.reduce((acc, p) => acc + Number(p.nominal || 0), 0)
    : 0;
  const kurang = totalTagihan - totalBayar;

  return (
    <>
      {/* ✅ Overlay */}
      {mounted && (
        <div
          onClick={handleClose}
          className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
            showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
        />
      )}

      {/* ✅ Panel */}
      <div
        className={`text-lg fixed top-0 right-0 w-full max-w-2xl h-full bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 🧾 Panel konten */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Detail Pembayaran Siswa</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800"
          >
            ❌
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-[calc(100%-64px)]">
          {/* Informasi Siswa */}
          <div className="space-y-1">
            <p>
              <strong>Invoice:</strong> {data?.id_invoice}
            </p>
            <p>
              <strong>NIS:</strong> {data?.nis}
            </p>
            <p>
              <strong>Nama:</strong> {data?.nama}
            </p>
            <p>
              <strong>Kelas:</strong> {data?.kelas}
            </p>
          </div>

          {/* Ringkasan Tagihan */}
          <div>
            <h3 className="font-bold my-4">📌 Ringkasan Tagihan</h3>
            <table className="w-full text-lg border">
              <tbody>
                <tr className="border-t">
                  <td className="py-1 px-2">Total Tagihan</td>
                  <td className="py-1 px-2 text-right">
                    {totalTagihan.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Total Bayar</td>
                  <td className="py-1 px-2 text-right text-green-600">
                    {totalBayar.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Kurang</td>
                  <td className="py-1 px-2 text-right text-red-600">
                    {kurang.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Histori Pembayaran */}
          <div>
            <h3 className="font-bold my-4">📜 Histori Pembayaran</h3>
            {data?.pembayaran?.length === 0 ? (
              <p className="text-gray-500">Belum ada pembayaran.</p>
            ) : (
              <table className="w-full text-lg border">
                <thead>
                  <tr className="bg-gray-100 dark:bg-gray-700">
                    <th className="p-2 px-2 text-left">Tanggal</th>
                    <th className="p-2 px-2 text-right">Nominal</th>
                    <th className="p-2 px-2">Keterangan</th>
                    <th className="p-2 px-2">Aksi</th>
                  </tr>
                </thead>

                <tbody className="text-lg">
                  {data.pembayaran.map((p, i) => {
                    console.log(`Pembayaran ke-${i + 1}:`, p); // <=== Tambahkan baris ini

                    return (
                      <tr key={i} className="border-t">
                        <td className="p-2 px-2">
                          {p.Tanggal ? formatTanggalIndonesia(p.Tanggal) : "-"}
                        </td>
                        <td className="p-2 px-2 text-right">
                          {typeof p.nominal === "number"
                            ? p.nominal.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                              })
                            : "-"}
                        </td>
                        <td className="p-2 px-2">{p.Keterangan || "-"}</td>
                        <td className="p-2 px-2 text-center">
                          <div className="flex gap-2 items-center">
                            <button
                              onClick={() =>
                                CetakKwitansi(data, {
                                  ...p,
                                  keterangan: p.Keterangan,
                                })
                              }
                              className="text-blue-600 hover:text-blue-800"
                              title="Cetak Kwitansi"
                            >
                              🖨️
                            </button>

                            <button
                              onClick={() => handleDeletePembayaran(p.ID)}
                              className="text-red-600 hover:text-red-800"
                              title="Hapus pembayaran"
                            >
                              ❌
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Form Tambah Pembayaran */}
          <div>
            <h3 className="font-bold my-4">➕ Tambah Pembayaran</h3>
            <div className="space-y-2">
              <input
                type="date"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                value={pembayaranBaru.tanggal}
                onChange={(e) =>
                  setPembayaranBaru({
                    ...pembayaranBaru,
                    tanggal: e.target.value,
                  })
                }
              />
              <input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Masukkan nominal"
                value={pembayaranBaru.nominal}
                onChange={(e) => {
                  const val = e.target.value.replace(/[^0-9]/g, "");
                  setPembayaranBaru({
                    ...pembayaranBaru,
                    nominal: val,
                  });
                }}
                onKeyDown={(e) => {
                  const invalidChars = ["e", "E", "+", "-"];
                  if (invalidChars.includes(e.key)) {
                    e.preventDefault();
                  }
                }}
              />
              <div className="space-y-1">
                <label className="font-medium">Tujuan Pembayaran</label>
                <select
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                  value={pembayaranBaru.tujuan}
                  onChange={(e) =>
                    setPembayaranBaru((prev) => ({
                      ...prev,
                      tujuan: e.target.value,
                    }))
                  }
                >
                  <option value="Yayasan Anak Panah Bangsa">
                    A/N Yayasan Anak Panah Bangsa
                  </option>
                  <option value="Bambang Eko P">A/N Bambang Eko P</option>
                </select>
              </div>
              <textarea
                className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
                placeholder="Keterangan (opsional)"
                value={pembayaranBaru.keterangan}
                onChange={(e) =>
                  setPembayaranBaru({
                    ...pembayaranBaru,
                    keterangan: e.target.value,
                  })
                }
              />

              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-lg"
                onClick={handleTambahPembayaran} // tambahkan ini!
              >
                Tambah Pembayaran
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KwitansiBayarPanel;
