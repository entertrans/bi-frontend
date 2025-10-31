// src/pages/siswa/DaftarKelasMapel.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  HiCalendar, 
  HiClock, 
  HiUser, 
  HiPlay, 
  HiArrowLeft,
  HiAcademicCap,
  HiBookOpen
} from "react-icons/hi";
import { cardStyles, statusConfig, filterButtonStyles } from "../../../utils/CardStyles";

const sesiDummy = [
  {
    id: 1,
    mapel: "Matematika",
    guru: "Pak Budi",
    tanggal: "2025-09-09",
    mulai: "08:00",
    selesai: "09:00",
    status: "selesai",
    topik: "Aljabar Dasar",
    deskripsi: "Memahami konsep dasar aljabar dan persamaan linear"
  },
  {
    id: 2,
    mapel: "Matematika",
    guru: "Pak Budi",
    tanggal: "2025-09-23",
    mulai: "08:00",
    selesai: "09:00",
    status: "selesai",
    topik: "Geometri Bangun Datar",
    deskripsi: "Mempelajari sifat-sifat bangun datar dan perhitungan luas"
  },
  {
    id: 3,
    mapel: "Matematika",
    guru: "Pak Budi",
    tanggal: "2025-10-31",
    mulai: "08:00",
    selesai: "09:00",
    status: "sedang",
    link: "https://meet.google.com/abc",
    topik: "Trigonometri",
    deskripsi: "Konsep sinus, cosinus, dan tangen dalam segitiga"
  },
  {
    id: 4,
    mapel: "Matematika",
    guru: "Pak Budi",
    tanggal: "2025-11-15",
    mulai: "08:00",
    selesai: "09:00",
    status: "belum",
    topik: "Statistika",
    deskripsi: "Pengolahan data dan interpretasi hasil statistik"
  },
];

function DaftarKelasMapel() {
  const navigate = useNavigate();
  const { mapel } = useParams();
  const [filter, setFilter] = useState("semua");
  
  const sessions = sesiDummy.filter((s) => s.mapel === mapel);
  const filteredSessions = sessions.filter(sesi => 
    filter === "semua" || sesi.status === filter
  );

  const formatTanggal = (tanggal) =>
    new Date(tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const formatWaktu = (mulai, selesai) => {
    return `${mulai} - ${selesai}`;
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.selesai;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cardStyles[config.color].badge}`}>
        <span className="mr-1 text-xs">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getCardStyle = (status) => {
    const config = statusConfig[status] || statusConfig.selesai;
    return cardStyles[config.color];
  };

  const filterButtons = [
    { key: "semua", label: "Semua Sesi", icon: "📚" },
    { key: "sedang", label: "Berlangsung", icon: "🟢" },
    { key: "belum", label: "Akan Datang", icon: "⏰" },
    { key: "selesai", label: "Selesai", icon: "✅" },
  ];

  const getSessionStats = () => {
    return {
      total: sessions.length,
      sedang: sessions.filter(s => s.status === "sedang").length,
      belum: sessions.filter(s => s.status === "belum").length,
      selesai: sessions.filter(s => s.status === "selesai").length,
    };
  };

  const stats = getSessionStats();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header Section */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors duration-300 font-medium"
        >
          <HiArrowLeft className="text-lg" />
          Kembali ke Dashboard
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
            <HiAcademicCap className="text-2xl text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              {mapel}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Kelas online dengan {sessions.length} sesi pembelajaran
            </p>
          </div>
        </div>
      </div>


      {/* Sessions List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Tidak ada sesi kelas
          </h3>
          <p className="text-gray-500 dark:text-gray-500 mb-4">
            Tidak ada sesi dengan status "{filterButtons.find(f => f.key === filter)?.label.toLowerCase()}"
          </p>
          <button
            onClick={() => setFilter("semua")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300"
          >
            Lihat Semua Sesi
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((sesi) => {
            const style = getCardStyle(sesi.status);
            
            return (
              <div
                key={sesi.id}
                className={`${cardStyles.base} ${style.container} hover:shadow-lg transition-all duration-300`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Session Info */}
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                          {sesi.topik}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {sesi.deskripsi}
                        </p>
                      </div>
                      {getStatusBadge(sesi.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <HiCalendar className="text-green-500 flex-shrink-0" />
                        <span>{formatTanggal(sesi.tanggal)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <HiClock className="text-purple-500 flex-shrink-0" />
                        <span>{formatWaktu(sesi.mulai, sesi.selesai)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <HiUser className="text-blue-500 flex-shrink-0" />
                        <span>{sesi.guru}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex-shrink-0">
                    {sesi.status === "sedang" ? (
                      <a
                        href={sesi.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium whitespace-nowrap"
                      >
                        <HiPlay className="text-lg" />
                        Join Kelas
                      </a>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/siswa/online/kelas/${mapel}/${sesi.id}`)
                        }
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-300 font-medium whitespace-nowrap"
                      >
                        <HiBookOpen className="text-lg" />
                        {sesi.status === "belum" ? "Detail Sesi" : "Lihat Materi"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DaftarKelasMapel;