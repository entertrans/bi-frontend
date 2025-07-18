import React, { useState, useEffect } from "react";
import { formatTanggalLengkap } from "../../../utils/date";
import { IoClose } from "react-icons/io5";
import { tambahPembayaran, hapusPembayaranById } from "../../../api/siswaAPI";
import { showToast, showAlert } from "../../../utils/toast";
import Swal from "sweetalert2";
const KwitansiBayarPanel = ({ isOpen, onClose, data, onRefresh }) => {
  const [pembayaranBaru, setPembayaranBaru] = useState({
    tanggal: "",
    nominal: "",
  });

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
        // await fetchPembayaran(); // <-- Refresh data tabel
        showToast("Berhasil hapus pembayaran", "success");
        if (onRefresh) onRefresh(); // untuk refresh data
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
        metode: null,
        keterangan: null,
      });

      showToast("Pembayaran berhasil ditambahkan", "success");
      setPembayaranBaru({ tanggal: "", nominal: "" });
      if (onRefresh) onRefresh(); // refresh parent data
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
      {isOpen && (
        <div
          onClick={onClose}
          className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />
      )}

      {/* ✅ Panel */}
      <div
        className={`text-lg fixed top-0 right-0 w-full max-w-2xl h-full bg-white dark:bg-gray-800 shadow-lg z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* 🧾 Panel konten */}
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-bold">Detail Pembayaran Siswa</h2>
          <button
            onClick={onClose}
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
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Total Bayar</td>
                  <td className="py-1 px-2 text-right text-green-600">
                    {totalBayar.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="py-1 px-2">Kurang</td>
                  <td className="py-1 px-2 text-right text-red-600">
                    {kurang.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
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
                    <th className="p-2 px-2">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-lg">
                  {/* {console.log(data.pembayaran)} */}
                  {data.pembayaran.map((p, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 px-2">
                        {p.Tanggal ? formatTanggalLengkap(p.Tanggal) : "-"}
                      </td>
                      <td className="p-2 px-2 text-right">
                        {typeof p.nominal === "number"
                          ? p.nominal.toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })
                          : "-"}
                      </td>
                      <td className="p-2 px-2 text-center">
                        <button
                          className="text-xs text-red-500 hover:underline"
                          onClick={() => handleDeletePembayaran(p.ID)} // misalnya pakai p.id
                        >
                          ❌
                        </button>
                      </td>
                    </tr>
                  ))}
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
