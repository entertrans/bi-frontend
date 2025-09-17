import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getInvoiceDetail } from "../../../api/siswaAPI";

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { nis } = useParams();
  const [searchParams] = useSearchParams();
  const idInvoice = searchParams.get("idInvoice"); // ambil dari query string

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        setLoading(true);
        const response = await getInvoiceDetail(nis, idInvoice);
        setInvoice(response);
      } catch (error) {
        console.error("Error fetching invoice detail:", error);
      } finally {
        setLoading(false);
      }
    };

    if (nis && idInvoice) {
      fetchInvoiceDetail();
    }
  }, [nis, idInvoice]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const handlePrint = () => {
    alert("Fitur print akan diimplementasikan di sini");
  };

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
        <p className="text-center text-gray-500">Memuat detail invoice...</p>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
        <p className="text-center text-red-500">Data invoice tidak ditemukan</p>
        <Link
          to={`/siswa/keuangan`}
          className="block text-center mt-4 text-blue-600 hover:underline"
        >
          Kembali ke History
        </Link>
      </div>
    );
  }

  // Gabungkan tagihan utama dan tambahan
  const semuaTagihan = [
    ...(invoice.tagihan_utama || []),
    ...(invoice.tagihan_tambahan || []),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      {/* Kiri - Detail Invoice */}
      <div className="md:col-span-2 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <Link
              to={`/siswa/keuangan`}
              className="text-blue-600 dark:text-blue-400 hover:underline mb-2 block"
            >
              &larr; Kembali ke History
            </Link>
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Invoice #{invoice.invoice_id}
            </h2>
          </div>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 mt-4 md:mt-0"
          >
            Print
          </button>
        </div>

        {/* Informasi Invoice */}
        <div className="mb-6">
          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">Deskripsi</p>
            <p className="font-medium">{invoice.deskripsi}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Tanggal Invoice
              </p>
              <p>{formatDateTime(invoice.tgl_invoice).date}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Jatuh Tempo
              </p>
              <p>{formatDateTime(invoice.tgl_jatuh_tempo).date}</p>
            </div>
          </div>
        </div>

        {/* Daftar Tagihan */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Daftar Tagihan</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Nama Tagihan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                    Nominal
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {semuaTagihan.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-4">{index + 1}</td>
                    <td className="px-4 py-4">{item.nama}</td>
                    <td className="px-4 py-4">
                      {formatCurrency(item.nominal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ringkasan Keuangan */}
        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between">
            <span>Total Tagihan</span>
            <span>{formatCurrency(invoice.total_tagihan)}</span>
          </div>
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Potongan</span>
            <span>- {formatCurrency(invoice.total_potongan)}</span>
          </div>
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>Total Dibayar</span>
            <span>{formatCurrency(invoice.total_bayar)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Sisa Tagihan</span>
            <span className="text-red-600 dark:text-red-400">
              {formatCurrency(invoice.sisa_tagihan)}
            </span>
          </div>
        </div>
      </div>

      {/* Kanan - History Pembayaran */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">History Pembayaran</h3>

        {invoice.pembayaran.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            Belum ada pembayaran
          </p>
        ) : (
          <ul className="space-y-4">
            {invoice.pembayaran.map((payment) => {
              const { date, time } = formatDateTime(payment.Tanggal);
              return (
                <li
                  key={payment.ID}
                  className="border-l-4 border-blue-500 pl-3 py-2"
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium">
                      {formatCurrency(payment.Nominal)}
                    </p>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Berhasil
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {date} • {time}
                  </p>
                  <p className="text-sm mt-1">{payment.Keterangan}</p>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InvoiceDetail;
