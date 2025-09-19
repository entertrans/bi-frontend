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

const statusConfig = {
  sedang: {
    style: "bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500",
    badge: "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200",
    icon: "🟢",
    text: "Sedang Berlangsung",
  },
  belum: {
    style: "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500",
    badge: "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200",
    icon: "⏰",
    text: "Belum Dimulai",
  },
  selesai: {
    style: "bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-400",
    badge: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
    icon: "✅",
    text: "Selesai",
  },
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
      <div className="mb-6 flex flex-wrap gap-2">
        {["semua", "sedang", "belum", "selesai"].map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === key
                ? key === "sedang"
                  ? "bg-green-600 text-white"
                  : key === "belum"
                  ? "bg-blue-600 text-white"
                  : key === "selesai"
                  ? "bg-gray-600 text-white"
                  : "bg-indigo-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            {key === "semua"
              ? `Semua (${classes.length})`
              : key === "sedang"
              ? `Sedang Berlangsung (${
                  classes.filter((c) => c.status === "sedang").length
                })`
              : key === "belum"
              ? `Belum Dimulai (${
                  classes.filter((c) => c.status === "belum").length
                })`
              : `Selesai (${
                  classes.filter((c) => c.status === "selesai").length
                })`}
          </button>
        ))}
      </div>

      {/* Class Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredClasses.map((cls) => {
          const status = statusConfig[cls.status];

          return (
            <div
              key={cls.id}
              className={`rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between ${status.style}`}
            >
              {/* Status Badge */}
              <div className="mb-4">
                <span
                  className={`px-3 py-1.5 text-xs rounded-full font-semibold ${status.badge}`}
                >
                  {status.icon} {status.text}
                </span>
              </div>

              {/* Class Info */}
              <div className="flex-1 mb-4">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">
                  {cls.mapel}
                </h2>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <HiUser className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{cls.guru}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <HiCalendar className="w-4 h-4 mr-2 text-green-500" />
                    <span>{formatTanggal(cls.tanggal)}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <HiClock className="w-4 h-4 mr-2 text-purple-500" />
                    <span>
                      {cls.mulai} - {cls.selesai}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                {cls.status === "sedang" && (
                  <a
                    href={cls.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center"
                  >
                    <HiPlay className="w-5 h-5 mr-2" />
                    Join Kelas Sekarang
                  </a>
                )}

                {cls.status === "belum" && (
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                      <HiTime className="w-4 h-4 mr-1" />
                      <span>Kelas akan dimulai sebentar lagi</span>
                    </div>
                  </div>
                )}

                {cls.status === "selesai" && (
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
        })}
      </div>

      {/* Empty State */}
      {filteredClasses.length === 0 && (
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
      )}
    </div>
  );
}

export default OnlineClassDashboard;
