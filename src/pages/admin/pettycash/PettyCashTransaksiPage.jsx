import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { showToast, showAlert } from "../../../utils/toast";
import Swal from "sweetalert2";
import {
  getTransaksiByPeriode,
  addTransaksi,
  deleteTransaksi,
} from "../../../api/siswaAPI";
import { formatRupiah, formatTanggalIndo } from "../../../utils/format";

const PettyCashTransaksiPage = () => {
  const { id } = useParams();
  const [periode, setPeriode] = useState(null);
  const [transaksiData, setTransaksiData] = useState([]);
  const [input, setInput] = useState({
    tanggal: "",
    keterangan: "",
    debet: "",
    kredit: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTransaksiByPeriode(id);

        setPeriode(res.periode);
        setTransaksiData(res.transaksis);
        // Optional: setSaldoAkhir(res.saldo);
      } catch (error) {
        console.error("Gagal load transaksi:", error);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleTambahTransaksi = async () => {
    const { tanggal, keterangan, debet, kredit } = input;

    if (!tanggal || !keterangan || (!debet && !kredit)) {
      alert("Lengkapi semua isian dengan benar!");
      return;
    }

    const jenis = debet ? "masuk" : "keluar";
    const nominal = parseInt(debet || kredit);

    const newData = {
      id_periode: parseInt(id),
      tanggal: new Date(tanggal),
      keterangan,
      jenis,
      nominal,
    };

    try {
      const created = await addTransaksi(newData);
      setTransaksiData((prev) => [...prev, created]);
      setInput({ tanggal: "", keterangan: "", debet: "", kredit: "" });
      showToast("Berhasil Tambah Transaksi", "success");
    } catch (error) {
      console.error("Gagal tambah transaksi:", error);
    }
  };

  const handleHapusTransaksi = async (trxId) => {
    const result = await Swal.fire({
      title: "Hapus Transaksi?",
      text: "Apakah kamu yakin ingin menghapus transaksi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold mr-4 px-4 py-2 rounded",
        cancelButton:
          "bg-gray-300 hover:bg-gray-400 text-black font-semibold px-4 py-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await deleteTransaksi(trxId);
      setTransaksiData((prev) => prev.filter((trx) => trx.id !== trxId));
      showToast("Transaksi telah dihapus.", "success");
    } catch (error) {
      console.error("Gagal hapus transaksi:", error);
      showToast("Terjadi kesalahan saat menghapus transaksi.", "error");
    }
  };

  const transaksi = [...transaksiData].sort(
    (a, b) => new Date(b.tanggal) - new Date(a.tanggal)
  );

  let saldo = 0;
  const dataWithSaldo = transaksi
    .slice()
    .reverse()
    .map((trx) => {
      saldo += trx.jenis === "masuk" ? trx.nominal : -trx.nominal;
      return { ...trx, saldo };
    })
    .reverse();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">
        {periode?.deskripsi || "Loading..."}
      </h2>
      <div className="mb-4 text-sm text-gray-700">
        🏢 Lokasi: {periode?.lokasi?.toUpperCase()} | 📅 Mulai:{" "}
        {formatTanggalIndo(periode?.tanggal_mulai)} | 💼 Saldo Saat Ini:{" "}
        <strong>{formatRupiah(dataWithSaldo[0]?.saldo || 0)}</strong>
      </div>

      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left">Tanggal</th>
            <th className="px-6 py-3 text-left">Keterangan</th>
            <th className="px-6 py-3 text-left">Debet</th>
            <th className="px-6 py-3 text-left">Kredit</th>
            <th className="px-6 py-3 text-left">Saldo</th>
            <th className="px-6 py-3 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {/* Form input transaksi */}
          <tr>
            <td className="px-6 py-4">
              <input
                type="date"
                name="tanggal"
                value={input.tanggal}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-44 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4">
              <input
                type="text"
                name="keterangan"
                value={input.keterangan}
                onChange={handleInputChange}
                placeholder="Keterangan..."
                className="p-2 border rounded w-full md:w-52 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4 text-right">
              <input
                type="number"
                name="debet"
                value={input.debet}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-32 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4 text-right">
              <input
                type="number"
                name="kredit"
                value={input.kredit}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-32 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4 text-center text-gray-400">--</td>
            <td className="px-6 py-4 text-center">
              <button
                onClick={handleTambahTransaksi}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 rounded shadow-sm"
              >
                +
              </button>
            </td>
          </tr>

          {/* List transaksi */}
          {dataWithSaldo.map((trx, index) => (
            <tr key={index}>
              <td className="px-6 py-4">{formatTanggalIndo(trx.tanggal)}</td>
              <td className="px-6 py-4">{trx.keterangan}</td>
              <td className="px-6 py-4 text-right">
                {trx.jenis === "masuk" ? formatRupiah(trx.nominal) : "-"}
              </td>
              <td className="px-6 py-4 text-right">
                {trx.jenis === "keluar" ? formatRupiah(trx.nominal) : "-"}
              </td>
              <td className="px-6 py-4 text-right">
                {formatRupiah(trx.saldo)}
              </td>
              <td className="px-6 py-4 text-center text-red-500">
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleHapusTransaksi(trx.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Hapus transaksi"
                  >
                    ❌
                  </button>
                </td>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PettyCashTransaksiPage;
