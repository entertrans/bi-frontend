// src/pages/siswa/OnlineClassDashboard.jsx
import React, { useState } from "react";
import {
  HiCalendar,
  HiClock,
  HiUser,
  HiPlay,
  HiCheckCircle,
  HiClock as HiTime,
} from "react-icons/hi";
import { cardStyles, statusConfig, filterButtonStyles } from "../../../utils/CardStyles";

const mockData = [
  {
    id: 1,
    mapel: "Matematika",
    guru: "Pak Budi",
    tanggal: "2025-09-19",
    mulai: "08:00",
    selesai: "09:00",
    status: "sedang",
    link: "https://meet.google.com/abc",
  },
  {
    id: 2,
    mapel: "Bahasa Inggris",
    guru: "Bu Sari",
    tanggal: "2025-09-19",
    mulai: "10:00",
    selesai: "11:30",
    status: "belum",
    link: "https://meet.google.com/xyz",
  },
  {
    id: 3,
    mapel: "IPA",
    guru: "Pak Andi",
    tanggal: "2025-09-19",
    mulai: "13:00",
    selesai: "14:00",
    status: "selesai",
    link: "https://meet.google.com/def",
  },
  {
    id: 4,
    mapel: "Fisika",
    guru: "Bu Dewi",
    tanggal: "2025-09-19",
    mulai: "15:00",
    selesai: "16:30",
    status: "belum",
    link: "https://meet.google.com/ghi",
  },
];

// Komponen Kelas Card yang reusable
const KelasCard = ({ kelas }) => {
  const config = statusConfig[kelas.status];
  const style = cardStyles[config.color];

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className={`${cardStyles.base} ${style.container}`}>
      {/* Status Badge */}
      <div className="mb-4">
        <span className={`px-3 py-1.5 text-xs rounded-full font-semibold ${style.badge}`}>
          {config.icon} {config.text}
        </span>
      </div>

      {/* Class Info */}
      <div className="flex-1 mb-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
          {kelas.mapel}
        </h2>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <HiUser className="w-4 h-4 mr-2 text-blue-500" />
            <span>{kelas.guru}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <HiCalendar className="w-4 h-4 mr-2 text-green-500" />
            <span>{formatTanggal(kelas.tanggal)}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <HiClock className="w-4 h-4 mr-2 text-purple-500" />
            <span>
              {kelas.mulai} - {kelas.selesai}
            </span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        {kelas.status === "sedang" && (
          <a
            href={kelas.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full ${style.button} px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center`}
          >
            <HiPlay className="w-5 h-5 mr-2" />
            Join Kelas Sekarang
          </a>
        )}

        {kelas.status === "belum" && (
          <div className="space-y-2">
            <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
              <HiTime className="w-4 h-4 mr-1" />
              <span>Kelas akan dimulai sebentar lagi</span>
            </div>
          </div>
        )}

        {kelas.status === "selesai" && (
          <div className="text-center">
            <HiCheckCircle className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kelas telah selesai
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Komponen Empty State
const EmptyState = ({ filter }) => (
  <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col items-center justify-center text-center mt-12">
    <div className="text-4xl mb-3">📭</div>
    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
      Tidak ada kelas{" "}
      {filter !== "semua" ? `dengan status ${filter}` : "hari ini"}
    </h3>
    <p className="text-gray-600 dark:text-gray-400 text-sm">
      Silakan cek jadwal untuk hari lainnya atau pilih filter berbeda.
    </p>
  </div>
);

// Komponen Filter Buttons
const FilterButtons = ({ filter, setFilter, classes }) => {
  const filterOptions = [
    { key: "semua", label: `Semua (${classes.length})` },
    { 
      key: "sedang", 
      label: `Sedang Berlangsung (${classes.filter((c) => c.status === "sedang").length})` 
    },
    { 
      key: "belum", 
      label: `Belum Dimulai (${classes.filter((c) => c.status === "belum").length})` 
    },
    { 
      key: "selesai", 
      label: `Selesai (${classes.filter((c) => c.status === "selesai").length})` 
    },
  ];

  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {filterOptions.map((option) => (
        <button
          key={option.key}
          onClick={() => setFilter(option.key)}
          className={`${filterButtonStyles.base} ${
            filter === option.key 
              ? filterButtonStyles.active[option.key] 
              : filterButtonStyles.inactive
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

function OnlineClassDashboard() {
  const [classes] = useState(mockData);
  const [filter, setFilter] = useState("semua");

  const filteredClasses =
    filter === "semua"
      ? classes
      : classes.filter((cls) => cls.status === filter);

  const formatTanggal = (tanggal) => {
    return new Date(tanggal).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 transition-colors">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          📚 Jadwal Kelas Online
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Kelas online untuk hari {formatTanggal(new Date())}
        </p>
      </div>

      {/* Filter Buttons */}
      <FilterButtons 
        filter={filter} 
        setFilter={setFilter} 
        classes={classes} 
      />

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClasses.map((kelas) => (
          <KelasCard key={kelas.id} kelas={kelas} />
        ))}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && <EmptyState filter={filter} />}
    </div>
  );
}

export default OnlineClassDashboard;