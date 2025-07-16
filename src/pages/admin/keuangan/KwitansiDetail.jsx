import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import { getInvoiceDetailById } from "../../../api/kwitansiAPI"; // nanti setelah ada API
import { formatTanggalLengkap } from "../../../utils/date";
import KwitansiBayarPanel from "./KwitansiBayarPanel";

const dummyDetail = {
  id_invoice: "UNBK/2025/001",
  tgl_invoice: "2025-07-11",
  tgl_jatuh_tempo: "2025-07-31",
  deskripsi: "UNBK 2025",
  penerima: [
    {
      nis: "01234",
      nama: "Budi",
      kelas: "9A",
      total_tagihan: 150000,
      total_bayar: 100000,
      pembayaran: [
        { tanggal: "2025-07-12", nominal: 50000 },
        { tanggal: "2025-07-14", nominal: 50000 },
      ],
    },
    {
      id: 2,
      nis: "01235",
      nama: "Budi2",
      kelas: "9A",
      total_tagihan: 150000,
      total_bayar: 150000,
    },
    {
      id: 3,
      nis: "01236",
      nama: "Budi3",
      kelas: "9A",
      total_tagihan: 150000,
      total_bayar: 0,
    },
  ],
};

const KwitansiDetail = () => {
  const { id_invoice } = useParams();
  const [data, setData] = useState(null);

  const [showPanel, setShowPanel] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  useEffect(() => {
    // getInvoiceDetailById(id_invoice)
    //   .then(setData)
    //   .catch(err => console.error("Gagal ambil detail invoice", err));

    setData(dummyDetail); // sementara dummy
  }, [id_invoice]);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
        Detail Invoice #{data?.id_invoice}
      </h2>

      {data && (
        <div className="mb-6 text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <p>
            <strong>Tanggal Invoice:</strong>{" "}
            {formatTanggalLengkap(data.tgl_invoice)}
          </p>
          <p>
            <strong>Jatuh Tempo:</strong>{" "}
            {formatTanggalLengkap(data.tgl_jatuh_tempo)}
          </p>
          <p>
            <strong>Deskripsi:</strong> {data.deskripsi}
          </p>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3">NIS</th>
              <th className="px-6 py-3">Nama</th>
              <th className="px-6 py-3">Kelas</th>
              <th className="px-6 py-3 text-right">Total Tagihan</th>
              <th className="px-6 py-3 text-right">Total Bayar</th>
              <th className="px-6 py-3 text-right">Kurang</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {data?.penerima.map((siswa) => {
              const kurang = siswa.total_tagihan - siswa.total_bayar;
              const status =
                kurang <= 0
                  ? "Lunas"
                  : siswa.total_bayar > 0
                  ? "Belum Lunas"
                  : "Belum Bayar";
              const warna =
                status === "Lunas"
                  ? "bg-green-500"
                  : status === "Belum Lunas"
                  ? "bg-yellow-400"
                  : "bg-red-500";

              return (
                <tr key={siswa.id}>
                  <td className="px-6 py-3">{siswa.nis}</td>
                  <td className="px-6 py-3">{siswa.nama}</td>
                  <td className="px-6 py-3">{siswa.kelas}</td>
                  <td className="px-6 py-3 text-right">
                    {siswa.total_tagihan.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {siswa.total_bayar.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="px-6 py-3 text-right">
                    {kurang.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2.5 w-2.5 rounded-full ${warna}`}
                      ></div>
                      {status}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded shadow"
                      onClick={() => {
                        setSelectedSiswa(siswa);
                        setShowPanel(true);
                      }}
                    >
                      💰 Bayar
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <KwitansiBayarPanel
        isOpen={showPanel}
        onClose={() => setShowPanel(false)}
        data={{
          ...selectedSiswa,
          id_invoice: data?.id_invoice,
          pembayaran: selectedSiswa?.pembayaran || [], // 👈 tambahkan fallback kosong
        }}
      />
    </div>
  );
};

export default KwitansiDetail;
