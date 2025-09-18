// utils/exportRekapNilaiSiswa.js
import * as XLSX from "xlsx";

export const exportRekapNilaiSiswa = (
  siswaData,
  testData,
  mapel,
  kelas,
  type
) => {
  const worksheetName = `Rekap Nilai ${mapel}`;
  const fileName = `Rekap_Nilai_Siswa_${mapel}_${kelas}.xlsx`;

  // Siapkan header
  const headers = ["Nama", "NIS", "Kelas"];

  // Tambahkan judul test sebagai header
  testData.forEach((test) => {
    headers.push(test.judul);
  });
  headers.push("Rata-rata");

  // Siapkan data
  const dataForExport = [headers];

  // Process setiap siswa
  siswaData.forEach((siswa) => {
    const row = [siswa.nama, siswa.nis, siswa.kelas_nama];

    let totalNilai = 0;
    let countTest = 0;

    // Cari nilai untuk setiap test
    testData.forEach((test) => {
      const nilaiTest = siswaData.find(
        (s) => s.siswa_id === siswa.siswa_id && s.test_id === test.test_id
      )?.nilai;

      if (nilaiTest !== null && nilaiTest !== undefined) {
        row.push(nilaiTest);
        totalNilai += nilaiTest;
        countTest++;
      } else {
        row.push("-");
      }
    });

    // Hitung rata-rata
    const rataRata = countTest > 0 ? (totalNilai / countTest).toFixed(2) : "-";
    row.push(rataRata);

    dataForExport.push(row);
  });

  // Create workbook
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(dataForExport);

  // Style header
  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4472C4" } },
  };

  for (let col = 0; col < headers.length; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: col });
    if (!worksheet[cellRef]) worksheet[cellRef] = {};
    worksheet[cellRef].s = headerStyle;
  }

  XLSX.utils.book_append_sheet(workbook, worksheet, worksheetName);
  XLSX.writeFile(workbook, fileName);
};
