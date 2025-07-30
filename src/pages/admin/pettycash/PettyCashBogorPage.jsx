import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getPettyCashByLokasi,
  deletePettyCashPeriode,
  getTransaksiByPeriode,
} from "../../../api/siswaAPI";
import {
  formatRupiah,
  formatTanggalIndo,
  formatTanggalLengkap,
} from "../../../utils/format";
import { showToast } from "../../../utils/toast";
import PettyCashPeriodeModal from "./PettyCashPeriodeModal";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const PettyCashBogorPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState(null);
  const [periodeList, setPeriodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  //cetak
  const handleCetakLaporan = async (idPeriode, deskripsi) => {
    const result = await Swal.fire({
      title: "Cetak Laporan?",
      text: `Apakah Anda yakin ingin mencetak laporan Petty Cash untuk periode "${deskripsi}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, cetak!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-blue-600 hover:bg-blue-700 text-white font-semibold mr-4 px-4 py-2 rounded",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    try {
      const res = await getTransaksiByPeriode(idPeriode);
      const transaksi = res.transaksis.sort(
        (a, b) => new Date(a.tanggal) - new Date(b.tanggal)
      );

      let saldo = 0;
      const rows = transaksi.map((trx) => {
        saldo += trx.jenis === "masuk" ? trx.nominal : -trx.nominal;
        return {
          Tanggal: formatTanggalLengkap(trx.tanggal),
          Keterangan: trx.keterangan,
          Debet: trx.jenis === "masuk" ? trx.nominal : 0,
          Kredit: trx.jenis === "keluar" ? trx.nominal : 0,
          Saldo: saldo,
        };
      });

      // Tambahkan total baris di akhir
      const totalDebet = rows.reduce((sum, r) => sum + r.Debet, 0);
      const totalKredit = rows.reduce((sum, r) => sum + r.Kredit, 0);

      rows.push({});
      rows.push({
        Tanggal: "TOTAL",
        Keterangan: "",
        Debet: totalDebet,
        Kredit: totalKredit,
        Saldo: saldo,
      });

      const worksheet = XLSX.utils.json_to_sheet(rows);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Petty Cash");

      const fileName = `Laporan_PettyCash_${deskripsi.replace(
        /\s/g,
        "_"
      )}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (error) {
      console.error("Gagal cetak laporan:", error);
      Swal.fire("Error", "Gagal membuat laporan.", "error");
    }
  };
  //cetak

  const handleModalOpen = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);
  const handlePeriodeSelect = (periode) => setSelectedPeriode(periode);
  const handleDeletePettyCash = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data petty cash ini akan dihapus secara permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded mr-2",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded",
      },
    });

    if (result.isConfirmed) {
      try {
        await deletePettyCashPeriode(id);
        showToast("Data petty cash telah dihapus.", "success");
        fetchPettyCash(); // reload data table
      } catch (error) {
        showToast("Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  const fetchPettyCash = async () => {
    try {
      const res = await getPettyCashByLokasi("bogor");
      setPeriodeList(res);
    } catch (error) {
      console.error("Gagal mengambil data petty cash:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPettyCash();
  }, []);

  const handleTransaksiClick = (id) => {
    navigate(`/pettycash/bogor/${id}/transaksi`);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Petty Cash Anak Panah Bogor</h1>
        <button
          onClick={handleModalOpen}
          className="bg-blue-500 px-4 py-2 text-white rounded"
        >
          + Tambah Periode
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Deskripsi</th>
              <th className="px-6 py-3 border">Tanggal Mulai</th>
              <th className="px-6 py-3 border">Status</th>
              <th className="px-6 py-3 border">Sisa Saldo</th>
              <th className="px-6 py-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {periodeList.map((periode) => (
              <tr key={periode.id}>
                <td className="px-6 py-4 border">{periode.kode_periode}</td>
                <td className="px-6 py-4 border">{periode.deskripsi}</td>
                <td className="px-6 py-4 border">
                  {formatTanggalIndo(periode.tanggal_mulai)}
                </td>
                <td className="px-6 py-4 border capitalize">
                  {periode.status}
                </td>
                <td className="px-6 py-4 border">
                  {formatRupiah(periode.saldo_awal)}
                </td>
                <td className="px-6 py-4 border space-x-2 text-center">
                  <button
                    onClick={() => handleTransaksiClick(periode.id)}
                    className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                  >
                    Transaksi
                  </button>
                  <button
                    onClick={() =>
                      handleCetakLaporan(periode.id, periode.deskripsi)
                    }
                    className="text-white bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded"
                  >
                    Cetak
                  </button>

                  <button
                    onClick={() => handleDeletePettyCash(periode.id)}
                    className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <PettyCashPeriodeModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={() => {
          fetchPettyCash(); // ← refresh data dari server setelah tambah
          handleModalClose();
        }}
        lokasiAktif="Bogor"
        lastKodePeriode={(() => {
          const prefix = "BGR-";
          const kodeList = periodeList
            .map((p) => p.kode_periode)
            .filter((kode) => kode.startsWith(prefix));
          if (kodeList.length === 0) return "";
          return kodeList.sort().at(-1);
        })()}
      />
    </div>
  );
};

export default PettyCashBogorPage;
