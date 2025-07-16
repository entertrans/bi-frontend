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
