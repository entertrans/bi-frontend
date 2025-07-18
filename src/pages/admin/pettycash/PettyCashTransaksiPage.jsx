import React from "react";
import { useParams } from "react-router-dom";
import {
  dummyPeriodePettyCash,
  dummyTransaksiPettyCash,
} from "./dummy/pettycash";
import { formatRupiah, formatTanggalIndo } from "../../../utils/format";

const PettyCashTransaksiPage = () => {
  const { id } = useParams();
  const periode = dummyPeriodePettyCash.find((p) => p.id === parseInt(id));
  const [input, setInput] = React.useState({
    tanggal: "",
    keterangan: "",
    debet: "",
    kredit: "",
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const transaksi = dummyTransaksiPettyCash
    .filter((trx) => trx.periode_id === parseInt(id))
    .sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal)); // DESC

  let saldo = 0;
  const dataWithSaldo = transaksi
    .slice() // clone
    .reverse() // ASC untuk hitung
    .map((trx) => {
      saldo += trx.tipe === "masuk" ? trx.jumlah : -trx.jumlah;
      return { ...trx, saldo };
    })
    .reverse(); // balik ke DESC

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">{periode.deskripsi}</h2>
      <div className="mb-4 text-sm text-gray-700">
        🏢 Lokasi: {periode.lokasi.toUpperCase()} | 📅 Mulai:{" "}
        {formatTanggalIndo(periode.tanggal_mulai)} | 💼 Saldo Saat Ini:{" "}
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
          <tr>
            <td className="px-6 py-4">
              <input
                type="date"
                name="tanggal"
                value={input.tanggal}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4">
              <input
                type="text"
                name="keterangan"
                value={input.keterangan}
                onChange={handleInputChange}
                placeholder="Keterangan..."
                className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4 text-right">
              <input
                type="number"
                name="debet"
                value={input.debet}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4 text-right">
              <input
                type="number"
                name="kredit"
                value={input.kredit}
                onChange={handleInputChange}
                className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
              />
            </td>
            <td className="px-6 py-4 text-center text-gray-400">--</td>
            <td className="px-6 py-4 text-center">
              <button
                onClick={() => alert("Tambah dummy transaksi")}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1 rounded shadow-sm"
              >
                +
              </button>
            </td>
          </tr>

          {dataWithSaldo.map((trx, index) => (
            <tr key={index}>
              <td className="px-6 py-4">{formatTanggalIndo(trx.tanggal)}</td>
              <td className="px-6 py-4">{trx.keterangan}</td>
              <td className="px-6 py-4 text-right">
                {trx.tipe === "masuk" ? formatRupiah(trx.jumlah) : "-"}
              </td>
              <td className="px-6 py-4 text-right">
                {trx.tipe === "keluar" ? formatRupiah(trx.jumlah) : "-"}
              </td>
              <td className="px-6 py-4 text-right">
                {formatRupiah(trx.saldo)}
              </td>
              <td className="px-6 py-4 text-center text-red-500">x</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PettyCashTransaksiPage;
