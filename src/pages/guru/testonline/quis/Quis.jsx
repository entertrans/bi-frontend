import React, { useEffect, useState } from "react";
import { getTestsByType } from "../../../../api/testOnlineAPI";
import { HiPencil, HiTrash, HiUserGroup, HiPlay } from "react-icons/hi";
import Swal from "sweetalert2";
import SlideTambahTest from "./SlideTambahTest";
import SlidePeserta from "./SlidePeserta"; // slide untuk lihat peserta

const Quis = () => {
  const [tests, setTests] = useState([]);
  const [showTambahTest, setShowTambahTest] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showPeserta, setShowPeserta] = useState(false);

  const fetchTests = async () => {
    try {
      const data = await getTestsByType("quis");
      setTests(data);
    } catch (err) {
      console.error("Gagal ambil data quis:", err);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          Daftar Quis
        </h1>
        <button
          onClick={() => setShowTambahTest(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          + Tambah Quis
        </button>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Judul</th>
              <th className="px-6 py-3 text-left">Kelas</th>
              <th className="px-6 py-3 text-left">Mapel</th>
              <th className="px-6 py-3 text-left">Deadline</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {tests.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Tidak ada data quis.
                </td>
              </tr>
            )}

            {tests.map((test) => (
              <tr key={test.test_id}>
                <td className="px-6 py-4">{test.judul}</td>
                <td className="px-6 py-4">{test?.kelas?.kelas_nama}</td>
                <td className="px-6 py-4">{test?.mapel?.nm_mapel}</td>
                <td className="px-6 py-4">
                  {test.deadline
                    ? new Date(test.deadline).toLocaleString()
                    : "-"}
                </td>
                <td className="px-6 py-4">
                  {test.aktif === null && (
                    <span className="text-gray-500">Belum Aktif</span>
                  )}
                  {test.aktif === 1 && (
                    <span className="text-green-600 font-semibold">Aktif</span>
                  )}
                  {test.aktif === 0 && (
                    <span className="text-red-600 font-semibold">Tutup</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    {/* Lihat Peserta */}
                    <HiUserGroup
                      className="cursor-pointer hover:text-blue-600 text-xl"
                      onClick={() => {
                        setSelectedTest(test);
                        setShowPeserta(true);
                      }}
                    />

                    {/* Aktifkan */}
                    <HiPlay
                      className={`cursor-pointer text-xl ${
                        test.aktif === 1
                          ? "text-green-600"
                          : "hover:text-green-600"
                      }`}
                      onClick={() => {
                        Swal.fire("Aktifkan Quis", "Fitur coming soon", "info");
                      }}
                    />

                    {/* Edit */}
                    <HiPencil className="cursor-pointer hover:text-yellow-600 text-xl" />

                    {/* Hapus */}
                    <HiTrash className="cursor-pointer hover:text-red-600 text-xl" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide Tambah Quis */}
      <SlideTambahTest
        isOpen={showTambahTest}
        onClose={() => setShowTambahTest(false)}
        onSubmit={() => fetchTests()}
        type="quis"
      />

      {/* Slide Peserta */}
      {showPeserta && (
        <SlidePeserta
          isOpen={showPeserta}
          onClose={() => setShowPeserta(false)}
          test={selectedTest}
        />
      )}
    </div>
  );
};

export default Quis;
