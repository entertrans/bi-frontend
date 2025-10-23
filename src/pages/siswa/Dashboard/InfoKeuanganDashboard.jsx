import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronUp, HiChevronDown } from "react-icons/hi";
import AccordionSection from "./AccordionSection";
import EmptyState from "./EmptyState";
import { cardStyles } from "../../../utils/CardStyles";

const InfoKeuanganDashboard = ({ invoice }) => {
  const [expanded, setExpanded] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const style = cardStyles.blue;

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

  // --- CASE 1: Tidak ada data sama sekali ---
  const isEmpty =
    !invoice ||
    (Array.isArray(invoice) && invoice.length === 0) ||
    (typeof invoice === "object" && invoice.message);

  if (isEmpty) {
    return (
      <AccordionSection
        title="💰 Tagihan Belum Lunas"
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

  // Pastikan invoice berbentuk array agar bisa di-map
  const invoices = Array.isArray(invoice) ? invoice : [invoice];

  const nextInvoice = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === invoices.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevInvoice = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? invoices.length - 1 : prevIndex - 1
    );
  };

  const goToInvoice = (index) => {
    setCurrentIndex(index);
  };

  const currentInvoice = invoices[currentIndex];
  const isLunas =
    currentInvoice.status === "Lunas" || 
    currentInvoice.total_bayar >= currentInvoice.total_tagihan;

  const totalTagihan = currentInvoice.total_tagihan || 0;
  const totalBayar = currentInvoice.total_bayar || 0;
  const sisaTagihan = currentInvoice.sisa_tagihan || totalTagihan - totalBayar;

  const persentase =
    totalTagihan > 0
      ? Math.min(100, Math.round((totalBayar / totalTagihan) * 100))
      : 0;

  return (
    <AccordionSection
      title="💰 Tagihan Belum Lunas"
      count={invoices.length}
      isExpanded={expanded}
      onToggle={() => setExpanded(!expanded)}
    >
      <div className="space-y-6 relative">
        {/* Swipe Container */}
        <div className="relative">
          {/* Navigation Arrows (atas-bawah) - SIZE BESAR */}
          {invoices.length > 1 && (
            <>
              <button
                onClick={prevInvoice}
                className="absolute left-1/2 -translate-x-1/2 -top-6 z-10 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 rounded-full p-3 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Previous invoice"
              >
                <HiChevronUp className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={nextInvoice}
                className="absolute left-1/2 -translate-x-1/2 -bottom-6 z-10 bg-gray-800 bg-opacity-60 hover:bg-opacity-80 rounded-full p-3 backdrop-blur-sm transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-110"
                aria-label="Next invoice"
              >
                <HiChevronDown className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Current Invoice Card */}
          <div
            className={`${cardStyles.base} ${style.container} border-l-4 mx-8 relative z-0 mt-2 mb-2`}
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-3">
                <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100 truncate">
                  {currentInvoice.invoice_id || "No Invoice ID"}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-xs mt-0.5 truncate">
                  {currentInvoice.deskripsi || "Tagihan belum lunas"}
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
            <div className="grid grid-cols-2 gap-3 text-sm mt-2">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                  Tanggal Invoice
                </p>
                <p className="text-gray-800 dark:text-gray-200 text-sm">
                  {formatDate(currentInvoice.tgl_invoice)}
                </p>
              </div>
              <div>
                <p className="text-red-500 dark:text-red-400 text-xs uppercase tracking-wide mb-1">
                  Jatuh Tempo
                </p>
                <p className="text-red-600 dark:text-red-300 font-medium text-sm">
                  {formatDate(currentInvoice.tgl_jatuh_tempo)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {!isLunas && (
              <div className="mt-2">
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
            <div className="grid grid-cols-3 gap-3 mt-3">
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
              <div className="flex justify-center mt-3">
                <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">
                  ⚠️ Segera lakukan pembayaran
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AccordionSection>
  );
};

export default InfoKeuanganDashboard;