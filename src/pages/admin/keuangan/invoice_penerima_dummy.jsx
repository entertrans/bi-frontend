const dummyPenerima = [
  {
    nis: "12345",
    nama: "Budi",
    kelas: "9A",
    potongan: 0,
    tambahan_tagihan: [], // Tidak ada tambahan
  },
  {
    nis: "67890",
    nama: "Sari",
    kelas: "9A",
    potongan: 0,
    tambahan_tagihan: [
      {
        nama: "SPP Semester 2",
        nominal: 500000,
      },
    ],
  },
  {
    nis: "54321",
    nama: "Tono",
    kelas: "9A",
    potongan: 100000,
    tambahan_tagihan: [],
  },
  {
    nis: "67890",
    nama: "Sari 2",
    kelas: "9A",
    potongan: 0,
    tambahan_tagihan: [
      {
        nama: "SPP Semester 2",
        nominal: 500000,
      },
      {
        nama: "Kegiatan Pramuka",
        nominal: 150000,
      },
    ],
  },
];
export default dummyPenerima;
