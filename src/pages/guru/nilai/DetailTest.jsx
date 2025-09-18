import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailTest } from "../../../api/guruAPI";
import { exportToExcel } from "../../../utils/excelExport";

const DetailTest = () => {
  const { type, kelas_id, mapel_id } = useParams();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kelasInfo, setKelasInfo] = useState({});
  const [mapelInfo, setMapelInfo] = useState({});
  const navigate = useNavigate();

  // Mapping type ke judul yang lebih user-friendly
  const typeLabels = {
    ub: "Ulangan Bulanan",
    tr: "Test Review",
    tugas: "Tugas",
  };

  useEffect(() => {
    const fetchDetailTest = async () => {
      try {
        const response = await getDetailTest(type, kelas_id, mapel_id);
        setTests(response.data || []);
        setKelasInfo(response.kelas || {});
        setMapelInfo(response.mapel || {});
      } catch (err) {
        console.error(`Gagal ambil detail ${type}:`, err);
        setKelasInfo({ kelas_id, kelas_nama: "Unknown" });
        setMapelInfo({ kd_mapel: mapel_id, nm_mapel: "Unknown" });
      } finally {
        setLoading(false);
      }
    };

    fetchDetailTest();
  }, [type, kelas_id, mapel_id]);

  const handleDetailPeserta = (test_id) => {
    navigate(`/guru/nilai/${type}/peserta/${test_id}/${kelas_id}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleExportExcel = () => {
    const worksheetName = `${mapelInfo.nm_mapel} - ${kelasInfo.kelas_nama}`;
    const fileName = `Rekap_${typeLabels[type]}_${mapelInfo.nm_mapel}_${kelasInfo.kelas_nama}.xlsx`;

    const dataForExport = tests.map((test) => ({
      "Judul Test": test.judul,
      Guru: test.guru_nama,
      "Durasi (menit)": test.durasi_menit,
      "Jumlah Soal": test.jumlah_soal,
      "Tanggal Dibuat": test.created_at,
    }));

    exportToExcel(dataForExport, worksheetName, fileName);
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center mb-4 md:mb-0">
          <button
            onClick={handleBack}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
          >
            &larr; Kembali
          </button>
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            Detail {typeLabels[type]}
          </h1>
        </div>

        {tests.length > 0 && (
          <button
            onClick={handleExportExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export Excel
          </button>
        )}
      </div>

      {/* Info Kelas dan Mapel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Kelas
            </p>
            <p className="text-lg font-bold">{kelasInfo.kelas_nama || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Mata Pelajaran
            </p>
            <p className="text-lg font-bold">{mapelInfo.nm_mapel || "-"}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Jenis Test
            </p>
            <p className="text-lg font-bold">{typeLabels[type]}</p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Total Test
            </p>
            <p className="text-lg font-bold">{tests.length} Test</p>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Judul Test</th>
                <th className="px-6 py-3 text-left">Guru</th>
                <th className="px-6 py-3 text-left">Durasi</th>
                <th className="px-6 py-3 text-left">Jumlah Soal</th>
                <th className="px-6 py-3 text-left">Tanggal Dibuat</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {tests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-16 h-16 text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg">
                        Tidak ada data {typeLabels[type]}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr
                    key={test.test_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 font-semibold">{test.judul}</td>
                    <td className="px-6 py-4">{test.guru_nama}</td>
                    <td className="px-6 py-4">{test.durasi_menit} menit</td>
                    <td className="px-6 py-4 font-bold">
                      {test.jumlah_soal} soal
                    </td>
                    <td className="px-6 py-4">{test.created_at}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleDetailPeserta(test.test_id)}
                          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
                        >
                          Lihat Peserta
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DetailTest;
