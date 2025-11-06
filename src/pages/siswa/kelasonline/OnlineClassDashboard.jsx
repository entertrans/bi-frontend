// src/pages/siswa/OnlineClassDashboard.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  HiCalendar,
  HiClock,
  HiUser,
  HiPlay,
  HiAcademicCap,
} from "react-icons/hi";
import { cardStyles, statusConfig } from "../../../utils/CardStyles";
import { getKelasOnlineByKelasId } from "../../../api/siswaAPI"; // ✅ import API

function OnlineClassDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (user && user.siswa && user.siswa.siswa_kelas_id) {
      const kelasId = user.siswa.siswa_kelas_id;
      // console.log("Ambil kelas online untuk kelas_id:", kelasId);

      getKelasOnlineByKelasId(kelasId)
        .then((data) => {
          // console.log("Data kelas online:", data);
          setClasses(data);
        })
        .catch((error) => {
          console.error("Gagal fetch kelas online:", error);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);


  const formatTanggal = (tanggal) => {
    if (!tanggal || tanggal === "-" || tanggal === "0001-01-01") {
      return "-";
    }

    const dateObj = new Date(tanggal);
    if (isNaN(dateObj.getTime())) {
      return "-";
    }

    return dateObj.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatWaktu = (mulai, selesai) => {
    if (
      !mulai ||
      !selesai ||
      mulai === "-" ||
      selesai === "-" ||
      mulai === "" ||
      selesai === ""
    ) {
      return "-";
    }
    return `${mulai} - ${selesai}`;
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.selesai;
    return (
      <span
        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          cardStyles[config.color].badge
        }`}
      >
        <span className="mr-1">{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getCardStyle = (status) => {
    const config = statusConfig[status] || statusConfig.selesai;
    return cardStyles[config.color];
  };

  const filteredClasses = classes.filter(
    (kelas) => filter === "semua" || kelas.status === filter
  );

  const filterButtons = [
    { key: "semua", label: "Semua Kelas", icon: "📚" },
    { key: "sedang", label: "Sedang Berlangsung", icon: "🟢" },
    { key: "belum", label: "Akan Datang", icon: "⏰" },
    { key: "selesai", label: "Selesai", icon: "✅" },
  ];
 
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600 dark:text-gray-300 text-lg">
          Memuat data kelas...
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <HiAcademicCap className="text-3xl text-indigo-600 dark:text-indigo-400" />
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
            Kelas Online
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Kelola dan ikuti kelas online dengan mudah
        </p>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3 mb-8">
        {filterButtons.map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              filter === key
                ? `bg-indigo-600 text-white shadow-md`
                : `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700`
            }`}
          >
            <span>{icon}</span>
            {label}
          </button>
        ))}
      </div>

      {/* Classes Grid */}
      {filteredClasses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Tidak ada kelas
          </h3>
          <p className="text-gray-500 dark:text-gray-500">
            Tidak ada kelas dengan status "
            {filterButtons.find((f) => f.key === filter)?.label.toLowerCase()}"
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClasses.map((kelas) => {
            const style = getCardStyle(kelas.status);
//  console.log("Kode Mapel:", kelas.id);
            return (
              <div
                key={kelas.id}
                className={`${cardStyles.base} ${style.container} hover:scale-105 transition-transform duration-300`}
              >
                <div className="flex-1">
                  {/* Header dengan mapel dan status */}
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 line-clamp-1">
                      {kelas.mapel}
                    </h2>
                    {getStatusBadge(kelas.status)}
                  </div>

                  {/* Informasi guru */}
                  <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
                    <HiUser className="text-blue-500 flex-shrink-0" />
                    <span className="text-sm">{kelas.guru}</span>
                  </div>

                  {/* Informasi tanggal */}
                  <div className="flex items-center gap-2 mb-3 text-gray-600 dark:text-gray-400">
                    <HiCalendar className="text-green-500 flex-shrink-0" />
                    <span className="text-sm">
                      {formatTanggal(kelas.tanggal)}
                    </span>
                  </div>

                  {/* Informasi waktu */}
                  <div className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
                    <HiClock className="text-purple-500 flex-shrink-0" />
                    <span className="text-sm">
                      {formatWaktu(kelas.mulai, kelas.selesai)}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 flex gap-2">
                  {kelas.status === "sedang" ? (
                    <a
                      href={kelas.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 font-medium"
                    >
                      <HiPlay className="text-lg" />
                      Join Kelas
                    </a>
                  ) : (
                    <button
                      className="flex-1 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg cursor-not-allowed font-medium"
                      disabled
                    >
                      {kelas.status === "belum" ? "Belum Dimulai" : "Selesai"}
                    </button>
                  )}

                  <button
                    onClick={() =>
                      navigate(
                        `/siswa/online/kelas/${encodeURIComponent(
                          kelas.mapel
                        )}`,
                        {
                          state: {
                            id_kelas: kelas.id,
                            // kelasData: kelas, // atau kirim seluruh data kelas
                          },
                        }
                      )
                    }
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-300 font-medium"
                  >
                    Detail Kelas
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default OnlineClassDashboard;
