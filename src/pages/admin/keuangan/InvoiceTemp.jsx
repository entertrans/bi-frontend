import React, { useState, useEffect } from "react";
import { getAllInvoice, fetchAllTagihan } from "../../../api/siswaAPI";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaTrash } from "react-icons/fa";
import InvoiceSlidePanel from "./InvoiceSlidePanel";
import { formatTanggalLengkap, formatToInputDate } from "../../../utils/date";

const Invoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [newInvoiceID, setNewInvoiceID] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [daftarTagihan, setDaftarTagihan] = useState([]);
  const fetchData = async () => {
    const data = await getAllInvoice(); // misalnya ambil dari API
    setInvoices(data);
  };
  const generateInvoiceID = () => {
    const tahun = new Date().getFullYear();
    const lastId =
      invoices.length > 0
        ? Math.max(...invoices.map((inv) => parseInt(inv.id))) + 1
        : 1;
    const nomor = String(lastId).padStart(4, "0");
    return `INV/${tahun}/${nomor}`;
  };

  useEffect(() => {
    const loadTagihan = async () => {
      try {
        const data = await fetchAllTagihan();
        setDaftarTagihan(data);
      } catch (err) {
        console.error("Gagal mengambil tagihan:", err);
      }
    };
    loadTagihan();
  }, []);

  const navigate = useNavigate();
  const [editData, setEditData] = useState(null);
  useEffect(() => {
    getAllInvoice()
      .then(setInvoices)
      .catch((err) => console.error("Gagal mengambil invoice:", err));
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white">
          Daftar Invoice
        </h2>
        <button
          onClick={() => {
            setEditData(null);
            setNewInvoiceID(generateInvoiceID()); // ← hanya generate saat buat baru
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm shadow"
        >
          + Buat Invoice Baru
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Invoice ID</th>
              <th className="px-6 py-3 text-left">Deskripsi</th>
              <th className="px-6 py-3 text-left">Tgl. Invoice</th>
              <th className="px-6 py-3 text-left">Tgl. Jatuh Tempo</th>
              <th className="px-6 py-3 text-left">Jumlah Tagihan</th>
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
                  Data invoice belum ada.
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
                  <td className="px-6 py-4">
                    {inv.tagihan
                      .reduce((acc, curr) => acc + curr.nominal, 0)
                      .toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    {inv.sudahAdaPenerima ? (
                      <button
                        className="bg-gray-400 text-white px-3 py-1 text-xs rounded shadow cursor-not-allowed"
                        disabled
                        title="Sudah ada penerima, tidak bisa diedit"
                      >
                        Edit
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setEditData(inv);
                          setShowModal(true);
                        }}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded shadow"
                        title="Edit Invoice"
                      >
                        Edit
                      </button>
                    )}

                    <button
                      onClick={() =>
                        navigate(
                          `/admin/invoice/${encodeURIComponent(
                            inv.id_invoice
                          )}/penerima`
                        )
                      }
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 text-xs rounded shadow"
                      title="Tambah Penerima"
                    >
                      <FaPlus />
                    </button>
                    <button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded shadow"
                      title="Hapus Invoice"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <InvoiceSlidePanel
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        initialData={editData}
        isEdit={!!editData}
        fetchData={fetchData}
        initialInvoiceID={newInvoiceID}
      />
    </div>
  );
};

export default Invoice;
