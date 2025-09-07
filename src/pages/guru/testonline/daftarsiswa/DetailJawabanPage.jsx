// src/pages/guru/DetailJawabanPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// Tambah ini pada import paling atas (sesuaikan nama fungsi API nyata)
import {
  fetchDetailJawabanBySession,
  updateJawabanFinal, // contoh: simpan jawaban per-soal ke jawabanfinal
  updateOverrideNilai, // contoh: simpan override nilai ke testonline
} from "../../../../api/testOnlineAPI";
import ExpandableText from "../../../../utils/ExpandableText";
import { renderJawaban, renderKunci } from "./renderKunci";

const DetailJawabanPage = () => {
  const { session_id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [jawabanData, setJawabanData] = useState(null);
  const [error, setError] = useState(null);
  const [nilaiAkhir, setNilaiAkhir] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // edit per soal
  const [isOverrideEditing, setIsOverrideEditing] = useState(false); // override nilai akhir
  const [overrideNilai, setOverrideNilai] = useState(null);

  const displayedNilai = overrideNilai !== null ? overrideNilai : nilaiAkhir;

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDetailJawabanBySession(session_id);

        if (!data || !data.jawaban || !Array.isArray(data.jawaban)) {
          throw new Error("Format data jawaban tidak valid");
        }

        setJawabanData(data);

        // hitung nilai awal
        hitungNilaiAkhir(data.jawaban);
      } catch (err) {
        console.error("❌ Gagal ambil data:", err);
        setError(err.message || "Terjadi kesalahan saat mengambil data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [session_id]);

  const hitungNilaiAkhir = (jawabanArr) => {
    const totalSkor = jawabanArr.reduce((total, item) => {
      const skor =
        item.skor_uraian !== null ? item.skor_uraian : item.skor_objektif;
      return total + (skor || 0);
    }, 0);

    const avgSkor = totalSkor / jawabanArr.length;
    setNilaiAkhir(avgSkor * 100);
  };

  // ubah nilai manual (hanya uraian & isian singkat)
  const handleNilaiChange = (index, nilai) => {
    const newJawabanData = { ...jawabanData };
    newJawabanData.jawaban[index].skor_uraian = parseFloat(nilai) || 0;
    setJawabanData(newJawabanData);
    hitungNilaiAkhir(newJawabanData.jawaban);
  };

  // Simpan hanya untuk jawaban per-soal (jawabanfinal)
  // Simpan hanya untuk jawaban per-soal (uraian & isian_singkat)
  const handleSaveNilai = async () => {
    try {
      if (!isEditing) return; // safety

      // ambil hanya soal yang bisa diubah manual
      const perubahan = jawabanData.jawaban
        .filter(
          (item) =>
            item.tipe_soal === "uraian" || item.tipe_soal === "isian_singkat"
        )
        .map((item) => ({
          session_id: Number(session_id), // pastikan integer
          soal_id: item.soal_id,
          nilai: item.skor_uraian ?? 0, // skor manual yang guru isi
        }));

      if (perubahan.length === 0) {
        alert("Tidak ada perubahan nilai untuk disimpan.");
        return;
      }

      // console.log("📤 Data yang dikirim ke backend:", perubahan);

      // panggil API dengan data yang sudah diringkas
      await updateJawabanFinal(session_id, { perubahan });

      setIsEditing(false);
      alert("✅ Nilai per soal berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan nilai per soal:", error);
      alert("❌ Gagal menyimpan nilai per soal!");
    }
  };

  // Simpan override ke endpoint testonline (nilai akhir)
  const handleSaveOverrideNilai = async () => {
    try {
      const final = Number(overrideNilai);
      if (Number.isNaN(final) || final < 0 || final > 100) {
        alert("Nilai override tidak valid (harus antara 0 - 100).");
        return;
      }

      // panggil API yang khusus menyimpan override (testonline)
      await updateOverrideNilai(session_id, { nilai_akhir: final });

      setIsOverrideEditing(false);
      alert("✅ Override nilai berhasil disimpan!");
    } catch (error) {
      console.error("Gagal menyimpan override nilai:", error);
      alert("❌ Gagal menyimpan override nilai!");
    }
  };

  const handleExport = () => {
    alert("⚡ Export belum diimplementasikan");
  };

  // Komponen untuk menampilkan lampiran
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
            className="text-blue-600 hover:underline text-xs flex items-center"
          >
            <span className="mr-1">📎</span>
            {lampiran_nama_file}
          </a>
        </div>
      );
    }
  };

  // Fungsi untuk menentukan warna badge berdasarkan tipe soal
  const getBadgeColor = (tipeSoal) => {
    switch (tipeSoal) {
      case "uraian":
      case "isian_singkat":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"; // Kuning untuk soal yang dinilai guru
      default:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"; // Hijau untuk soal yang dinilai sistem
    }
  };

  // Loading UI
  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">
            Memuat data jawaban...
          </p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  if (!jawabanData) {
    return (
      <div className="p-8">
        <p>Data jawaban tidak ditemukan untuk session: {session_id}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Detail Jawaban Siswa
          </h1>
          <div className="mt-2 text-gray-700 dark:text-gray-300">
            <p>
              <span className="font-medium">Nama:</span>{" "}
              {jawabanData.siswa?.nama || "Tidak diketahui"}
            </p>
            <p>
              <span className="font-medium">NIS:</span>{" "}
              {jawabanData.siswa?.nis || "Tidak diketahui"}
            </p>
            <p>
              <span className="font-medium">Mata Pelajaran:</span>{" "}
              {jawabanData.test?.mapel || "Tidak diketahui"}
            </p>
            <p>
              <span className="font-medium">Judul Test:</span>{" "}
              {jawabanData.test?.judul || "Tidak diketahui"}
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          ← Kembali
        </button>
      </div>

      {/* Info Nilai */}
      <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
        <div className="flex justify-between items-center">
          {/* Nilai akhir */}
          <div className="flex items-center">
            <span className="font-medium text-blue-800 dark:text-blue-200">
              Nilai Akhir:
            </span>

            {isOverrideEditing ? (
              <>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={
                    overrideNilai !== null
                      ? overrideNilai
                      : Number(parseFloat(nilaiAkhir.toFixed(2)))
                  }
                  onChange={(e) => setOverrideNilai(parseFloat(e.target.value))}
                  className="ml-2 w-24 px-2 py-1 border rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
                <button
                  onClick={handleSaveOverrideNilai}
                  className="ml-2 text-green-600 hover:text-green-800 dark:hover:text-green-400"
                  title="Simpan override nilai"
                >
                  💾
                </button>
                <button
                  onClick={() => {
                    setIsOverrideEditing(false);
                    // optional: reset overrideNilai jika mau
                    // setOverrideNilai(null);
                  }}
                  className="ml-2 text-red-600 hover:text-red-800"
                  title="Batal"
                >
                  ✖
                </button>
              </>
            ) : (
              <>
                <span className="ml-2 text-2xl font-bold text-blue-800 dark:text-blue-200">
                  {displayedNilai.toFixed(2)}
                </span>
                <button
                  onClick={() => {
                    setIsOverrideEditing(true);
                    // inisialisasi nilai override dengan nilaiAkhir saat mulai edit supaya input terisi
                    if (overrideNilai === null) {
                      setOverrideNilai(
                        Number(parseFloat(nilaiAkhir.toFixed(2)))
                      );
                    }
                  }}
                  className="ml-2 text-yellow-600 hover:text-yellow-800 dark:hover:text-yellow-400"
                  title="Edit nilai akhir"
                >
                  ✏️
                </button>
              </>
            )}
          </div>

          {/* Aksi */}
          <div className="flex gap-2">
            {/* Edit jawaban per soal */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              {isEditing ? "Batal Edit Jawaban" : "Edit Nilai Per Soal"}
            </button>

            {/* Simpan semua perubahan: hanya tampil kalau edit per-soal aktif */}
            {isEditing && (
              <button
                onClick={handleSaveNilai}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Simpan Semua Perubahan
              </button>
            )}

            {/* Export */}
            <button
              onClick={handleExport}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Export Jawaban
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Jawaban */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border dark:border-gray-600">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
            <tr>
              <th className="px-4 py-3">No</th>
              <th className="px-4 py-3">Tipe</th>
              <th className="px-4 py-3">Lampiran</th>
              <th className="px-4 py-3">Pertanyaan</th>
              <th className="px-4 py-3">Jawaban Siswa</th>
              <th className="px-4 py-3">Kunci Jawaban</th>
              <th className="px-4 py-3">Max Score</th>
              <th className="px-4 py-3">Nilai</th>
              {isEditing && <th className="px-4 py-3">Edit Nilai</th>}
            </tr>
          </thead>
          <tbody>
            {jawabanData.jawaban.map((item, index) => (
              <tr
                key={item.soal_id || index}
                className="border-b dark:border-gray-600"
              >
                <td className="px-4 py-3">{index + 1}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${getBadgeColor(
                      item.tipe_soal
                    )}`}
                  >
                    {item.tipe_soal || "Unknown"}
                  </span>
                </td>

                <td className="px-4 py-3">
                  {/* Tampilkan lampiran soal jika ada */}
                  <LampiranDisplay lampiran={item} />
                </td>
                <td className="px-4 py-3">
                  <ExpandableText text={item.pertanyaan} limit={25} />
                </td>

                <td className="px-4 py-3">{renderJawaban(item)}</td>
                <td className="px-4 py-3">{renderKunci(item)}</td>
                <td className="px-4 py-3">{item.max_score}</td>
                <td className="px-4 py-3">
                  {item.skor_uraian !== null
                    ? item.skor_uraian
                    : item.skor_objektif}
                </td>
                {isEditing && (
                  <td className="px-4 py-3">
                    {(item.tipe_soal === "uraian" ||
                      item.tipe_soal === "isian_singkat") && (
                      <input
                        type="number"
                        min="0"
                        max={item.max_score} // BATASI NILAI MAKSIMUM
                        step="0.1"
                        value={
                          item.skor_uraian !== null
                            ? item.skor_uraian
                            : item.skor_objektif || 0
                        }
                        onChange={(e) => {
                          const nilai = parseFloat(e.target.value);
                          // Validasi tidak boleh lebih dari max_score
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
