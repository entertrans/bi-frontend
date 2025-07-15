import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  getInvoiceById,
  getPenerimaInvoice,
  updatePotonganPenerima,
  hapusPenerimaInvoice,
  fetchInvoicePenerima,
} from "../../../api/siswaAPI"; // gunakan path sesuai strukturmu
import InvoiceSiswaPanel from "./InvoiceSiswaPanel";
import TambahPenerimaPanel from "./TambahPenerimaPanel";
import { FaTrash, FaEdit } from "react-icons/fa";
import { formatTanggalLengkap } from "../../../utils/date";
import { showToast, showAlert } from "../../../utils/toast";
import Swal from "sweetalert2";

const PenerimaInvoice = () => {
  const { id } = useParams();
  const decodedId = decodeURIComponent(id);
  const [editPotonganSiswa, setEditPotonganSiswa] = useState(null); // simpan siswa yang akan di-edit
  const [potonganBaru, setPotonganBaru] = useState(0);
  const [invoice, setInvoice] = useState(null);
  const [penerimaList, setPenerimaList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isTambahOpen, setIsTambahOpen] = useState(false);

  const fetchInvoiceData = async () => {
    try {
      const dataInvoice = await getInvoiceById(decodedId);
      setInvoice(dataInvoice);
    } catch (error) {
      console.error("Gagal memuat invoice:", error);
    }

    try {
      const dataPenerima = await getPenerimaInvoice(decodedId);
      setPenerimaList(dataPenerima);
    } catch (error) {
      console.error("Gagal memuat penerima:", error);
    }
  };

  useEffect(() => {
    fetchInvoiceData();
  }, [decodedId]);

  const handleLihatInvoice = async (siswa) => {
    try {
      const data = await fetchInvoicePenerima(siswa.nis);
      setSelectedSiswa(data);
      setIsOpen(true);
    } catch (error) {
      console.error("Gagal mengambil invoice:", error);
      alert("Terjadi kesalahan saat mengambil invoice");
    }
  };

  const handleEditPotongan = (siswa) => {
    setEditPotonganSiswa(siswa);
    setPotonganBaru(siswa.potongan);
  };
  const handleSimpanPotongan = async () => {
    try {
      await updatePotonganPenerima(editPotonganSiswa.id, potonganBaru);
      showToast("Potongan diperbarui");
      setEditPotonganSiswa(null);
      fetchInvoiceData(); // refresh data
    } catch (err) {
      showAlert("Potongan gagal diperbarui", "error");
    }
  };
  const handleHapusPenerima = async (siswa) => {
    const result = await Swal.fire({
      title: "Hapus Penerima?",
      text: `Yakin ingin menghapus ${siswa.siswa?.siswa_nama || siswa.nis}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        await hapusPenerimaInvoice(siswa.id);
        showToast("Penerima berhasil dihapus");
        fetchInvoiceData();
      } catch (error) {
        showAlert("Gagal menghapus penerima.", "error");
      }
    }
  };

  const closePanel = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedSiswa(null), 0);
  };

  if (!invoice) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Invoice Tidak Ditemukan</h1>
        <p>Invoice dengan ID: {decodedId} tidak ditemukan.</p>
      </div>
    );
  }

  const total = invoice.tagihan.reduce((sum, item) => sum + item.nominal, 0);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Detail Invoice */}
      <h1 className="text-2xl font-bold mb-2">Invoice #{invoice.id_invoice}</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-1">
        <strong>Tanggal Invoice:</strong>{" "}
        {formatTanggalLengkap(invoice.tgl_invoice)}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-1">
        <strong>Jatuh Tempo:</strong>{" "}
        {formatTanggalLengkap(invoice.tgl_jatuh_tempo)}
      </p>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        <strong>Deskripsi:</strong> {invoice.deskripsi}
      </p>

      {/* Tabel Tagihan */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm mb-2">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Nama Tagihan</th>
              <th className="px-6 py-3 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {invoice.tagihan.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4">{item.nama}</td>
                <td className="px-6 py-4 text-right">
                  {item.nominal.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-50 dark:bg-gray-900 font-semibold">
            <tr>
              <td className="px-6 py-3 text-right">Total:</td>
              <td className="px-6 py-3 text-right">
                {total.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Tabel Penerima */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">
            Penerima Invoice
          </h2>
          <button
            onClick={() => setIsTambahOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-sm rounded shadow"
          >
            + Tambah Penerima
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">NIS</th>
              <th className="px-6 py-3 text-left">Nama</th>
              <th className="px-6 py-3 text-left">Kelas</th>
              <th className="px-6 py-3 text-right">Potongan</th>
              <th className="px-6 py-3 text-right">Total Bayar</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {penerimaList.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 text-center text-gray-500 italic"
                >
                  Belum ada siswa penerima invoice.
                </td>
              </tr>
            ) : (
              penerimaList.map((siswa) => {
                const totalBayar = total - siswa.potongan;
                return (
                  <tr key={siswa.nis}>
                    <td className="px-6 py-4">{siswa.nis}</td>
                    <td className="px-6 py-4">{siswa.siswa?.siswa_nama}</td>
                    <td className="px-6 py-4">
                      {siswa.siswa?.kelas?.kelas_nama?.replace(
                        /^Kelas\s*/i,
                        ""
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {siswa.potongan.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {totalBayar.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </td>
                    <td className="px-6 py-4 text-center space-x-2">
                      <button
                        onClick={() => handleEditPotongan(siswa)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 text-xs rounded shadow"
                        title="Edit Potongan"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleHapusPenerima(siswa)}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded shadow"
                        title="Hapus Penerima"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleLihatInvoice(siswa)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded shadow"
                      >
                        Lihat Invoice
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Panel Lihat invoice */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={closePanel}
        />
      )}

      <InvoiceSiswaPanel siswa={selectedSiswa} onClose={closePanel} />

      {isTambahOpen && (
        <TambahPenerimaPanel
          invoiceId={invoice.id_invoice}
          onClose={() => setIsTambahOpen(false)}
          onSubmit={() => {
            fetchInvoiceData(); // <--- sudah bisa dipanggil sekarang
            setIsTambahOpen(false);
          }}
        />
      )}
      {/* edit potongan */}
      {editPotonganSiswa && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Potongan</h2>
            <p className="mb-2">
              {editPotonganSiswa.siswa?.siswa_nama || editPotonganSiswa.nis}
            </p>
            <input
              type="number"
              className="w-full px-4 py-2 mb-4 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={potonganBaru}
              onChange={(e) => setPotonganBaru(Number(e.target.value))}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditPotonganSiswa(null)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded"
              >
                Batal
              </button>
              <button
                onClick={handleSimpanPotongan}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PenerimaInvoice;
