import React, { useEffect, useState } from "react";
import {
  getTestsByType,
  deleteTest,
  createTest,
} from "../../../../api/testOnlineAPI";
import { fetchAllkelas, fetchAllMapelByKelas } from "../../../../api/siswaAPI";
import { updateTestAktif } from "../../../../api/testOnlineAPI";
import { HiTrash, HiDocumentText, HiUserGroup, HiPlay } from "react-icons/hi";
import Swal from "sweetalert2";
import { showAlert } from "../../../../utils/toast";
import SlideTambahTest from "../common/SlideTambahTest";
import SlidePeserta from "../common/SlidePeserta";
import SlideTambahSoal from "../common/SlideTambahSoal";
import { formatTanggalLengkap } from "../../../../utils/format";

const TugasList = () => {
  const [tugasList, setTugasList] = useState([]);
  const [kelasList, setKelasList] = useState({ aktif: [] });
  const [mapelList, setMapelList] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedMapel, setSelectedMapel] = useState("");
  const [selectedTugas, setSelectedTugas] = useState(null);

  const [showTambahTugas, setShowTambahTugas] = useState(false);
  const [showPeserta, setShowPeserta] = useState(false);
  const [showSoal, setShowSoal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // --- Fetch tugas dari backend ---
  const fetchData = async () => {
    try {
      const data = await getTestsByType("tugas"); // backend harus support type tugas
      setTugasList(data);
    } catch (err) {
      console.error("Gagal ambil data tugas:", err);
    }
  };

  const fetchKelas = async () => {
    try {
      const res = await fetchAllkelas();
      setKelasList({ aktif: res.aktif || [] });
    } catch (err) {
      console.error("Gagal ambil kelas:", err);
    }
  };

  useEffect(() => {
    fetchData();
    fetchKelas();
  }, [refreshTrigger]);

  // --- chain kelas → mapel ---
  useEffect(() => {
    const fetchMapel = async () => {
      if (selectedKelas) {
        try {
          const data = await fetchAllMapelByKelas(selectedKelas);
          setMapelList(data);
          setSelectedMapel("");
        } catch (err) {
          console.error("Gagal ambil mapel:", err);
          setMapelList([]);
          setSelectedMapel("");
        }
      } else {
        setMapelList([]);
        setSelectedMapel("");
      }
    };

    fetchMapel();
  }, [selectedKelas]);

  const handleDelete = (tugasID) => {
    Swal.fire({
      title: "Hapus Tugas?",
      text: "Tugas akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTest(tugasID);
          setTugasList((prev) => prev.filter((t) => t.test_id !== tugasID));
          showAlert("Tugas berhasil dihapus.", "success");
        } catch (err) {
          console.error(err);
          showAlert("Gagal menghapus tugas.", "error");
        }
      }
    });
  };

  const handleTambahTugas = async (newTugas) => {
    try {
      await createTest(newTugas);
      setRefreshTrigger((prev) => prev + 1);
      setShowTambahTugas(false);
      showAlert("Tugas berhasil ditambahkan", "success");
    } catch (err) {
      console.error(err);
      showAlert("Gagal menambahkan tugas", "error");
    }
  };

  const filteredTugas = tugasList.filter((t) => {
    const matchKelas = selectedKelas
      ? t.kelas_id === parseInt(selectedKelas)
      : true;
    const matchMapel = selectedMapel
      ? t.mapel_id === parseInt(selectedMapel)
      : true;

    return matchKelas && matchMapel;
  });

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Daftar Tugas
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setRefreshTrigger((prev) => prev + 1)}
            className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowTambahTugas(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Tambah Tugas
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row md:space-x-2 mb-4">
        <select
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
        >
          <option value="">-- Pilih Kelas --</option>
          {kelasList.aktif.map((k) => (
            <option key={k.kelas_id} value={k.kelas_id}>
              {k.kelas_nama}
            </option>
          ))}
        </select>

        <select
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          value={selectedMapel}
          onChange={(e) => setSelectedMapel(e.target.value)}
          disabled={!selectedKelas}
        >
          <option value="">-- Pilih Mapel --</option>
          {mapelList.map((m) => (
            <option key={m.kd_mapel} value={m.kd_mapel}>
              {m.nm_mapel}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Judul</th>
              <th className="px-6 py-3 text-left">Kelas</th>
              <th className="px-6 py-3 text-left">Mapel</th>
              <th className="px-6 py-3 text-left">Guru</th>
              <th className="px-6 py-3 text-left">Deadline</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTugas.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  Tidak ada data tugas.
                </td>
              </tr>
            )}

            {filteredTugas.map((t) => (
              <tr key={t.test_id}>
                <td className="px-6 py-4">{t.judul}</td>
                <td className="px-6 py-4">{t?.kelas?.kelas_nama}</td>
                <td className="px-6 py-4">{t?.mapel?.nm_mapel}</td>
                <td className="px-6 py-4">{t?.guru?.guru_nama}</td>
                <td className="px-6 py-4">
                  {formatTanggalLengkap(t.deadline)}
                </td>
                <td className="px-6 py-4">
                  {t.aktif === 1 ? (
                    <span className="text-green-600 font-semibold">Aktif</span>
                  ) : (
                    <span className="text-red-600 font-semibold">Nonaktif</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    {/* Kelola Soal */}
                    <HiDocumentText
                      className="cursor-pointer hover:text-purple-600 text-xl"
                      onClick={() => {
                        setSelectedTugas(t);
                        setShowSoal(true);
                      }}
                    />

                    {/* Lihat Peserta */}
                    <HiUserGroup
                      className="cursor-pointer hover:text-blue-600 text-xl"
                      onClick={() => {
                        setSelectedTugas(t);
                        setShowPeserta(true);
                      }}
                    />

                    {/* Aktifkan / Nonaktifkan */}
                    <HiPlay
                      className={`cursor-pointer text-xl ${
                        t.aktif === 1
                          ? "text-green-600"
                          : "hover:text-green-600"
                      }`}
                      onClick={async () => {
                        try {
                          const newAktif = t.aktif === 1 ? 0 : 1;
                          await updateTestAktif(t.test_id, newAktif);
                          setTugasList((prev) =>
                            prev.map((item) =>
                              item.test_id === t.test_id
                                ? { ...item, aktif: newAktif }
                                : item
                            )
                          );
                          showAlert(
                            "Status tugas berhasil diperbarui",
                            "success"
                          );
                        } catch (err) {
                          console.error(err);
                          showAlert("Gagal memperbarui status", "error");
                        }
                      }}
                    />

                    {/* Hapus */}
                    <HiTrash
                      className="cursor-pointer hover:text-red-600 text-xl"
                      onClick={() => handleDelete(t.test_id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Slide Tambah Tugas */}
      <SlideTambahTest
        isOpen={showTambahTugas}
        onClose={() => setShowTambahTugas(false)}
        onSubmit={handleTambahTugas}
        type="tugas"
      />

      {/* Slide Peserta */}
      <SlidePeserta
        isOpen={showPeserta}
        onClose={() => setShowPeserta(false)}
        test={selectedTugas}
      />

      {/* Slide Tambah Soal */}
      <SlideTambahSoal
        isOpen={showSoal}
        onClose={() => setShowSoal(false)}
        test={selectedTugas}
      />
    </div>
  );
};

export default TugasList;
