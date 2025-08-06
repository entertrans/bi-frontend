// src/utils/format.js

export const formatRupiah = (angka) => {
  if (typeof angka !== "number") {
    angka = parseInt(angka);
    if (isNaN(angka)) return "Rp0";
  }

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(angka);
};

export const formatTanggalIndo = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatTanggalLengkap = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const terbilang = (angka) => {
  const satuan = [
    "",
    "Satu",
    "Dua",
    "Tiga",
    "Empat",
    "Lima",
    "Enam",
    "Tujuh",
    "Delapan",
    "Sembilan",
    "Sepuluh",
    "Sebelas",
  ];

  const konversi = (n) => {
    let hasil = "";

    if (n < 12) {
      hasil = satuan[n];
    } else if (n < 20) {
      hasil = konversi(n - 10) + " Belas";
    } else if (n < 100) {
      hasil = konversi(Math.floor(n / 10)) + " Puluh " + konversi(n % 10);
    } else if (n < 200) {
      hasil = "Seratus " + konversi(n - 100);
    } else if (n < 1000) {
      hasil = konversi(Math.floor(n / 100)) + " Ratus " + konversi(n % 100);
    } else if (n < 2000) {
      hasil = "Seribu " + konversi(n - 1000);
    } else if (n < 1000000) {
      hasil = konversi(Math.floor(n / 1000)) + " Ribu " + konversi(n % 1000);
    } else if (n < 1000000000) {
      hasil =
        konversi(Math.floor(n / 1000000)) + " Juta " + konversi(n % 1000000);
    } else if (n < 1000000000000) {
      hasil =
        konversi(Math.floor(n / 1000000000)) +
        " Miliar " +
        konversi(n % 1000000000);
    } else if (n < 1000000000000000) {
      hasil =
        konversi(Math.floor(n / 1000000000000)) +
        " Triliun " +
        konversi(n % 1000000000000);
    }

    return hasil.trim();
  };

  return angka === 0 ? "Nol" : konversi(angka);
};
