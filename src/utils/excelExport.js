import * as XLSX from "xlsx";

export const exportToExcel = (data, worksheetName, fileName) => {
  // Create workbook and worksheet
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, fileName);
};

export const exportRekapNilai = (data, mapel, kelas, typeLabels, type) => {
  const worksheetName = `Rekap ${mapel}`;
  const fileName = `Rekap_Nilai_${mapel}_${kelas}.xlsx`;

  // Format data untuk rekap nilai
  const dataForExport = data.map((test, index) => ({
    No: index + 1,
    "Judul Test": test.judul,
    "Guru Pengajar": test.guru_nama,
    "Durasi (menit)": test.durasi_menit,
    "Jumlah Soal": test.jumlah_soal,
    "Tanggal Dibuat": test.created_at,
    "Jenis Test": typeLabels[type],
  }));

  exportToExcel(dataForExport, worksheetName, fileName);
};
