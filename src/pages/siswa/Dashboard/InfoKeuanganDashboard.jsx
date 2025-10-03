import React, { useState } from "react";
import { Link } from "react-router-dom";
import AccordionSection from "./AccordionSection";
import EmptyState from "./EmptyState";
// import { cardStyles } from "./CardStyles";
import { cardStyles } from "../../../utils/CardStyles";

const InfoKeuanganDashboard = ({ invoice }) => {
  const [expanded, setExpanded] = useState(true);
  const style = cardStyles.blue; // Gunakan blue theme untuk keuangan

  const formatCurrency = (amount) =>
    amount
      ? new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 0,
        }).format(amount)
      : "Rp 0";

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "-";

  // Validasi: Jika Tidak Ada Invoice Aktif
  const shouldShowNoInvoice =
    !invoice ||
    (typeof invoice === "object" && invoice.message) ||
    (invoice && !invoice.invoice_id);

  if (shouldShowNoInvoice) {
    return (
      <AccordionSection
        title="💰 Tagihan Terakhir"
        count={0}
        isExpanded={expanded}
        onToggle={() => setExpanded(!expanded)}
      >
        <EmptyState 
          icon="🎉"
          title="Tidak ada tagihan aktif"
          message={invoice?.message || "Semua tagihan Anda telah lunas"}
        />
      </AccordionSection>
    );
  }

  // Data Invoice
  const isLunas =
    invoice.status === "Lunas" || invoice.total_bayar >= invoice.total_tagihan;

  const totalTagihan = invoice.total_tagihan || 0;
  const totalBayar = invoice.total_bayar || 0;
  const sisaTagihan = invoice.sisa_tagihan || totalTagihan - totalBayar;

  const persentase =
    totalTagihan > 0
      ? Math.min(100, Math.round((totalBayar / totalTagihan) * 100))
      : 0;

  return (
    <AccordionSection
      title="💰 Tagihan Terakhir"
      count={1}
      isExpanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className={`${cardStyles.base} ${style.container} border-l-4`}>
        {/* Content */}
        <div className="space-y-4 flex-1">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1 mr-3">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
                {invoice.invoice_id || "No Invoice ID"}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5 truncate">
                {invoice.deskripsi || "Tagihan terakhir"}
              </p>
            </div>
            <span
              className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                isLunas
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                  : style.badge
              }`}
            >
              {isLunas ? "LUNAS" : "BELUM LUNAS"}
            </span>
          </div>

          {/* Informasi Tanggal */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                Tanggal Invoice
              </p>
              <p className="text-gray-800 dark:text-gray-200 text-sm">
                {formatDate(invoice.tgl_invoice)}
              </p>
            </div>
            <div>
              <p className="text-red-500 dark:text-red-400 text-xs uppercase tracking-wide mb-1">
                Jatuh Tempo
              </p>
              <p className="text-red-600 dark:text-red-300 font-medium text-sm">
                {formatDate(invoice.tgl_jatuh_tempo)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          {!isLunas && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                <span>Progress Pembayaran</span>
                <span>{persentase}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-1.5 ${
                    isLunas ? "bg-green-500" : "bg-blue-500"
                  } transition-all duration-300`}
                  style={{ width: `${persentase}%` }}
                />
              </div>
            </div>
          )}

          {/* Informasi Keuangan */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Total
              </p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                {formatCurrency(totalTagihan)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Dibayar
              </p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {formatCurrency(totalBayar)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Sisa
              </p>
              <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                {formatCurrency(sisaTagihan)}
              </p>
            </div>
          </div>

          {/* Reminder Jatuh Tempo */}
          {!isLunas && (
            <div className="flex justify-center">
              <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">
                ⚠️ Segera lakukan pembayaran
              </span>
            </div>
          )}
        </div>

        {/* Footer - Tombol Aksi */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={`/siswa/keuangan`}
            className={`w-full ${style.button} px-4 py-2.5 rounded-lg font-medium text-center transition-colors duration-200 text-sm shadow-sm hover:shadow-md block`}
          >
            Lihat Detail Keuangan
          </Link>
        </div>
      </div>
    </AccordionSection>
  );
};

export default InfoKeuanganDashboard;