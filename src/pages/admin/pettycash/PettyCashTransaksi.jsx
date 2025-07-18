import React, { useState } from "react";
import Swal from "sweetalert2";

// Dummy transaksi awal
const dummyTransaksi = [
  {
    tanggal: "2025-07-18",
    keterangan: "Masker & Tisu",
    debet: 0,
    kredit: 1000000,
  },
  {
    tanggal: "2025-07-17",
    keterangan: "Topup Petty Cash",
    debet: 2000000,
    kredit: 0,
  },
];

const PettyCashTransaksi = () => {
  const [transaksi, setTransaksi] = useState(dummyTransaksi);
  const [input, setInput] = useState({
    tanggal: "",
    keterangan: "",
    debet: "",
    kredit: "",
  });

  // Hitung saldo dari transaksi (ASC → lalu assign ke DESC)
  const hitungSaldo = () => {
    const listAsc = [...transaksi].reverse();
    let saldo = 0;
    const withSaldo = listAsc.map((item) => {
      saldo += Number(item.debet) - Number(item.kredit);
      return { ...item, saldo };
    });
    return withSaldo.reverse(); // balik lagi ke DESC
  };

  const dataWithSaldo = hitungSaldo();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const handleTambah = async () => {
    if (
      !input.tanggal ||
      !input.keterangan ||
      (!input.debet && !input.kredit)
    ) {
      Swal.fire("Oops!", "Lengkapi semua data dulu ya!", "warning");
      return;
    }

    const result = await Swal.fire({
      title: "Tambah Transaksi?",
      text: "Data akan ditambahkan ke transaksi petty cash.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, tambahkan!",
    });

    if (result.isConfirmed) {
      const newData = {
        tanggal: input.tanggal,
        keterangan: input.keterangan,
        debet: Number(input.debet) || 0,
        kredit: Number(input.kredit) || 0,
      };
      setTransaksi([newData, ...transaksi]);
      setInput({ tanggal: "", keterangan: "", debet: "", kredit: "" });
    }
  };

  const formatRupiah = (angka) =>
    angka?.toLocaleString("id-ID", { style: "currency", currency: "IDR" });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Petty Cash Transaksi</h2>
      <div className="mb-2 font-semibold">
        💼 Saldo Saat Ini:{" "}
        {formatRupiah(dataWithSaldo.length > 0 ? dataWithSaldo[0].saldo : 0)}
      </div>
      <table className="min-w-full border border-gray-300 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tanggal</th>
            <th className="p-2 border">Keterangan</th>
            <th className="p-2 border">Debet</th>
            <th className="p-2 border">Kredit</th>
            <th className="p-2 border">Saldo</th>
            <th className="p-2 border">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {/* Baris Input */}
          <tr className="bg-yellow-50">
            <td className="p-2 border">
              <input
                type="date"
                name="tanggal"
                value={input.tanggal}
                onChange={handleChange}
                className="w-full border px-1 py-0.5"
              />
            </td>
            <td className="p-2 border">
              <input
                type="text"
                name="keterangan"
                value={input.keterangan}
                onChange={handleChange}
                className="w-full border px-1 py-0.5"
              />
            </td>
            <td className="p-2 border">
              <input
                type="number"
                name="debet"
                value={input.debet}
                onChange={handleChange}
                className="w-full border px-1 py-0.5"
              />
            </td>
            <td className="p-2 border">
              <input
                type="number"
                name="kredit"
                value={input.kredit}
                onChange={handleChange}
                className="w-full border px-1 py-0.5"
              />
            </td>
            <td className="p-2 border text-center text-gray-400">--</td>
            <td className="p-2 border text-center">
              <button
                onClick={handleTambah}
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
              >
                +
              </button>
            </td>
          </tr>

          {/* Baris Transaksi */}
          {dataWithSaldo.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 border">{item.tanggal}</td>
              <td className="p-2 border">{item.keterangan}</td>
              <td className="p-2 border text-right">
                {item.debet ? formatRupiah(item.debet) : "-"}
              </td>
              <td className="p-2 border text-right">
                {item.kredit ? formatRupiah(item.kredit) : "-"}
              </td>
              <td className="p-2 border text-right">
                {formatRupiah(item.saldo)}
              </td>
              <td className="p-2 border text-center text-red-500">x</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PettyCashTransaksi;
