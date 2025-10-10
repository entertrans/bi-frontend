// src/utils/exportToExcel.js
import * as XLSX from "xlsx";

export const exportJawabanToExcel = (jawabanData, displayedNilai) => {
  if (!jawabanData) {
    throw new Error("Tidak ada data untuk diexport");
  }

  // Fungsi untuk membersihkan HTML
  // Fungsi untuk membersihkan HTML - PERBAIKI INI
const cleanHTML = (html) => {
  if (!html) return "";
  // Convert ke string dulu
  const htmlString = String(html);
  
  // Gunakan method yang lebih robust
  return htmlString
    .replace(/<br\s*\/?>/gi, '\n') // <br> jadi newline
    .replace(/<p[^>]*>/gi, '') // <p> dihapus
    .replace(/<\/p>/gi, '\n') // </p> jadi newline  
    .replace(/<[^>]*>/g, '') // hapus semua tag HTML lainnya
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n+/g, ' ') // multiple newline jadi spasi
    .replace(/\s+/g, ' ') // multiple space jadi satu
    .trim();
};

  // Fungsi untuk render jawaban dalam mode export
  const getJawabanForExport = (item) => {
    if (!item.jawaban_siswa) return "Tidak dijawab";
    
    try {
      let jawaban;
      try {
        jawaban = JSON.parse(item.jawaban_siswa);
      } catch {
        jawaban = item.jawaban_siswa;
      }

      let pilihan = [];
      try {
        pilihan = JSON.parse(item.pilihan_jawaban || "[]");
      } catch {
        pilihan = [];
      }

      // Handle berdasarkan tipe soal
      switch (item.tipe_soal) {
        case "pg":
  if (Array.isArray(jawaban) && jawaban.length > 0) {
    const val = jawaban[0];
    // Kembalikan ke cara lama yang berhasil
    return cleanHTML(String(val));
  }
  return "Tidak dijawab";

        case "pg_kompleks":
  if (Array.isArray(jawaban) && jawaban.length > 0) {
    // Kembalikan ke cara lama yang berhasil
    return jawaban.map(val => cleanHTML(String(val))).join('|');
  }
  return "Tidak dijawab";

        case "bs":
          if (Array.isArray(jawaban) && jawaban.length > 0) {
            // Urutkan berdasarkan index
            const sortedJawaban = [...jawaban].sort((a, b) => a.index - b.index);
            return sortedJawaban.map(ans => {
              return `[${ans.jawaban === "benar" ? "BENAR" : "SALAH"}]`;
            }).join('|');
          }
          return "Tidak dijawab";

        case "matching":
          if (Array.isArray(jawaban) && jawaban.length > 0) {
            // Parse kunci untuk urutan yang benar
            let kunciMatching = [];
            try {
              kunciMatching = JSON.parse(item.jawaban_benar || "[]");
            } catch {
              kunciMatching = [];
            }

            // Urutkan berdasarkan kunci
            const hasilDiurutkan = [];
            kunciMatching.forEach((kunciItem) => {
              const jawabanSiswa = jawaban.find(j => j.leftIndex === kunciItem.leftIndex);
              if (jawabanSiswa) {
                const leftItem = pilihan[kunciItem.leftIndex];
                const rightItem = pilihan[jawabanSiswa.rightIndex];
                hasilDiurutkan.push({
                  left: cleanHTML(leftItem?.left || ""),
                  right: cleanHTML(rightItem?.right || "")
                });
              }
            });

            return hasilDiurutkan.map(pair => 
              `${pair.left} → ${pair.right}`
            ).join('|');
          }
          return "Tidak dijawab";

        case "uraian":
        case "isian_singkat":
          return cleanHTML(String(jawaban));

        default:
          if (Array.isArray(jawaban)) {
            return jawaban.map(j => cleanHTML(String(j))).join('|');
          }
          return cleanHTML(String(jawaban));
      }
    } catch (error) {
      console.error("Error processing jawaban for export:", error, item);
      return "Error parsing jawaban";
    }
  };

  // Fungsi untuk render kunci dalam mode export
  const getKunciForExport = (item) => {
    if (!item.jawaban_benar) return "Tidak tersedia";
    
    try {
      let kunci;
      try {
        kunci = JSON.parse(item.jawaban_benar);
      } catch {
        kunci = item.jawaban_benar;
      }

      let pilihan = [];
      try {
        pilihan = JSON.parse(item.pilihan_jawaban || "[]");
      } catch {
        pilihan = [];
      }

      // Handle berdasarkan tipe soal
      switch (item.tipe_soal) {
        case "pg":
          if (Array.isArray(kunci) && kunci.length > 0) {
            const idx = parseInt(kunci[0]);
            if (!isNaN(idx) && pilihan[idx]) {
              return cleanHTML(pilihan[idx]);
            }
            return kunci[0];
          }
          return "Tidak tersedia";

        case "pg_kompleks":
          if (Array.isArray(kunci) && kunci.length > 0) {
            return kunci.map(idx => {
              const parsedIdx = parseInt(idx);
              if (!isNaN(parsedIdx) && pilihan[parsedIdx]) {
                return cleanHTML(pilihan[parsedIdx]);
              }
              return idx;
            }).join('|');
          }
          return "Tidak tersedia";

        case "bs":
          if (Array.isArray(kunci) && kunci.length > 0) {
            return kunci.map(val => {
              return `[${val === "benar" ? "BENAR" : "SALAH"}]`;
            }).join('|');
          }
          return "Tidak tersedia";

        case "matching":
          if (Array.isArray(kunci) && kunci.length > 0) {
            return kunci.map(pair => 
              `${cleanHTML(pair.left || "")} → ${cleanHTML(pair.right || "")}`
            ).join('|');
          }
          return "Tidak tersedia";

        case "uraian":
        case "isian_singkat":
          return "Tidak tersedia";

        default:
          if (Array.isArray(kunci)) {
            return kunci.map(k => cleanHTML(String(k))).join('|');
          }
          return cleanHTML(String(kunci));
      }
    } catch (error) {
      console.error("Error processing kunci for export:", error, item);
      return "Error parsing kunci";
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
    { wch: 40 },  // Jawaban Siswa
    { wch: 40 },  // Kunci Jawaban
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