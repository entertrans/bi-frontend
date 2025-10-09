// src/utils/exportToExcel.js
import * as XLSX from "xlsx";

export const exportJawabanToExcel = (jawabanData, displayedNilai) => {
  if (!jawabanData) {
    throw new Error("Tidak ada data untuk diexport");
  }

  // Fungsi untuk membersihkan HTML
  const cleanHTML = (html) => {
    if (!html) return "";
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\n/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  // Fungsi untuk render jawaban dalam mode export
  const getJawabanForExport = (item) => {
    if (!item.jawaban_siswa) return "";
    
    try {
      const jawaban = JSON.parse(item.jawaban_siswa);
      
      if (Array.isArray(jawaban)) {
        return jawaban.map(j => cleanHTML(j)).join(', ');
      } else if (typeof jawaban === 'string') {
        return cleanHTML(jawaban);
      } else if (typeof jawaban === 'object' && jawaban !== null) {
        if (Array.isArray(jawaban)) {
          return jawaban.map(j => {
            if (j.jawaban) return j.jawaban;
            if (j.leftIndex !== undefined && j.rightIndex !== undefined) 
              return `${j.leftIndex + 1}=${j.rightIndex + 1}`;
            return JSON.stringify(j);
          }).join(', ');
        }
        return JSON.stringify(jawaban);
      }
      
      return String(jawaban);
    } catch (error) {
      return cleanHTML(String(item.jawaban_siswa));
    }
  };

  // Fungsi untuk render kunci dalam mode export
  const getKunciForExport = (item) => {
    if (!item.jawaban_benar) return "";
    
    try {
      const kunci = JSON.parse(item.jawaban_benar);
      
      if (Array.isArray(kunci)) {
        return kunci.map(k => cleanHTML(k)).join(', ');
      } else if (typeof kunci === 'string') {
        return cleanHTML(kunci);
      }
      
      return String(kunci);
    } catch (error) {
      return cleanHTML(String(item.jawaban_benar));
    }
  };

  // Data header
  const headerData = [
    ["Nama", jawabanData?.siswa?.nama || "Tidak diketahui"],
    ["Mata Pelajaran", jawabanData?.test?.mapel || "Tidak diketahui"],
    ["Judul Test", jawabanData?.test?.judul || "Tidak diketahui"],
    ["Nilai", displayedNilai.toFixed(2)],
    [""], // baris kosong
    ["No", "Tipe", "Pertanyaan", "Jawaban Siswa", "Kunci Jawaban", "Nilai", "Max Score"]
  ];

  // Data jawaban
  const jawabanRows = jawabanData.jawaban.map((item, index) => {
    const nilai = item.skor_uraian !== null ? item.skor_uraian : item.skor_objektif;
    
    return [
      index + 1,
      item.tipe_soal || "Unknown",
      cleanHTML(item.pertanyaan),
      getJawabanForExport(item),
      getKunciForExport(item),
      nilai,
      item.max_score
    ];
  });

  // Gabungkan semua data
  const exportData = [...headerData, ...jawabanRows];

  // Buat workbook dan worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(exportData);

  // Styling untuk kolom
  if (!ws['!cols']) ws['!cols'] = [];
  ws['!cols'] = [
    { wch: 5 },   // No
    { wch: 12 },  // Tipe
    { wch: 50 },  // Pertanyaan
    { wch: 30 },  // Jawaban Siswa
    { wch: 30 },  // Kunci Jawaban
    { wch: 8 },   // Nilai
    { wch: 10 }   // Max Score
  ];

  // Tambahkan worksheet ke workbook
  XLSX.utils.book_append_sheet(wb, ws, "Detail Jawaban");

  // Generate filename (bersihkan karakter tidak valid)
  const cleanName = (str) => {
    if (!str) return '';
    return str.replace(/[^\w\s.-]/gi, '').replace(/\s+/g, '_');
  };
  
  const fileName = `Jawaban_${cleanName(jawabanData?.siswa?.nama)}_${cleanName(jawabanData?.test?.judul)}.xlsx`;

  // Export ke file menggunakan XLSX.writeFile (tidak perlu file-saver)
  XLSX.writeFile(wb, fileName);

  return fileName;
};