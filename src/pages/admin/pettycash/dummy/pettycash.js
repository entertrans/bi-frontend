export const dummyPeriodePettyCash = [
  {
    id: 1,
    kode_periode: "PC-202507-001",
    deskripsi: "Petty Cash Periode Juli",
    tanggal_mulai: "2025-07-16",
    saldo_awal: 5000000,
    lokasi: "serpong",
    status: "aktif", // atau "ditutup"
  },
  {
    id: 2,
    kode_periode: "PC-202506-001",
    deskripsi: "Petty Cash Periode Juni",
    tanggal_mulai: "2025-06-15",
    saldo_awal: 3000000,
    lokasi: "serpong",
    status: "ditutup",
  },
];

export const dummyTransaksiPettyCash = [
  {
    id: 1,
    periode_id: 1,
    tanggal: "2025-07-18",
    keterangan: "Masker & Tisu",
    tipe: "keluar",
    jumlah: 1000000,
  },
  {
    id: 2,
    periode_id: 1,
    tanggal: "2025-07-17",
    keterangan: "Topup Petty Cash",
    tipe: "masuk",
    jumlah: 2000000,
  },
  {
    id: 3,
    periode_id: 1,
    tanggal: "2025-07-16",
    keterangan: "Saldo awal",
    tipe: "masuk",
    jumlah: 5000000,
  },
];
