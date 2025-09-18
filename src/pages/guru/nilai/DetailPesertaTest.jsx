import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailPesertaTest } from "../../../api/guruAPI";

const DetailPesertaTest = () => {
  const { type, test_id, kelas_id } = useParams();
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testInfo, setTestInfo] = useState({});
  const navigate = useNavigate();

  // Mapping type ke judul yang lebih user-friendly
  const typeLabels = {
    ub: "Ulangan Bulanan",
    tr: "Test Review",
    tugas: "Tugas"
  };

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        const data = await getDetailPesertaTest(type, test_id, kelas_id);
        setPeserta(data);
        
        // Anda bisa menambahkan API call untuk mendapatkan info test jika diperlukan
        // const testData = await getTestInfo(test_id);
        // setTestInfo(testData);
      } catch (err) {
        console.error("Gagal ambil detail peserta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPeserta();
  }, [type, test_id, kelas_id]);

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
          Detail Peserta {typeLabels[type]} - Test ID: {test_id}
        </h1>
      </div>

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">NIS</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Nilai</th>
                <th className="px-6 py-3 text-left">Waktu Mulai</th>
                <th className="px-6 py-3 text-left">Waktu Selesai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {peserta.map((p) => (
                <tr key={p.siswa_id}>
                  <td className="px-6 py-4">{p.nis}</td>
                  <td className="px-6 py-4">{p.nama}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      p.status === 'sudah_ngerjain' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {p.status === 'sudah_ngerjain' ? 'Sudah Mengerjakan' : 'Belum Mengerjakan'}
                    </span>
                  </td>
                  <td className="px-6 py-4">{p.nilai || '-'}</td>
                  <td className="px-6 py-4">
                    {p.waktu_mulai ? new Date(p.waktu_mulai).toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-4">
                    {p.waktu_selesai ? new Date(p.waktu_selesai).toLocaleString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DetailPesertaTest;