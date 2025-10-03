// src/pages/siswa/keuangan/InvoiceDetail.jsx
import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { getInvoiceDetail } from "../../../api/siswaAPI";
import { formatRupiah, formatTanggalWaktu } from "../../../utils/format";
import CetakKwitansi from "../../admin/keuangan/CetakKwitansi";
import InvoicePreviewSiswa from "./InvoicePreviewSiswa";
import { HiPrinter } from "react-icons/hi";
import { cardStyles } from "../../../utils/CardStyles";

const InvoiceDetail = () => {
  const [invoice, setInvoice] = useState(null);
  const [invoiceCetak, setInvoiceCetak] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { nis } = useParams();
  const [searchParams] = useSearchParams();
  const idInvoice = searchParams.get("idInvoice");

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

  const handlePrintClean = () => {
    setInvoiceCetak({
      ...invoice,
      siswa: user?.siswa || {},
    });

    setTimeout(() => {
      const element = document.getElementById("invoice-clean");
      if (!element) return;

      html2pdf()
        .set({
          margin: 0.5,
          filename: `invoice-${invoice.invoice_id}.pdf`,
          image: {
            type: "jpeg",
            quality: 0.98,
          },
          html2canvas: {
            scale: 2,
            useCORS: true,
            logging: false,
            ignoreElements: (element) => {
              return element.tagName === "LINK" && element.rel === "stylesheet";
            },
          },
          jsPDF: {
            unit: "in",
            format: "A4",
            orientation: "portrait",
          },
        })
        .from(element)
        .save();

      setTimeout(() => setInvoiceCetak(null), 1000);
    }, 300);
  };

  const handlePrintPayment = (payment) => {
    CetakKwitansi(
      {
        ...invoice,
        nama: user?.siswa?.siswa_nama || "Siswa",
        id_invoice: invoice.invoice_id,
      },
      {
        ...payment,
        nominal: payment.Nominal,
        keterangan: payment.Keterangan || "Pembayaran Invoice",
      }
    );
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

  const semuaTagihan = [
    ...(invoice.tagihan_utama || []).map((t) => ({
      ...t,
      key: `utama-${t.id}`,
    })),
    ...(invoice.tagihan_tambahan || []).map((t) => ({
      ...t,
      key: `tambahan-${t.id}`,
    })),
  ];

  const isLunas = invoice.total_bayar >= invoice.total_tagihan;
  const style = isLunas ? cardStyles.green : cardStyles.blue;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {/* Kiri - Detail Invoice */}
        <div className="md:col-span-2">
          <div className={`${cardStyles.base} ${style.container} h-full`}>
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <Link
                  to={`/siswa/keuangan`}
                  className="text-blue-600 dark:text-blue-400 hover:underline mb-2 block"
                >
                  &larr; Kembali ke History
                </Link>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Invoice #{invoice.invoice_id}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handlePrintClean}
                  className={`px-4 py-2 ${style.button} rounded-lg font-medium flex items-center gap-2 transition-colors`}
                >
                  <HiPrinter className="text-lg" />
                  Print Invoice
                </button>
              </div>
            </div>

            {/* Informasi Invoice */}
            <div className="mb-6">
              <div className="mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Deskripsi
                </p>
                <p className="font-medium text-gray-800 dark:text-gray-200">{invoice.deskripsi}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                    Tanggal Invoice
                  </p>
                  <p className="text-gray-800 dark:text-gray-200">
                    {formatTanggalWaktu(invoice.tgl_invoice).date}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-red-500 dark:text-red-400 uppercase tracking-wide mb-1">
                    Jatuh Tempo
                  </p>
                  <p className="text-red-600 dark:text-red-300 font-medium">
                    {formatTanggalWaktu(invoice.tgl_jatuh_tempo).date}
                  </p>
                </div>
              </div>
            </div>

            {/* Daftar Tagihan */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
                Daftar Tagihan
              </h3>
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
                        key={item.key}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-4 py-4 text-gray-800 dark:text-gray-200">{index + 1}</td>
                        <td className="px-4 py-4 text-gray-800 dark:text-gray-200">{item.nama}</td>
                        <td className="px-4 py-4 text-gray-800 dark:text-gray-200">
                          {formatRupiah(item.nominal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Ringkasan Keuangan */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-800 dark:text-gray-200">Total Tagihan</span>
                <span className="text-gray-800 dark:text-gray-200">{formatRupiah(invoice.total_tagihan)}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Potongan</span>
                <span>- {formatRupiah(invoice.total_potongan)}</span>
              </div>
              <div className="flex justify-between text-green-600 dark:text-green-400">
                <span>Total Dibayar</span>
                <span>{formatRupiah(invoice.total_bayar)}</span>
              </div>
              <div className="flex justify-between font-bold border-t border-gray-200 dark:border-gray-700 pt-3">
                <span className="text-gray-800 dark:text-gray-200">Sisa Tagihan</span>
                <span className="text-red-600 dark:text-red-400">
                  {formatRupiah(invoice.sisa_tagihan)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan - History Pembayaran */}
        <div>
          <div className={`${cardStyles.base} ${cardStyles.purple.container} h-full`}>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">
              History Pembayaran
            </h3>

            {invoice.pembayaran.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                Belum ada pembayaran
              </p>
            ) : (
              <ul className="space-y-4">
                {invoice.pembayaran.map((payment) => {
                  const { date } = formatTanggalWaktu(payment.Tanggal);
                  return (
                    <li
                      key={payment.ID}
                      className="border-l-4 border-purple-500 pl-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-r-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-lg text-gray-800 dark:text-gray-100">
                          {formatRupiah(payment.Nominal)}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Berhasil
                          </span>
                          <button
                            onClick={() => handlePrintPayment(payment)}
                            className="p-1 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                            title="Print Bukti Pembayaran"
                          >
                            <HiPrinter className="text-lg" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {date}
                      </p>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {payment.Keterangan}
                      </p>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden render untuk cetak clean */}
      {invoiceCetak && (
        <div className="hidden">
          <InvoicePreviewSiswa invoice={invoiceCetak} />
        </div>
      )}
    </>
  );
};

export default InvoiceDetail;