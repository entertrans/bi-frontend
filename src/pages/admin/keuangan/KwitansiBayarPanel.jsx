import React, { useState, useEffect } from "react";
import { formatTanggalLengkap } from "../../../utils/date";
import { IoClose } from "react-icons/io5";

const KwitansiBayarPanel = ({ isOpen, onClose, data }) => {
  const [pembayaranBaru, setPembayaranBaru] = useState({
    tanggal: "",
    nominal: "",
  });

  const totalTagihan = data?.total_tagihan || 0;
  const totalBayar = data?.total_bayar || 0;
  const kurang = totalTagihan - totalBayar;

  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white dark:bg-gray-800 shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          💰 Pembayaran Siswa
        </h2>
        <button onClick={onClose}>
          <IoClose className="text-2xl text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto text-sm space-y-6">
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
          <h3 className="font-bold mb-2">📌 Ringkasan Tagihan</h3>
          <table className="w-full text-sm border">
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
          <h3 className="font-bold mb-2">📜 Histori Pembayaran</h3>
          {data?.pembayaran?.length === 0 ? (
            <p className="text-gray-500">Belum ada pembayaran.</p>
          ) : (
            <table className="w-full text-sm border">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="py-1 px-2 text-left">Tanggal</th>
                  <th className="py-1 px-2 text-right">Nominal</th>
                  <th className="py-1 px-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.pembayaran.map((p, i) => (
                  <tr key={i} className="border-t">
                    <td className="py-1 px-2">
                      {formatTanggalLengkap(p.tanggal)}
                    </td>
                    <td className="py-1 px-2 text-right">
                      {p.nominal.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                    <td className="py-1 px-2 text-center">
                      <button className="text-xs text-red-500 hover:underline">
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
          <h3 className="font-bold mb-2">➕ Tambah Pembayaran</h3>
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
              className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:text-white"
              placeholder="Masukkan nominal"
              value={pembayaranBaru.nominal}
              onChange={(e) =>
                setPembayaranBaru({
                  ...pembayaranBaru,
                  nominal: e.target.value,
                })
              }
            />
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm">
              Tambah Pembayaran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KwitansiBayarPanel;
