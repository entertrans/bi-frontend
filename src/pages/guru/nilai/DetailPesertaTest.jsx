import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDetailPesertaTest } from "../../../api/guruAPI";
import { formatTanggalWaktu } from "../../../utils/format";

const DetailPesertaTest = () => {
  const { type, test_id, kelas_id } = useParams();
  const [peserta, setPeserta] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testInfo, setTestInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPeserta = async () => {
      try {
        const response = await getDetailPesertaTest(type, test_id, kelas_id);
        setPeserta(response.data || []);
        setTestInfo(response.test_info || {});
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

  // Format status untuk display
  const formatStatus = (status) => {
    const statusMap = {
      not_started: {
        text: "Belum Mengerjakan",
        class: "bg-red-100 text-red-800",
      },
      in_progress: {
        text: "Sedang Mengerjakan",
        class: "bg-yellow-100 text-yellow-800",
      },
      submitted: {
        text: "Sudah Mengerjakan",
        class: "bg-green-100 text-green-800",
      },
      time_up: { text: "Waktu Habis", class: "bg-orange-100 text-orange-800" },
    };

    return (
      statusMap[status] || { text: status, class: "bg-gray-100 text-gray-800" }
    );
  };

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
          Detail Peserta Test
        </h1>
      </div>

      {/* Info Test */}
      {testInfo.judul && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Judul Test
              </p>
              <p className="text-lg font-bold">{testInfo.judul}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Jenis
              </p>
              <p className="text-lg font-bold">{testInfo.type_test}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Durasi
              </p>
              <p className="text-lg font-bold">{testInfo.durasi_menit} menit</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Jumlah Soal
              </p>
              <p className="text-lg font-bold">{testInfo.jumlah_soal} soal</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Guru
              </p>
              <p className="text-lg font-bold">{testInfo.guru_nama}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Kelas
              </p>
              <p className="text-lg font-bold">{testInfo.kelas_nama}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Mata Pelajaran
              </p>
              <p className="text-lg font-bold">{testInfo.mapel_nama}</p>
            </div>
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                Dibuat Pada
              </p>
              <p className="text-lg font-bold">
                {formatTanggalWaktu(testInfo.created_at).date}
              </p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Memuat data peserta...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">NIS</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Kelas</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Nilai</th>
                <th className="px-6 py-3 text-left">Waktu Mulai</th>
                <th className="px-6 py-3 text-left">Waktu Selesai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {peserta.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-4 text-gray-500">
                    Tidak ada data peserta.
                  </td>
                </tr>
              ) : (
                peserta.map((p) => {
                  const statusInfo = formatStatus(p.status);
                  return (
                    <tr
                      key={p.siswa_id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-6 py-4 font-mono">{p.nis}</td>
                      <td className="px-6 py-4">{p.nama}</td>
                      <td className="px-6 py-4">{p.kelas_nama}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${statusInfo.class}`}
                        >
                          {statusInfo.text}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {p.nilai !== null ? `${p.nilai}` : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {p.waktu_mulai
                          ? formatTanggalWaktu(p.waktu_mulai).date
                          : "-"}
                      </td>
                      <td className="px-6 py-4">
                        {p.waktu_selesai
                          ? formatTanggalWaktu(p.waktu_selesai).date
                          : "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DetailPesertaTest;
