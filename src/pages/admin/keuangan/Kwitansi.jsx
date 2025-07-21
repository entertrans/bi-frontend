import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTanggalLengkap } from "../../../utils/date";
import { getAllKwitansi } from "../../../api/siswaAPI"; // ⬅️ pastikan path & file ini bener

const Kwitansi = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllKwitansi()
      .then(setInvoices)
      .catch((err) => {
        console.error("Gagal fetch kwitansi:", err);
      });
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
        Daftar Invoice (Kwitansi Pembayaran)
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Invoice ID</th>
              <th className="px-6 py-3 text-left">Deskripsi</th>
              <th className="px-6 py-3 text-left">Tgl. Invoice</th>
              <th className="px-6 py-3 text-left">Jatuh Tempo</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {invoices.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                >
                  Tidak ada invoice ditemukan.
                </td>
              </tr>
            ) : (
              invoices.map((inv) => (
                <tr key={inv.id_invoice}>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {inv.id_invoice}
                  </td>
                  <td className="px-6 py-4">{inv.deskripsi}</td>
                  {console.log(inv)}
                  <td className="px-6 py-4">
                    {formatTanggalLengkap(inv.tgl_invoice)}
                  </td>
                  <td className="px-6 py-4">
                    {formatTanggalLengkap(inv.tgl_jatuh_tempo)}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="flex items-center text-red-500">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1" />
                      {inv.status?.belum ?? 0}
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 mr-1" />
                      {inv.status?.belum_lunas ?? 0}
                    </div>
                    <div className="flex items-center text-green-600">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1" />
                      {inv.status?.lunas ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        navigate(
                          `/admin/keuangan/kwitansi/${encodeURIComponent(
                            inv.id_invoice
                          )}`
                        )
                      }
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-xs rounded shadow"
                    >
                      🔍 Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Kwitansi;
