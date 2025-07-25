import React from "react";
import { useNavigate } from "react-router-dom";
import { dummyPeriodePettyCash } from "./dummy/pettycash";
import { formatRupiah, formatTanggalIndo } from "../../../utils/format";

const PettyCashSerpongPage = () => {
  const navigate = useNavigate();

  const handleTransaksiClick = (id) => {
    navigate(`/pettycash/serpong/${id}/transaksi`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Petty Cash Anak Panah Serpong</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded shadow">
          + Tambah Periode
        </button>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 border">ID</th>
            <th className="px-6 py-3 border">Deskripsi</th>
            <th className="px-6 py-3 border">Tanggal Mulai</th>
            <th className="px-6 py-3 border">Status</th>
            <th className="px-6 py-3 border">Sisa Saldo</th>
            <th className="px-6 py-3 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dummyPeriodePettyCash.map((periode) => (
            <tr key={periode.id}>
              <td className="px-6 py-4 border">{periode.kode_periode}</td>
              <td className="px-6 py-4 border">{periode.deskripsi}</td>
              <td className="px-6 py-4 border">
                {formatTanggalIndo(periode.tanggal_mulai)}
              </td>
              <td className="px-6 py-4 border capitalize">{periode.status}</td>
              <td className="px-6 py-4 border">
                {formatRupiah(periode.saldo_awal)}
              </td>
              <td className="px-6 py-4 border space-x-2 text-center">
                <button
                  onClick={() => handleTransaksiClick(periode.id)}
                  className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                >
                  Transaksi
                </button>
                <button className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded">
                  Cetak
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PettyCashSerpongPage;
