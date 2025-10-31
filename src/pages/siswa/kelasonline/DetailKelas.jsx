// src/pages/siswa/DetailKelas.jsx
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  HiArrowLeft, 
  HiDownload, 
  HiExternalLink, 
  HiDocument,
  HiVideoCamera,
  HiAcademicCap,
  HiCalendar,
  HiUser
} from "react-icons/hi";
import { cardStyles } from "../../../utils/CardStyles";

// Data dummy yang lebih lengkap
const materiDummy = {
  1: {
    topik: "Trigonometri Dasar",
    tanggal: "2025-10-31",
    guru: "Pak Budi",
    deskripsi: "Memahami konsep dasar trigonometri, sinus, cosinus, dan tangen dalam segitiga siku-siku",
    materi: [
      { 
        id: 1, 
        judul: "Trigonometri Dasar", 
        tipe: "ppt", 
        format: "PPT",
        ukuran: "2.4 MB",
        link: "#"
      },
      { 
        id: 2, 
        judul: "Latihan Soal Trigonometri", 
        tipe: "pdf", 
        format: "PDF",
        ukuran: "1.8 MB",
        link: "#"
      },
      { 
        id: 3, 
        judul: "Video Pembelajaran Trigonometri", 
        tipe: "video", 
        format: "YouTube",
        durasi: "15:30",
        link: "https://youtube.com/watch?v=contoh"
      },
      { 
        id: 4, 
        judul: "Modul Belajar Mandiri", 
        tipe: "pdf", 
        format: "PDF",
        ukuran: "3.2 MB",
        link: "#"
      }
    ]
  },
  2: {
    topik: "Persamaan Kuadrat",
    tanggal: "2025-09-23",
    guru: "Pak Budi",
    deskripsi: "Menyelesaikan persamaan kuadrat dengan berbagai metode: faktorisasi, rumus ABC, dan melengkapkan kuadrat sempurna",
    materi: [
      { 
        id: 1, 
        judul: "Materi Persamaan Kuadrat", 
        tipe: "ppt", 
        format: "PPT",
        ukuran: "1.9 MB",
        link: "#"
      },
      { 
        id: 2, 
        judul: "Video Pembahasan Soal", 
        tipe: "video", 
        format: "Google Drive",
        durasi: "22:15",
        link: "https://drive.google.com/file/contoh"
      }
    ]
  },
  3: {
    topik: "Geometri Bangun Datar",
    tanggal: "2025-09-09",
    guru: "Pak Budi",
    deskripsi: "Mempelajari sifat-sifat bangun datar dan perhitungan luas serta keliling berbagai bentuk geometri",
    materi: [
      { 
        id: 1, 
        judul: "Slide Presentasi Geometri", 
        tipe: "ppt", 
        format: "PPT",
        ukuran: "3.1 MB",
        link: "#"
      },
      { 
        id: 2, 
        judul: "Lembar Kerja Siswa", 
        tipe: "pdf", 
        format: "PDF",
        ukuran: "2.1 MB",
        link: "#"
      },
      { 
        id: 3, 
        judul: "Simulasi Interaktif", 
        tipe: "link", 
        format: "Website",
        link: "https://geogebra.org/contoh"
      }
    ]
  }
};

const getIconByType = (tipe) => {
  switch (tipe) {
    case 'ppt':
      return <HiDocument className="text-red-500 text-xl" />;
    case 'pdf':
      return <HiDocument className="text-red-600 text-xl" />;
    case 'video':
      return <HiVideoCamera className="text-purple-500 text-xl" />;
    case 'link':
      return <HiExternalLink className="text-blue-500 text-xl" />;
    default:
      return <HiDocument className="text-gray-500 text-xl" />;
  }
};

const getTypeBadge = (tipe) => {
  const typeStyles = {
    ppt: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200",
    pdf: "bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200",
    video: "bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200",
    link: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
  };
  
  return typeStyles[tipe] || "bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200";
};

const getActionButton = (materi) => {
  if (materi.tipe === 'link') {
    return (
      <a
        href={materi.link}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium"
      >
        <HiExternalLink className="text-sm" />
        Buka Link
      </a>
    );
  }
  
  return (
    <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 text-sm font-medium">
      <HiDownload className="text-sm" />
      Unduh
    </button>
  );
};

function DetailKelas() {
  const navigate = useNavigate();
  const { mapel, id } = useParams();
  const kelasData = materiDummy[id];
  const materi = kelasData?.materi || [];

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (!kelasData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors duration-300 font-medium"
        >
          <HiArrowLeft className="text-lg" />
          Kembali
        </button>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Kelas Tidak Ditemukan
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Materi untuk sesi ini tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors duration-300 font-medium"
        >
          <HiArrowLeft className="text-lg" />
          Kembali ke Daftar Kelas
        </button>

        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
            <HiAcademicCap className="text-2xl text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              {kelasData.topik}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              {mapel} - Pertemuan {id}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {kelasData.deskripsi}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <div className="flex items-center gap-3">
              <HiUser className="text-blue-500 text-xl" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pengajar</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{kelasData.guru}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 border-green-500">
            <div className="flex items-center gap-3">
              <HiCalendar className="text-green-500 text-xl" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Tanggal</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{formatTanggal(kelasData.tanggal)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <HiDocument className="text-purple-500 text-xl" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Materi</p>
                <p className="font-semibold text-gray-800 dark:text-gray-100">{materi.length} File</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <HiDocument className="text-indigo-500" />
          Materi Pembelajaran
        </h2>
        
        {materi.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Belum ada materi
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Materi untuk sesi ini akan segera tersedia.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {materi.map((m) => (
              <div
                key={m.id}
                className={`${cardStyles.base} ${cardStyles.blue.container} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                    {getIconByType(m.tipe)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <h3 className="font-semibold text-gray-800 dark:text-gray-100 text-lg break-words">
                        {m.judul}
                      </h3>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(m.tipe)} whitespace-nowrap flex-shrink-0`}>
                        {m.format}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {m.ukuran && (
                        <p>Ukuran: {m.ukuran}</p>
                      )}
                      {m.durasi && (
                        <p>Durasi: {m.durasi}</p>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      {getActionButton(m)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Additional Resources */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
          <HiExternalLink className="text-blue-600 dark:text-blue-400" />
          Tips Belajar
        </h3>
        <ul className="text-blue-700 dark:text-blue-300 text-sm space-y-1">
          <li>• Download materi sebelum belajar untuk akses offline</li>
          <li>• Siapkan catatan untuk mencatat poin penting</li>
          <li>• Kerjakan latihan soal untuk menguji pemahaman</li>
          <li>• Gunakan video pembelajaran untuk visualisasi konsep</li>
        </ul>
      </div>
    </div>
  );
}

export default DetailKelas;