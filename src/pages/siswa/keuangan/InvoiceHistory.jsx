import React, { useState, useEffect } from "react";
import { getInvoiceHistory } from "../../../api/siswaAPI";
import { useAuth } from "../../../contexts/AuthContext";
import { Link } from "react-router-dom";
import { cardStyles } from "../../../utils/CardStyles";

const InvoiceHistory = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const nis = user?.siswa?.siswa_nis;

  useEffect(() => {
    const fetchData = async () => {
      if (!nis) return;
      setLoading(true);
      try {
        const data = await getInvoiceHistory(nis);
        setInvoiceData(data);
      } catch (err) {
        setError("Gagal mengambil data invoice");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [nis]);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div className="p-6 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6">
        History Invoice - {user?.siswa?.siswa_nama}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Memuat data invoice...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : invoiceData.history?.length === 0 ? (
        <p className="text-center text-gray-500">Tidak ada data invoice</p>
      ) : (
        <div className="space-y-6">
          {invoiceData.history?.map((invoice) => {
            const isLunas = invoice.total_bayar >= invoice.total_tagihan;
            const persentase =
              invoice.total_tagihan > 0
                ? Math.min(
                    100,
                    Math.round(
                      (invoice.total_bayar / invoice.total_tagihan) * 100
                    )
                  )
                : 0;

            const style = isLunas ? cardStyles.green : cardStyles.blue;

            return (
              <div
                key={invoice.invoice_id}
                className={`${cardStyles.base} ${style.container}`}
              >
                {/* Header Invoice */}
                <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                      {invoice.invoice_id}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {invoice.deskripsi}
                    </p>
                  </div>
                  <span
                    className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-xs font-medium ${style.badge}`}
                  >
                    {isLunas ? "LUNAS" : "BELUM LUNAS"}
                  </span>
                </div>

                {/* Detail Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
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
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                      Sisa Tagihan
                    </p>
                    <p className="font-bold text-red-600 dark:text-red-400">
                      {formatCurrency(
                        invoice.total_tagihan - invoice.total_bayar
                      )}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-4">
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

                {/* Footer */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-6 text-sm">
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                        Total Tagihan
                      </p>
                      <p className="font-bold text-gray-800 dark:text-gray-200">
                        {formatCurrency(invoice.total_tagihan)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wide mb-1">
                        Total Bayar
                      </p>
                      <p className="font-bold text-green-600 dark:text-green-400">
                        {formatCurrency(invoice.total_bayar)}
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/siswa/invoice/detail/${nis}?idInvoice=${invoice.invoice_id}`}
                    className={`px-4 py-2 text-sm ${style.button} rounded-lg font-medium transition-colors text-center`}
                  >
                    Lihat Detail
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default InvoiceHistory;