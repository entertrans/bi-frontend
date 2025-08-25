import React, { useEffect, useState } from "react";
import {
  getPesertaByTest,
  addPeserta,
  deletePeserta,
} from "../../../../api/testOnlineAPI";
import { fetchAllSiswaByKelas } from "../../../../api/siswaAPI"; // pastikan ada API ini
import { HiTrash } from "react-icons/hi";
import { showAlert } from "../../../../utils/toast";

const SlidePeserta = ({ isOpen, onClose, test }) => {
  const [peserta, setPeserta] = useState([]);
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState("");

  useEffect(() => {
    if (isOpen && test) {
      loadPeserta();
      loadSiswa();
    }
  }, [isOpen, test]);

  const loadPeserta = async () => {
    try {
      const data = await getPesertaByTest(test.test_id);
      setPeserta(data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadSiswa = async () => {
    try {
      const data = await fetchAllSiswaByKelas(test.kelas_id);
      setSiswaList(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTambah = async () => {
    if (!selectedSiswa) {
      showAlert("Pilih siswa terlebih dahulu", "warning");
      return;
    }
    try {
      await addPeserta({
        test_id: test.test_id,
        siswa_id: parseInt(selectedSiswa),
      });
      showAlert("Peserta ditambahkan", "success");
      setSelectedSiswa("");
      loadPeserta();
    } catch (err) {
      console.error(err);
      showAlert("Gagal menambahkan peserta", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePeserta(id);
      showAlert("Peserta dihapus", "success");
      loadPeserta();
    } catch (err) {
      console.error(err);
      showAlert("Gagal hapus peserta", "error");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="relative w-full sm:w-1/2 lg:w-1/3 bg-white dark:bg-gray-800 p-6 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-purple-600">
          Peserta Quis: {test?.judul}
        </h2>

        {/* Form tambah */}
        <div className="flex space-x-2 mb-4">
          <select
            value={selectedSiswa}
            onChange={(e) => setSelectedSiswa(e.target.value)}
            className="flex-1 border p-2 rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">-- Pilih Siswa --</option>
            {siswaList.map((s) => (
              <option key={s.siswa_id} value={s.siswa_id}>
                {s.nama}
              </option>
            ))}
          </select>
          <button
            onClick={handleTambah}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Tambah
          </button>
        </div>

        {/* Tabel peserta */}
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Nama</th>
              <th className="px-4 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {peserta.length === 0 && (
              <tr>
                <td colSpan={2} className="text-center py-4 text-gray-500">
                  Belum ada peserta
                </td>
              </tr>
            )}
            {peserta.map((p) => (
              <tr key={p.peserta_id}>
                <td className="px-4 py-2">{p?.siswa?.nama}</td>
                <td className="px-4 py-2">
                  <HiTrash
                    className="cursor-pointer hover:text-red-600 text-lg"
                    onClick={() => handleDelete(p.peserta_id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default SlidePeserta;
