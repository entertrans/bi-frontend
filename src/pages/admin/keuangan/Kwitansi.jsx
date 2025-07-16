import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatTanggalLengkap } from "../../../utils/date";
// import { getAllInvoiceWithStatus } from "../../../api/siswaAPI"; // nanti kalau sudah ada API-nya

// Dummy sementara
const dummyInvoices = [
  {
    id_invoice: "UNBK/2025/001",
    deskripsi: "UNBK 2025",
    tgl_invoice: "2025-07-11",
    tgl_jatuh_tempo: "2025-07-31",
    status: {
      belum: 3,
      belum_lunas: 2,
      lunas: 10,
    },
  },
  {
    id_invoice: "SPP/2025/002",
    deskripsi: "SPP Juli 2025",
    tgl_invoice: "2025-07-01",
    tgl_jatuh_tempo: "2025-07-10",
    status: {
      belum: 1,
      belum_lunas: 5,
      lunas: 15,
    },
  },
];

const Kwitansi = () => {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ganti dengan API call nanti
    // getAllInvoiceWithStatus()
    //   .then(setInvoices)
    //   .catch(err => console.error(err));

    setInvoices(dummyInvoices); // sementara dummy
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
                  <td className="px-6 py-4">
                    {formatTanggalLengkap(inv.tgl_invoice)}
                  </td>
                  <td className="px-6 py-4">
                    {formatTanggalLengkap(inv.tgl_jatuh_tempo)}
                  </td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="flex items-center text-red-500">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-1" />
                      {inv.status.belum}
                    </div>
                    <div className="flex items-center text-yellow-500">
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 mr-1" />
                      {inv.status.belum_lunas}
                    </div>
                    <div className="flex items-center text-green-600">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-1" />
                      {inv.status.lunas}
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
