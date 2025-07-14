// utils/date.js

// Format: "11 Juli 2025"
export const formatTanggalIndonesia = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Format: "Jumat, 11 Juli 2025"
export const formatTanggalLengkap = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Format: "11/07/2025"
export const formatTanggalSingkat = (isoDate) => {
  if (!isoDate) return "-";
  return new Date(isoDate).toLocaleDateString("id-ID");
};

// utils/formatTanggalInput.js
export const formatToInputDate = (tanggal) => {
  if (!tanggal) return "";
  const dateObj = new Date(tanggal);
  const offset = dateObj.getTimezoneOffset();
  dateObj.setMinutes(dateObj.getMinutes() - offset); // untuk menghindari pergeseran zona waktu
  return dateObj.toISOString().split("T")[0]; // hasil: YYYY-MM-DD
};
