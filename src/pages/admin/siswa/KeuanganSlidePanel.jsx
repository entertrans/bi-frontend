import React, { useEffect, useState, useRef } from "react";
import { HiEye, HiPrinter, HiDotsVertical } from "react-icons/hi";
import { fetchHistoryInvoice } from "../../../api/siswaAPI";
import { formatTanggalLengkap } from "../../../utils/date";
import InvoicePreview from "../keuangan/InvoicePreview";
import html2pdf from "html2pdf.js";

const KeuanganSlidePanel = ({ onClose, user, isOpen }) => {
  const [mounted, setMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [siswaCetak, setSiswaCetak] = useState(null);
  const [menuOpenIndex, setMenuOpenIndex] = useState(null); // ✅ kontrol dropdown aktif
  const panelRef = useRef(null);

  const handleCetakLangsung = () => {
    const element = document.getElementById("kwitansi-cetak");
    html2pdf()
      .set({
        margin: 0.5,
        filename: "kwitansi.pdf",
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "in", format: "A4", orientation: "portrait" },
      })
      .from(element)
      .save();
    setTimeout(() => setSiswaCetak(null), 1000);
  };

  // Handle click di luar panel atau dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setMenuOpenIndex(null); // tutup semua dropdown
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && user) {
      setMounted(true);
      setTimeout(() => setShowPanel(true), 10);
      setLoading(true);
      fetchHistoryInvoice(user.nis)
        .then((data) => {
          // console.log(data);

          setInvoiceData(data);
        })
        .catch((err) => {
          console.error("Gagal fetch invoice:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, user]);

  const handleClose = () => {
    setShowPanel(false);
    setTimeout(() => {
      setMounted(false);
      onClose();
      setInvoiceData(null);
    }, 300);
  };

  if (!mounted) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide Panel */}
      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-full max-w-xl bg-white dark:bg-gray-800 z-50 shadow-lg transform transition-transform duration-300 ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-50 px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Keuangan Siswa
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-800 dark:hover:text-white text-2xl focus:outline-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Info siswa */}
        <div className="sticky top-[57px] z-40 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <p className="text-base text-gray-700 dark:text-white">
            <span className="font-medium">Nama:</span>{" "}
            {invoiceData?.siswa?.siswa_nama || user?.name}
          </p>
        </div>

        {/* Konten */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {loading ? (
              <p className="text-gray-600 dark:text-white">Memuat data...</p>
            ) : invoiceData?.history?.length > 0 ? (
              invoiceData.history.map((item, index) => {
                // console.log(item);

                const sisa = item.totalTagihan - item.totalBayar;
                let status = "";
                let statusClass = "";

                if (item.totalBayar === 0) {
                  status = "Belum Bayar";
                  statusClass = "bg-red-500 text-white";
                } else if (sisa <= 0) {
                  status = "Lunas";
                  statusClass = "bg-green-500 text-white";
                } else {
                  status = "Belum Lunas";
                  statusClass = "bg-yellow-400 text-black";
                }

                return (
                  <div
                    key={index}
                    className="relative p-4 border border-gray-200 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-800"
                  >
                    {/* Tombol 3 titik */}
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() =>
                          setMenuOpenIndex(
                            menuOpenIndex === index ? null : index
                          )
                        }
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-white focus:outline-none"
                      >
                        <HiDotsVertical className="w-5 h-5" />
                      </button>

                      {menuOpenIndex === index && (
                        <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-50">
                          <button
                            onClick={() => {
                              setMenuOpenIndex(null);
                              console.log("Lihat detail clicked");
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <HiEye className="w-4 h-4" />
                            Lihat Detail
                          </button>
                          <button
                            onClick={() => {
                              setMenuOpenIndex(null);

                              const gabungan = {
                                siswa: invoiceData?.siswa, // info siswa lengkap
                                invoice_id: item.invoice_id,
                                invoice_deskripsi: item.invoice_deskripsi,
                                invoice_tgl: item.invoice_tgl,
                                invoice_jatuh_tempo: item.invoice_jatuh_tempo,
                                totalBayar: item.totalBayar || 0,
                                potongan: item.potongan || 0,
                                tambahan_tagihan: item.tambahan_tagihan ?? [],
                                invoice: {
                                  tagihan: item.tagihan ?? [],
                                },
                              };

                              // console.log(gabungan);

                              setSiswaCetak(gabungan);

                              setTimeout(handleCetakLangsung, 500);
                            }}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                          >
                            <HiPrinter className="w-4 h-4" />
                            Cetak
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Konten Invoice */}
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Invoice: {item.invoice_id}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Tanggal: {formatTanggalLengkap(item.invoice_tgl)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Jatuh Tempo:{" "}
                      {formatTanggalLengkap(item.invoice_jatuh_tempo)}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Diterima: Rp {item.totalBayar.toLocaleString("id-ID")}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Status:{" "}
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${statusClass}`}
                      >
                        {status}
                      </span>
                    </p>
                  </div>
                );
              })
            ) : (
              <p className="text-red-500">Data tidak tersedia</p>
            )}
          </div>
        </div>

        {/* Area Cetak */}
        {siswaCetak && (
          <div className="hidden">
            <InvoicePreview siswa={siswaCetak} />
          </div>
        )}
      </div>
    </>
  );
};

export default KeuanganSlidePanel;
