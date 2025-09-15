import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { getAllBankSoal, deleteSoal } from "../../../api/bankSoalAPI";
import { fetchDetailKelasMapel } from "../../../api/siswaAPI";
import {
  HiPencil,
  HiTrash,
  HiPlus,
  HiPlay,
  HiPause,
  HiVolumeUp,
} from "react-icons/hi";
import SlideTambahBankSoal from "./SlideTambahBankSoal";
import Swal from "sweetalert2";
import { showAlert } from "../../../utils/toast";

const DetailBankSoal = () => {
  const { kelas, mapel } = useParams();
  const [dataSoal, setDataSoal] = useState([]);
  const [showTambahSoal, setShowTambahSoal] = useState(false);
  const [kelasInfo, setKelasInfo] = useState(null);
  const [mapelInfo, setMapelInfo] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [durations, setDurations] = useState({});
  const [currentTimes, setCurrentTimes] = useState({});
  const playerRefs = useRef({});

  const fetchLookup = async () => {
    try {
      const res = await fetchDetailKelasMapel(kelas, mapel);
      setKelasInfo(res.data.kelas);
      setMapelInfo(res.data.mapel);
    } catch (err) {
      console.error("Gagal ambil detail kelas/mapel:", err);
    }
  };

  const fetchData = async () => {
    try {
      const data = await getAllBankSoal(kelas, mapel);
      setDataSoal(data);
    } catch (err) {
      console.error("Gagal ambil data bank soal:", err);
    }
  };

  useEffect(() => {
    fetchLookup();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kelas, mapel]);

  const handleDelete = (soalID) => {
    Swal.fire({
      title: "Hapus Soal?",
      text: "Soal akan dihapus permanen dari bank soal.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteSoal(soalID);
          setDataSoal((prev) => prev.filter((s) => s.soal_id !== soalID));
          showAlert("Soal berhasil dihapus.", "success");
        } catch (err) {
          console.error(err);
          showAlert("Gagal menghapus soal.", "error");
        }
      }
    });
  };

  const toggleAudio = (soalId) => {
    if (playingAudio === soalId) {
      // Stop audio yang sedang diputar
      if (playerRefs.current[soalId]) {
        playerRefs.current[soalId].pause();
      }
      setPlayingAudio(null);
    } else {
      // Stop semua audio lainnya
      Object.keys(playerRefs.current).forEach((id) => {
        if (playerRefs.current[id] && id !== soalId) {
          playerRefs.current[id].pause();
        }
      });

      // Play audio baru
      setPlayingAudio(soalId);
      setTimeout(() => {
        if (playerRefs.current[soalId]) {
          playerRefs.current[soalId].play().catch((err) => {
            console.error("Gagal memutar audio:", err);
            showAlert("Tidak dapat memutar audio", "error");
          });
        }
      }, 100);
    }
  };

  const handleTimeUpdate = (soalId, e) => {
    setCurrentTimes((prev) => ({
      ...prev,
      [soalId]: e.target.currentTime,
    }));
  };

  const handleLoadedMetadata = (soalId, e) => {
    setDurations((prev) => ({
      ...prev,
      [soalId]: e.target.duration,
    }));
  };

  const handleSeek = (soalId, e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * durations[soalId];

    if (playerRefs.current[soalId]) {
      playerRefs.current[soalId].currentTime = newTime;
      setCurrentTimes((prev) => ({
        ...prev,
        [soalId]: newTime,
      }));
    }
  };

  // Fungsi untuk mendapatkan path file yang benar
  const getFilePath = (path) => {
    if (!path) return null;
    const correctedPath = path.replace(/\\/g, "/");
    return `http://localhost:8080/${correctedPath}`;
  };

  // Format durasi audio
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Detail Bank Soal - {kelasInfo?.nm_kelas || `Kelas ${kelas}`} |{" "}
          {mapelInfo?.nm_mapel || `Mapel ${mapel}`}
        </h1>
        <button
          onClick={() => setShowTambahSoal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <HiPlus className="text-lg" />
          Tambah Soal
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Kelas</th>
              <th className="px-6 py-3 text-left">Mapel</th>
              <th className="px-6 py-3 text-left">Pembuat</th>
              <th className="px-6 py-3 text-left">Tipe Soal</th>
              <th className="px-6 py-3 text-left">Pertanyaan</th>
              <th className="px-6 py-3 text-left">Lampiran</th>
              <th className="px-6 py-3 text-left">Bobot</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {dataSoal.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Belum ada soal untuk kelas & mapel ini.
                </td>
              </tr>
            )}

            {dataSoal.map((soal) => {
              const audioUrl =
                soal.lampiran && soal.lampiran.tipe_file === "audio"
                  ? getFilePath(soal.lampiran.path_file)
                  : null;

              const progressPercent = durations[soal.soal_id]
                ? (currentTimes[soal.soal_id] / durations[soal.soal_id]) * 100
                : 0;

              return (
                <tr key={soal.soal_id}>
                  <td className="px-6 py-4">{soal.kelas.kelas_nama}</td>
                  <td className="px-6 py-4">{soal.mapel.nm_mapel}</td>
                  <td className="px-6 py-4">{soal.guru.guru_nama}</td>
                  <td className="px-6 py-4">{soal.tipe_soal}</td>
                  <td
                    className="px-6 py-4 truncate max-w-xs"
                    dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
                  />
                  <td className="px-6 py-4">
                    {soal.lampiran ? (
                      soal.lampiran.tipe_file === "image" ? (
                        <img
                          src={getFilePath(soal.lampiran.path_file)}
                          alt="lampiran"
                          className="w-12 h-12 object-cover rounded border"
                        />
                      ) : soal.lampiran.tipe_file === "audio" ? (
                        <div className="flex flex-col bg-gradient-to-br from-purple-50 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 p-3 rounded-lg w-64 border border-gray-200 dark:border-gray-700">
                          {/* Header dengan judul dan kontrol */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full shadow flex items-center justify-center mr-2">
                                <HiVolumeUp className="text-white text-sm" />
                              </div>
                              <span className="text-xs font-medium truncate max-w-[100px]">
                                {soal.lampiran.nama_file || "Audio Soal"}
                              </span>
                            </div>
                            <button
                              onClick={() => toggleAudio(soal.soal_id)}
                              className="w-7 h-7 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                            >
                              {playingAudio === soal.soal_id ? (
                                <HiPause className="text-blue-600 text-sm" />
                              ) : (
                                <HiPlay className="text-blue-600 text-sm ml-0.5" />
                              )}
                            </button>
                          </div>

                          {/* Progress bar dengan waktu */}
                          <div className="mb-1">
                            <div
                              className="h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden cursor-pointer"
                              onClick={(e) => handleSeek(soal.soal_id, e)}
                            >
                              <div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full transition-all duration-300"
                                style={{ width: `${progressPercent}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <span>
                                {formatDuration(currentTimes[soal.soal_id])}
                              </span>
                              <span>
                                {formatDuration(durations[soal.soal_id])}
                              </span>
                            </div>
                          </div>

                          {/* Audio element (tersembunyi) */}
                          <audio
                            ref={(el) =>
                              (playerRefs.current[soal.soal_id] = el)
                            }
                            src={audioUrl}
                            onEnded={() => setPlayingAudio(null)}
                            onTimeUpdate={(e) =>
                              handleTimeUpdate(soal.soal_id, e)
                            }
                            onLoadedMetadata={(e) =>
                              handleLoadedMetadata(soal.soal_id, e)
                            }
                            onError={() => {
                              console.error("Error loading audio:", audioUrl);
                              showAlert("Gagal memuat audio", "error");
                              setPlayingAudio(null);
                            }}
                          />
                        </div>
                      ) : soal.lampiran.tipe_file === "video" ? (
                        <div className="w-40">
                          <video
                            src={getFilePath(soal.lampiran.path_file)}
                            controls
                            className="w-full h-20 object-cover rounded"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          Unsupported
                        </span>
                      )
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">{soal.bobot}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <HiPencil
                        title="Edit Soal"
                        className="inline-block cursor-pointer hover:text-blue-600 text-lg"
                      />
                      <HiTrash
                        title="Hapus Soal"
                        className="inline-block cursor-pointer hover:text-red-600 text-lg"
                        onClick={() => handleDelete(soal.soal_id)}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <SlideTambahBankSoal
        isOpen={showTambahSoal}
        onClose={() => {
          setShowTambahSoal(false);
          fetchData(); // refresh setelah tambah
        }}
        kelas={kelasInfo}
        mapel={mapelInfo}
      />
    </div>
  );
};

export default DetailBankSoal;
