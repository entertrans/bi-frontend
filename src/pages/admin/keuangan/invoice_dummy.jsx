const invoiceDummy = [
  {
    id_invoice: "UNBK/2025/0001",
    deskripsi: "Invoice SPP Semester 1",
    tgl_invoice: "2025-07-10",
    tgl_jatuh_tempo: "2025-07-31",
    tagihan: [
      { nama: "SPP Juli", nominal: 300000 },
      { nama: "SPP Agustus", nominal: 300000 },
    ],
    sudahAdaPenerima: true, // 👈
  },
  {
    id_invoice: "UNBK/2025/0002",
    deskripsi: "Invoice Seragam",
    tgl_invoice: "2025-07-11",
    tgl_jatuh_tempo: "2025-08-15",
    tagihan: [{ nama: "Seragam Putih Abu", nominal: 200000 }],
    sudahAdaPenerima: false, // 👈
  },
];

export default invoiceDummy;
