import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailTest } from "../../../api/guruAPI";

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
    tugas: "Tugas"
  };

  useEffect(() => {
    const fetchDetailTest = async () => {
      try {
        const data = await getDetailTest(type, kelas_id, mapel_id);
        setTests(data);
        
        // Ambil info kelas dan mapel dari data pertama (jika ada)
        if (data.length > 0 && data[0].kelas) {
          setKelasInfo(data[0].kelas);
          setMapelInfo(data[0].mapel);
        }
      } catch (err) {
        console.error(`Gagal ambil detail ${type}:`, err);
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

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-white px-3 py-1 rounded mr-3 hover:bg-gray-400 dark:hover:bg-gray-500"
        >
          &larr; Kembali
        </button>
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Detail {typeLabels[type]} - {kelasInfo.kelas_nama} | {mapelInfo.nm_mapel}
        </h1>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Judul</th>
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
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    Tidak ada data {typeLabels[type]}.
                  </td>
                </tr>
              ) : (
                tests.map((test) => (
                  <tr key={test.test_id}>
                    <td className="px-6 py-4">{test.judul}</td>
                    <td className="px-6 py-4">{test.guru_nama}</td>
                    <td className="px-6 py-4">{test.durasi_menit} menit</td>
                    <td className="px-6 py-4">{test.jumlah_soal}</td>
                    <td className="px-6 py-4">{test.created_at}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDetailPeserta(test.test_id)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Detail Peserta
                      </button>
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