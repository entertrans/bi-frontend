import React from "react";

const ExpiredTestsTable = ({ tests }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-red-600 mb-4">
        Ujian Kadaluarsa ({tests.length})
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 opacity-70">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Judul Ujian</th>
              <th className="px-6 py-3 text-left">Mata Pelajaran</th>
              <th className="px-6 py-3 text-left">Jumlah Soal</th>
              <th className="px-6 py-3 text-left">Durasi</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tests.map((test) => (
              <tr key={test.test_id}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium">{test.judul}</div>
                    {test.deskripsi && (
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {test.deskripsi}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">{test?.mapel?.nm_mapel || "-"}</td>
                <td className="px-6 py-4">
                  {test.jumlah_soal_tampil || 0} soal
                </td>
                <td className="px-6 py-4">{test.durasi_menit} menit</td>
                <td className="px-6 py-4 text-red-500 font-semibold">
                  Kadaluarsa
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpiredTestsTable;
