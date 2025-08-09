import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { getInvoiceById, getPenerimaInvoice } from "../../../api/siswaAPI";
import { formatTanggalLengkap } from "../../../utils/date";
import KwitansiBayarPanel from "../keuangan/KwitansiBayarPanel";

const KwitansiDetail = () => {
  const handleRefresh = async () => {
    await fetchData();

    try {
      const updatedList = await getPenerimaInvoice(decodedId); // ambil data terbaru
      const refreshed = updatedList.find((s) => s.id === selectedSiswa?.id);

      setPenerimaList(updatedList); // update state juga
      setSelectedSiswa(refreshed); // langsung ambil dari data terbaru
    } catch (err) {
      console.error("Gagal refresh data:", err);
    }
  };

  const hitungTotalTagihan = (siswa) => {
    const tambahan =
      siswa?.tambahan_tagihan?.reduce((a, b) => a + Number(b.nominal), 0) || 0;
    const potongan = Number(siswa?.potongan || 0);
    return totalTagihan + tambahan - potongan;
  };

  const { id_invoice } = useParams();
  const decodedId = decodeURIComponent(id_invoice);
  const [invoice, setInvoice] = useState(null);
  const [penerimaList, setPenerimaList] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedSiswa, setSelectedSiswa] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const inv = await getInvoiceById(decodedId);
      const penerima = await getPenerimaInvoice(decodedId);
      setInvoice(inv);
      setPenerimaList(penerima);
    } catch (error) {
      console.error("Gagal memuat data kwitansi:", error);
    }
  }, [decodedId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!invoice) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold">Invoice Tidak Ditemukan</h1>
        <p>ID: {decodedId}</p>
      </div>
    );
  }

  const totalTagihan = Array.isArray(invoice.tagihan)
    ? invoice.tagihan.reduce((acc, curr) => acc + curr.nominal, 0)
    : 0;

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Invoice #{invoice.id_invoice}</h1>
      <p className="text-gray-700 dark:text-gray-300 mb-1">
        <strong>Tanggal Invoice:</strong>{" "}
        {formatTanggalLengkap(invoice.tgl_invoice)}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-1">
        <strong>Jatuh Tempo:</strong>{" "}
        {formatTanggalLengkap(invoice.tgl_jatuh_tempo)}
      </p>
      <p className="text-gray-700 dark:text-gray-300 mb-6">
        <strong>Deskripsi:</strong> {invoice.deskripsi}
      </p>

      {/* Tabel Penerima */}
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
            {penerimaList.map((siswa) => {
              const tambahan =
                siswa?.tambahan_tagihan?.reduce(
                  (acc, t) => acc + Number(t.nominal),
                  0
                ) || 0;

              const totalBayar =
                siswa?.pembayaran?.reduce(
                  (acc, p) => acc + Number(p.Nominal),
                  0
                ) || 0;

              const tagihanFinal =
                totalTagihan + tambahan - Number(siswa.potongan || 0);
              const sisa = tagihanFinal - totalBayar;

              let status = "Belum Bayar";
              let warna = "bg-red-500 text-white";

              if (sisa <= 0) {
                status = "Lunas";
                warna = "bg-green-500 text-white";
              } else if (totalBayar > 0) {
                status = "Belum Lunas";
                warna = "bg-yellow-400 text-black";
              }

              return (
                <tr key={siswa.id}>
                  <td className="px-6 py-4">{siswa.nis}</td>
                  <td className="px-6 py-4">
                    {siswa.siswa?.siswa_nama || "-"}
                  </td>
                  <td className="px-6 py-4">
                    {siswa.siswa?.kelas?.kelas_nama?.replace(
                      /^Kelas\s*/i,
                      ""
                    ) || "-"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {tagihanFinal.toLocaleString("id-ID", {
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
                  <td className="px-6 py-4 text-right">
                    {sisa.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${warna}`}
                    >
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
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
        onRefresh={handleRefresh}
        data={{
          ...selectedSiswa,
          id_invoice: invoice?.id_invoice,
          nama: selectedSiswa?.siswa?.siswa_nama || "-",
          kelas:
            selectedSiswa?.siswa?.kelas?.kelas_nama?.replace(
              /^Kelas\s*/i,
              ""
            ) || "-",
          total_tagihan: hitungTotalTagihan(selectedSiswa),
          total_bayar:
            selectedSiswa?.pembayaran?.reduce(
              (a, p) => a + Number(p.nominal ?? p.Nominal ?? 0),
              0
            ) || 0,
          pembayaran:
            selectedSiswa?.pembayaran?.map((p) => ({
              ...p,
              nominal: Number(p.nominal ?? p.Nominal ?? 0),
            })) || [],
        }}
        variant="top"
      />
    </div>
  );
};

export default KwitansiDetail;
