// src/pages/guru/DetailJawabanPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  fetchDetailJawabanBySession,
  updateJawabanFinal,
  updateOverrideNilai,
} from "../../../../api/testOnlineAPI";
import ExpandableText from "../../../../utils/ExpandableText";
import { renderJawaban, renderKunci } from "./renderKunci";
import { showAlert } from "../../../../utils/toast";
import { exportJawabanToExcel } from "./exportToExcel"; // Import fungsi export

const DetailJawabanPage = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // ambil jenis dari state navigate
  const jenis = location.state?.jenis || jawabanData?.test?.jenis;
  const [isLoading, setIsLoading] = useState(true);
  const [jawabanData, setJawabanData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isOverrideEditing, setIsOverrideEditing] = useState(false);
  const [overrideNilai, setOverrideNilai] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Ambil nilai dari response backend
  const nilaiAkhir = jawabanData?.test?.nilai || 0;
  const displayedNilai = overrideNilai !== null ? overrideNilai : nilaiAkhir;

   useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDetailJawabanBySession(session_id, jenis);

        if (!data || !data.jawaban || !Array.isArray(data.jawaban)) {
          throw new Error("Format data jawaban tidak valid");
        }

        setJawabanData(data);
        setOverrideNilai(null);
      } catch (err) {
        console.error("Gagal ambil data:", err);
        setError(err.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session_id, refreshTrigger]);

   const refreshData = async () => {
    try {
      const data = await fetchDetailJawabanBySession(session_id);
      if (data && data.jawaban && Array.isArray(data.jawaban)) {
        setJawabanData(data);
        setOverrideNilai(null);
      }
    } catch (err) {
      console.error("Gagal refresh data:", err);
      showAlert("Gagal memperbarui data", "error");
    }
  };

  const handleNilaiChange = (index, nilai) => {
    const newJawabanData = { ...jawabanData };
    newJawabanData.jawaban[index].skor_uraian = parseFloat(nilai) || 0;
    setJawabanData(newJawabanData);
    setOverrideNilai(null);

    
  };

  const handleSaveNilai = async () => {
    try {
      if (!isEditing) return;

      const perubahan = jawabanData.jawaban
        .filter(
          (item) =>
            item.tipe_soal === "uraian" || item.tipe_soal === "isian_singkat"
        )
        .map((item) => ({
          session_id: Number(session_id),
          soal_id: item.soal_id,
          nilai: item.skor_uraian ?? 0,
        }));

      if (perubahan.length === 0) {
        showAlert("Tidak ada perubahan nilai untuk disimpan.", "info");
        return;
      }

      await updateJawabanFinal(session_id, { perubahan });

      setIsEditing(false);
      showAlert("Nilai per soal berhasil disimpan!", "success");
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Gagal menyimpan nilai per soal:", error);
      showAlert("Gagal menyimpan nilai per soal!", "error");
    }
  };

  const handleSaveOverrideNilai = async () => {
    try {
      const final = Number(overrideNilai);
      if (Number.isNaN(final) || final < 0 || final > 100) {
        showAlert("Nilai override tidak valid (harus antara 0 - 100)", "info");
        return;
      }

      await updateOverrideNilai(session_id, { nilai_akhir: final });

      setIsOverrideEditing(false);
      showAlert("Override nilai berhasil disimpan!", "success");

      setJawabanData((prevData) => ({
        ...prevData,
        test: {
          ...prevData.test,
          nilai: final,
        },
      }));

      setOverrideNilai(null);
    } catch (error) {
      console.error("Gagal menyimpan override nilai:", error);
      showAlert("Gagal menyimpan override nilai!", "error");
    }
  };

  const handleCancelOverride = () => {
    setIsOverrideEditing(false);
    setOverrideNilai(null);
  };

  const handleExport = () => {
    if (!jawabanData) {
      showAlert("Tidak ada data untuk diexport", "warning");
      return;
    }

    try {
      const fileName = exportJawabanToExcel(jawabanData, displayedNilai);
      showAlert(`Export berhasil! File ${fileName} telah didownload.`, "success");
    } catch (error) {
      console.error("Error saat export:", error);
      showAlert("Gagal melakukan export: " + error.message, "error");
    }
  };

  const LampiranDisplay = ({ lampiran }) => {
    if (!lampiran || !lampiran.lampiran_path_file) return null;

    const { lampiran_nama_file, lampiran_path_file, lampiran_tipe_file } =
      lampiran;
    const fullPath = `http://localhost:8080/${lampiran_path_file.replace(
      /\\/g,
      "/"
    )}`;

    if (lampiran_tipe_file.startsWith("image")) {
      return (
        <div className="mt-1">
          <img
            src={fullPath}
            alt={lampiran_nama_file}
            className="w-16 h-16 object-cover rounded border cursor-pointer"
            onClick={() => window.open(fullPath, "_blank")}
            title={lampiran_nama_file}
          />
        </div>
      );
    } else {
      return (
        <div className="mt-1">
          <a
            href={fullPath}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline text-xs flex items-center dark:text-blue-400"
          >
            <span className="mr-1">📎</span>
            {lampiran_nama_file}
          </a>
        </div>
      );
    }
  };

  const getBadgeColor = (tipeSoal) => {
    switch (tipeSoal) {
      case "uraian":
      case "isian_singkat":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            &larr; Kembali
          </button>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Detail Jawaban Siswa
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Memuat data jawaban...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            &larr; Kembali
          </button>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Detail Jawaban Siswa
          </h1>
        </div>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!jawabanData) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="flex items-center mb-6">
          <button
            onClick={handleBack}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            &larr; Kembali
          </button>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Detail Jawaban Siswa
          </h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Data jawaban tidak ditemukan untuk session: {session_id}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center mb-6">
        <button
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          &larr; Kembali
        </button>
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Detail Jawaban Siswa
        </h1>
        <button
          onClick={refreshData}
          className="ml-auto bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
          title="Refresh data"
        >
          ↻ Refresh
        </button>
      </div>

      {/* Info Siswa */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Nama
            </p>
            <p className="text-lg font-bold">
              {jawabanData?.siswa?.nama || "Tidak diketahui"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              NIS
            </p>
            <p className="text-lg font-bold">
              {jawabanData?.siswa?.nis || "Tidak diketahui"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Mata Pelajaran
            </p>
            <p className="text-lg font-bold">
              {jawabanData?.test?.mapel || "Tidak diketahui"}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Judul Test
            </p>
            <p className="text-lg font-bold">
              {jawabanData?.test?.judul || "Tidak diketahui"}
            </p>
          </div>
        </div>
      </div>

      {/* Info Nilai */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          {/* Nilai akhir */}
          <div className="flex items-center">
            <span className="font-medium text-blue-800 dark:text-blue-200 mr-2">
              Nilai Akhir:
            </span>

            {isOverrideEditing ? (
              <div className="flex items-center">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={
                    overrideNilai !== null
                      ? overrideNilai
                      : Number(parseFloat(nilaiAkhir).toFixed(2))
                  }
                  onChange={(e) => setOverrideNilai(parseFloat(e.target.value))}
                  className="w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <button
                  onClick={handleSaveOverrideNilai}
                  className="ml-2 px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  title="Simpan override nilai"
                >
                  Simpan
                </button>
                <button
                  onClick={handleCancelOverride}
                  className="ml-2 px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  title="Batal"
                >
                  Batal
                </button>
              </div>
            ) : (
              <div className="flex items-center">
                <span className="text-2xl font-bold text-blue-800 dark:text-blue-200 mr-2">
                  {displayedNilai.toFixed(2)}
                </span>
                <button
                  onClick={() => {
                    setIsOverrideEditing(true);
                    setOverrideNilai(Number(parseFloat(nilaiAkhir).toFixed(2)));
                  }}
                  className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                  title="Edit nilai akhir"
                >
                  Edit Nilai
                </button>
              </div>
            )}
          </div>

          {/* Aksi */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1 rounded ${
                isEditing
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-yellow-500 hover:bg-yellow-600 text-white"
              }`}
            >
              {isEditing ? "Batal Edit" : "Edit Nilai Per Soal"}
            </button>

            {isEditing && (
              <button
                onClick={handleSaveNilai}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Simpan Semua
              </button>
            )}

            <button
              onClick={handleExport}
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Export Jawaban
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Jawaban */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Tipe
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Lampiran
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Pertanyaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Jawaban Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Kunci Jawaban
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Max Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Nilai
              </th>
              {isEditing && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Edit Nilai
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {jawabanData.jawaban.map((item, index) => (
              <tr
                key={item.soal_id || index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getBadgeColor(
                      item.tipe_soal
                    )}`}
                  >
                    {item.tipe_soal || "Unknown"}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <LampiranDisplay lampiran={item} />
                </td>
                <td className="px-6 py-4">
                  <ExpandableText text={item.pertanyaan} limit={25} />
                </td>

                <td className="px-6 py-4">{renderJawaban(item)}</td>

                <td className="px-6 py-4">
                  {/* {item.jawaban_benar} */}
                  {renderKunci(item)}
                </td>
                <td className="px-6 py-4">{item.max_score}</td>
                <td className="px-6 py-4 font-bold">
                  {item.skor_uraian !== null
                    ? item.skor_uraian
                    : item.skor_objektif}
                </td>
                {isEditing && (
                  <td className="px-6 py-4">
                    {(item.tipe_soal === "uraian" ||
                      item.tipe_soal === "isian_singkat") && (
                      <input
                        type="number"
                        min="0"
                        max={item.max_score}
                        step="0.1"
                        value={
                          item.skor_uraian !== null
                            ? item.skor_uraian
                            : item.skor_objektif || 0
                        }
                        onChange={(e) => {
                          const nilai = parseFloat(e.target.value);
                          if (nilai <= item.max_score) {
                            handleNilaiChange(index, nilai);
                          }
                        }}
                        className="w-20 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                      />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legenda */}
      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          <span className="inline-flex items-center mr-4">
            <span className="w-3 h-3 bg-green-100 rounded mr-1"></span>
            Soal dinilai sistem
          </span>
          <span className="inline-flex items-center">
            <span className="w-3 h-3 bg-yellow-100 rounded mr-1"></span>
            Soal dinilai guru
          </span>
        </p>
      </div>
    </div>
  );
};

export default DetailJawabanPage;
