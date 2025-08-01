import React from "react";

const InvoicePreview = () => {
  const data = {
    Nama: "Amazing Grace Danielle Prakoso",
    Kelas: "XII IPS",
    address: "123 Elm Street Green Valley",
    phone: "0817777673",
    email: "anakpanah200@gmail.com",
    invoiceNumber: "#UNBK/2025/0003",
    invoiceDate: "Kamis, 31 Juli 2025",
    items: [
      {
        namaTagihan: "PENDAFTARAN SMA TH AJARAN 2024/2025",
        Nominal: 3250000,
      },
      {
        namaTagihan: "DAFTAR ULANG SMA TH AJARAN 2024/2025",
        Nominal: 1200000,
      },
    ],
  };

  const subtotal = data.items.reduce((sum, item) => sum + item.Nominal, 0);
  const potongan = 100000; // bisa diganti jika ada potongan
  const total = subtotal - potongan;

  return (
    <div
      id="kwitansi-cetak"
      className="max-w-3xl mx-auto p-8 bg-white text-black"
    >
      {/* Header */}
      <div className="flex justify-between items-start border-b pb-4 gap-4">
        <div className="grid grid-cols-1 gap-1 text-sm">
          <div>
            <span className="font-semibold">Penerima :</span>
            <div>{data.Nama}</div>
          </div>
          <div>
            <span className="font-semibold">Kelas :</span>
            <div>{data.Kelas}</div>
          </div>
          <div>
            <span className="font-semibold">Phone:</span>
            <div>{data.phone}</div>
          </div>
          <div>
            <span className="font-semibold">Email:</span>
            <div>{data.email}</div>
          </div>
        </div>

        <div className="flex flex-col items-end text-right text-sm">
          <img
            src="/assets/img/logo-anak-panah-yang-png.png"
            alt="Logo"
            className="w-24 h-auto mb-2"
          />
          <div>
            <span className="font-semibold">Referensi :</span>{" "}
            {data.invoiceNumber}
          </div>
          <div>
            <span className="font-semibold">Tgl Jatuh Tempo :</span>{" "}
            {data.invoiceDate}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-5">
        <h2 className="text-lg font-semibold mb-2">Detail Tagihan:</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-yellow-300 text-left">
              <th className="p-2 border">No</th>
              <th className="p-2 border">Nama Tagihan</th>
              <th className="p-2 border">Nominal</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item, i) => (
              <tr key={i} className="bg-gray-100">
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{item.namaTagihan}</td>
                <td className="p-2 border">
                  Rp {item.Nominal.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 flex justify-end">
        <div className="w-1/3 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rp {subtotal.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between">
            <span>Potongan</span>
            <span>Rp {potongan.toLocaleString("id-ID")}</span>
          </div>
          <div className="flex justify-between font-bold border-t mt-2 pt-2">
            <span>Total</span>
            <span>Rp {total.toLocaleString("id-ID")}</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t pt-4 text-sm text-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div>
            <h3 className="font-semibold text-black">
              Anak Panah Cyberschool:
            </h3>
            <p>Jl. Raya Danau Poso Blok AA1. No. 27 - 29</p>
            <p>Cluster Catalina, Gading Serpong</p>
            <p>Medang, Pagedangan, Kab. Tangerang</p>
            <p>Banten, 15331 Indonesia</p>
          </div>
          <div>
            <p>
              <strong>Telp:</strong> 0818777673
            </p>
            <p>
              <strong>Email:</strong> finance@anakpanah.sch.id
            </p>
            <p>
              <strong>No Rekening: </strong> 8831177756 <div className="text-xs text-gray-500 italic">( BCA a/n Yayasan Anak Panah Bangsa )</div>
            </p>
            <p className="mt-2 text-xs text-gray-500 italic">
              * Mohon simpan bukti invoice ini sebagai arsip Anda.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
