// src/pages/guru/JawabanPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchJawabanSiswaDetail,
  fetchJawabanBySiswa,
} from "../../../../api/testOnlineAPI";

const JawabanPage = () => {
  const { siswa_nis } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [siswa, setSiswa] = useState(null);
  const [tests, setTests] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        //   console.log("🔄 Memulai load data untuk NIS:", siswa_nis);

        const [siswaData, testData] = await Promise.all([
          fetchJawabanSiswaDetail(siswa_nis),
          fetchJawabanBySiswa(siswa_nis),
        ]);

        //   console.log("📊 Data siswa dari API:", siswaData);
        //   console.log("📊 Tipe data siswa:", typeof siswaData);
        //   console.log("📊 Data test dari API:", testData);
        //   console.log("📊 Tipe data test:", typeof testData);

        // Cek struktur testData
        //   if (testData && testData.results) {
        //     console.log("📊 Jumlah test results:", testData.results.length);
        //     console.log("📊 Test results:", testData.results);
        //   }

        setSiswa(siswaData);
        setTests(testData?.results || []);

        //   console.log("✅ Data berhasil di-set ke state");
      } catch (err) {
        console.error("❌ Gagal ambil data:", err);
        console.error("Error response:", err.response);
        console.error("Error details:", err.response?.data);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [siswa_nis]);
  const formatTanggal = (tanggal) => {
    if (!tanggal) return null;
    return new Date(tanggal).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

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

  if (!siswa) {
    return (
      <div className="p-8">
        <p>Data siswa tidak ditemukan untuk NIS: {siswa_nis}</p>
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
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Manajemen Jawaban - {siswa.siswa_nama || "Siswa"}
        </h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
        >
          ← Kembali
        </button>
      </div>

      {/* Info Siswa */}
      <div className="mb-6 text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium">NIS:</span> {siswa.siswa_nis}
        </p>
        <p>
          <span className="font-medium">Kelas:</span> {siswa.kelas_nama || "-"}
        </p>
        <p>
          <span className="font-medium">Jenis Kelamin:</span>{" "}
          {siswa.siswa_jenkel === "L" ? "Laki-laki" : "Perempuan"}
        </p>
      </div>

      {/* Table Test */}
      <div className="overflow-x-auto">
        {tests.length > 0 ? (
          <table className="w-full text-sm text-left border dark:border-gray-600">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
              <tr>
                <th className="px-4 py-3">Jenis Test</th>
                <th className="px-4 py-3">Mapel</th>
                <th className="px-4 py-3">Judul</th>
                <th className="px-4 py-3">Nilai</th>
                <th className="px-4 py-3">Rangkaian</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((t) => (
                <tr key={t.test_id} className="border-b dark:border-gray-600">
                  <td className="px-4 py-3">{t.jenis}</td>
                  <td className="px-4 py-3">{t.mapel}</td>
                  <td className="px-4 py-3">{t.judul}</td>
                  <td className="px-4 py-3">
                    {t.nilai !== null && t.nilai !== undefined ? (
                      <span className="font-medium">{t.nilai}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {t.rangkaian && Object.keys(t.rangkaian).length > 0
                      ? Object.entries(t.rangkaian)
                          .map(([key, val]) => `${val} ${key}`)
                          .join(", ")
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        t.status.includes("✅")
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : t.status.includes("⚠️")
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {t.tanggal ? (
                      formatTanggal(t.tanggal)
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button className="text-blue-600 hover:underline text-sm dark:text-blue-400">
                      Detail Jawaban
                    </button>
                    <button className="text-red-600 hover:underline text-sm dark:text-red-400">
                      Reset Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p>Tidak ada test yang ditemukan untuk siswa ini</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JawabanPage;
