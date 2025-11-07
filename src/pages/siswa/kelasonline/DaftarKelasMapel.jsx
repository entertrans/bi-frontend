// src/pages/siswa/DaftarKelasMapel.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import {
  formatTanggalLengkap
} from "../../../utils/format";
import {
  HiCalendar,
  HiClock,
  HiUser,
  HiPlay,
  HiArrowLeft,
  HiAcademicCap,
  HiBookOpen,
} from "react-icons/hi";
import {
  cardStyles,
  statusConfig,
} from "../../../utils/CardStyles";
import { getDetailKelasOnline } from "../../../api/siswaAPI";

function DaftarKelasMapel() {
  const { mapel } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState("semua");
  const [loading, setLoading] = useState(true);
  const id_kelas = state?.id_kelas;

  useEffect(() => {
    if (!id_kelas) return setLoading(false);

    const fetchData = async () => {
      try {
        const data = await getDetailKelasOnline(id_kelas);
        const mapped = data.map((item) => ({
          id: item.id_kelas_online,
          mapel: item.nama_mapel,
          guru: item.nama_guru || "Guru belum ditentukan",
          tanggal: item.tanggal,
          mulai: item.jam_mulai?.slice(0, 5) || "-",
          selesai: item.jam_selesai?.slice(0, 5) || "-",
          status: mapStatus(item.status),
          link: item.link_kelas,
          topik: item.judul_kelas || "Topik belum tersedia"
        }));
        setSessions(mapped);
      } catch (err) {
        console.error("Gagal fetch detail kelas online:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id_kelas]);

  /** 🔹 Helper Functions */
  const mapStatus = (status) =>
    ({
      sedang_berlangsung: "sedang",
      selesai: "selesai",
      akan_datang: "belum",
      belum_dimulai: "belum",
    }[status] || "selesai");

  const formatWaktu = (mulai, selesai) =>
    !mulai || !selesai || [mulai, selesai].includes("-") ? "-" : `${mulai} - ${selesai}`;

  const getStatusBadge = (status) => {
    const { color, icon, text } = statusConfig[status] || statusConfig.selesai;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${cardStyles[color].badge}`}>
        <span className="mr-1 text-xs">{icon}</span>{text}
      </span>
    );
  };

  const getCardStyle = (status) =>
    cardStyles[statusConfig[status]?.color || "selesai"];

  const filterButtons = [
    { key: "semua", label: "Semua Sesi", icon: "📚" },
    { key: "sedang", label: "Berlangsung", icon: "🟢" },
    { key: "belum", label: "Akan Datang", icon: "⏰" },
    { key: "selesai", label: "Selesai", icon: "✅" },
  ];

  const filteredSessions =
    filter === "semua"
      ? sessions
      : sessions.filter((s) => s.status === filter);

  /** 🔹 Loading UI */
  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex justify-center items-center">
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          Memuat data sesi kelas...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 font-medium transition"
        >
          <HiArrowLeft /> Kembali ke Dashboard
        </button>

        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900 rounded-xl">
            <HiAcademicCap className="text-2xl text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{mapel}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {sessions.length
                ? `Kelas online dengan ${sessions.length} sesi pembelajaran`
                : "Belum ada sesi pembelajaran"}
            </p>
          </div>
        </div>
      </div>

      {/* Session List */}
      {filteredSessions.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
            Tidak ada sesi kelas
          </h3>
          <p className="text-gray-500 mb-4">
            {sessions.length === 0
              ? "Belum ada sesi pembelajaran untuk mata pelajaran ini"
              : `Tidak ada sesi dengan status "${
                  filterButtons.find((f) => f.key === filter)?.label.toLowerCase()
                }"`}
          </p>
          {sessions.length > 0 && (
            <button
              onClick={() => setFilter("semua")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
            >
              Lihat Semua Sesi
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredSessions.map((sesi) => {
            const style = getCardStyle(sesi.status);
            return (
              <div
                key={sesi.id}
                className={`${cardStyles.base} ${style.container} hover:shadow-lg transition`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between mb-3 gap-2">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                          {sesi.topik}
                        </h3>
                      </div>
                      {getStatusBadge(sesi.status)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-2">
                        <HiCalendar className="text-green-500" />
                        <span>{formatTanggalLengkap(sesi.tanggal)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiClock className="text-purple-500" />
                        <span>{formatWaktu(sesi.mulai, sesi.selesai)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <HiUser className="text-blue-500" />
                        <span>{sesi.guru}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0">
                    {sesi.status === "sedang" ? (
                      <a
                        href={sesi.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium"
                      >
                        <HiPlay /> Join Kelas
                      </a>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(`/siswa/online/kelas/${mapel}/${sesi.id}`, {
                            state: { sesiData: sesi, id_kelas_mapel: id_kelas },
                          })
                        }
                        className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium"
                      >
                        <HiBookOpen />
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
