import React, { useEffect, useState } from "react";
import { getInvoiceTerakhir } from "../../api/siswaAPI";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;

  // ===== Fetch Invoice Terakhir =====
  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const data = await getInvoiceTerakhir(nis);

        // Validasi: jika response berupa object dengan property 'message'
        if (data && typeof data === "object" && data.message) {
          console.log("Tidak ada tagihan aktif:", data.message);
          setInvoice(null); // Set invoice ke null untuk menampilkan pesan tidak ada tagihan
        } else {
          setInvoice(data);
        }
      } catch (err) {
        console.error("Gagal ambil invoice:", err);
        setInvoice(null); // Pastikan invoice null jika error
      } finally {
        setLoading(false);
      }
    };

    if (nis) {
      fetchInvoice();
    } else {
      setLoading(false);
    }
  }, [nis]);

  // ===== Format Helpers =====
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
          month: "long",
          day: "numeric",
        })
      : "-";

  // ===== Loading State =====
  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
        <p className="text-gray-500 dark:text-gray-400">
          Memuat data tagihan...
        </p>
      </div>
    );
  }

  // ===== Validasi: Jika Tidak Ada Invoice Aktif =====
  // Cek jika invoice null, undefined, atau memiliki property message
  const shouldShowNoInvoice =
    !invoice ||
    (typeof invoice === "object" && invoice.message) ||
    (invoice && !invoice.invoice_id);

  if (shouldShowNoInvoice) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-3">🎉</div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
          Tidak ada tagihan aktif
        </h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {invoice?.message || "Semua tagihan Anda telah lunas"}
        </p>
      </div>
    );
  }

  // ===== Data Invoice =====
  // Pastikan properti yang diperlukan ada sebelum diakses
  const isLunas =
    invoice.status === "Lunas" || invoice.total_bayar >= invoice.total_tagihan;

  const totalTagihan = invoice.total_tagihan || 0;
  const totalBayar = invoice.total_bayar || 0;
  const sisaTagihan = invoice.sisa_tagihan || totalTagihan - totalBayar;

  const persentase =
    totalTagihan > 0
      ? Math.min(100, Math.round((totalBayar / totalTagihan) * 100))
      : 0;

  // ===== Tampilan Utama =====
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {invoice.invoice_id || "No Invoice ID"}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            {invoice.deskripsi || "Tagihan terakhir"}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full ${
            isLunas
              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {isLunas ? "LUNAS" : "BELUM LUNAS"}
        </span>
      </div>

      {/* Informasi Tanggal */}
      <div className="grid grid-cols-2 gap-4 mb-5 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
            Tanggal Invoice
          </p>
          <p className="text-gray-800 dark:text-gray-200">
            {formatDate(invoice.tgl_invoice)}
          </p>
        </div>
        <div>
          <p className="text-red-500 dark:text-red-400 text-xs uppercase tracking-wide mb-1">
            Jatuh Tempo
          </p>
          <p className="text-red-600 dark:text-red-300 font-medium">
            {formatDate(invoice.tgl_jatuh_tempo)}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {!isLunas && (
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Progress Pembayaran</span>
            <span>{persentase}%</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-2 ${
                isLunas ? "bg-green-500" : "bg-blue-500"
              } transition-all duration-300`}
              style={{ width: `${persentase}%` }}
            />
          </div>
        </div>
      )}

      {/* Informasi Keuangan */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Total Tagihan
          </p>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">
            {formatCurrency(totalTagihan)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Total Bayar
          </p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400">
            {formatCurrency(totalBayar)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
            Sisa Tagihan
          </p>
          <p className="text-lg font-bold text-red-600 dark:text-red-400">
            {formatCurrency(sisaTagihan)}
          </p>
        </div>
      </div>

      {/* Tombol Aksi */}
      <Link
        to={`/siswa/keuangan`}
        className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-medium rounded-lg text-center transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Lihat Detail Keuangan
      </Link>

      {/* Reminder Jatuh Tempo */}
      {!isLunas && (
        <div className="mt-4 flex justify-center">
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full">
            ⚠️ Segera lakukan pembayaran
          </span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
