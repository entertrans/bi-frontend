import React, { useEffect, useState } from "react";
import { getAllRekapBankSoal } from "../../../api/bankSoalAPI";
import { useNavigate } from "react-router-dom";

const BankSoalRekap = () => {
  const [rekapData, setRekapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const fetchRekap = async () => {
    try {
      const data = await getAllRekapBankSoal();
      setRekapData(data);
    } catch (err) {
      console.error("Gagal ambil rekap bank soal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRekap();
  }, []);

  const filteredData = rekapData.filter(
    (item) =>
      item.kelas_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.mapel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-4">
        Rekap Bank Soal Aktif
      </h1>

      <input
        type="text"
        placeholder="Cari kelas / mapel..."
        className="mb-4 p-2 border rounded w-full md:w-80 dark:bg-gray-700 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-500">Memuat data...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Kelas</th>
                <th className="px-6 py-3 text-left">Mapel</th>
                <th className="px-6 py-3 text-left">PG</th>
                <th className="px-6 py-3 text-left">PG Kompleks</th>
                <th className="px-6 py-3 text-left">Isian</th>
                <th className="px-6 py-3 text-left">True/False</th>
                <th className="px-6 py-3 text-left">Uraian</th>
                <th className="px-6 py-3 text-left">Mencocokkan</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-500">
                    Tidak ada data rekap soal.
                  </td>
                </tr>
              )}

              {filteredData.map((row) => (
                <tr key={`${row.kelas_id}-${row.mapel_id}`}>
                  <td className="px-6 py-4">{row.kelas_nama}</td>
                  <td className="px-6 py-4">{row.mapel_nama}</td>
                  <td className="px-6 py-4">{row.pg}</td>
                  <td className="px-6 py-4">{row.pg_kompleks}</td>
                  <td className="px-6 py-4">{row.isian_singkat}</td>
                  <td className="px-6 py-4">{row.true_false}</td>
                  <td className="px-6 py-4">{row.uraian}</td>
                  <td className="px-6 py-4">{row.mencocokkan}</td>
                  <td className="px-6 py-4 font-bold">{row.total}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/guru/banksoal/detail/${row.kelas_id}/${row.mapel_id}`
                        )
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Detail
                    </button>
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

export default BankSoalRekap;
