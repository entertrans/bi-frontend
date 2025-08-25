import React, { useEffect, useState } from "react";
import { getInActiveBankSoal, restoreSoal } from "../../../api/bankSoalAPI";
import { HiTrash, HiRefresh } from "react-icons/hi";
import Swal from "sweetalert2";
import { showAlert } from "../../../utils/toast";

const BankSoalTrash = () => {
  const [dataSoal, setDataSoal] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      const data = await getInActiveBankSoal();
      setDataSoal(data);
    } catch (err) {
      console.error("Gagal ambil data inactive soal:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRestore = (soalID) => {
    Swal.fire({
      title: "Aktifkan Soal?",
      text: "Soal ini akan dikembalikan ke bank soal aktif.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, aktifkan!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await restoreSoal(soalID);
          setDataSoal((prev) => prev.filter((s) => s.soal_id !== soalID));
          showAlert("Soal berhasil diaktifkan.", "success");
        } catch (err) {
          console.error(err);
          showAlert("Gagal mengaktifkan soal.", "error");
        }
      }
    });
  };

  const handleDeletePermanent = (soalID) => {
    Swal.fire({
      title: "Hapus Permanen?",
      text: "Soal ini akan dihapus selamanya dan tidak bisa dikembalikan.",
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
          // TODO: bikin API delete permanent di testOnlineAPI.js
          // await deleteSoalPermanen(soalID);
          setDataSoal((prev) => prev.filter((s) => s.soal_id !== soalID));
          showAlert("Soal berhasil dihapus permanen.", "success");
        } catch (err) {
          console.error(err);
          showAlert("Gagal menghapus soal.", "error");
        }
      }
    });
  };

  const filteredData = dataSoal.filter(
    (soal) =>
      soal.pertanyaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      soal.mapel?.nm_mapel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      soal.kelas?.kelas_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      soal.guru?.guru_nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
        Bank Soal Tidak Aktif
      </h1>

      <input
        type="text"
        placeholder="Cari soal / mapel / guru..."
        className="mb-4 p-2 border rounded w-full md:w-80 dark:bg-gray-700 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Kelas</th>
              <th className="px-6 py-3 text-left">Mapel</th>
              <th className="px-6 py-3 text-left">Pembuat</th>
              <th className="px-6 py-3 text-left">Tipe Soal</th>
              <th className="px-6 py-3 text-left">Pertanyaan</th>
              <th className="px-6 py-3 text-left">Lampiran</th>
              <th className="px-6 py-3 text-left">Bobot</th>
              <th className="px-6 py-3 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Tidak ada soal tidak aktif.
                </td>
              </tr>
            )}

            {filteredData.map((soal) => (
              <tr key={soal.soal_id}>
                <td className="px-6 py-4">
                  {soal.kelas?.kelas_nama.replace(/^Kelas\s*/i, "")}
                </td>
                <td className="px-6 py-4">{soal.mapel?.nm_mapel}</td>
                <td className="px-6 py-4">{soal.guru?.guru_nama}</td>
                <td className="px-6 py-4">{soal.tipe_soal}</td>
                <td
                  className="px-6 py-4 truncate max-w-xs"
                  dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
                />
                <td className="px-6 py-4">
                  {soal.lampiran ? (
                    <img
                      src={`http://localhost:8080/${soal.lampiran.path_file}`}
                      alt="lampiran"
                      className="w-12 h-12 object-cover rounded border"
                    />
                  ) : (
                    <span className="text-gray-400 text-sm">-</span>
                  )}
                </td>
                <td className="px-6 py-4">{soal.bobot}</td>
                <td className="px-6 py-4">
                  <div className="flex space-x-2">
                    <HiRefresh
                      title="Aktifkan kembali"
                      className="inline-block cursor-pointer hover:text-green-600 text-lg"
                      onClick={() => handleRestore(soal.soal_id)}
                    />
                    <HiTrash
                      title="Hapus Permanen"
                      className="inline-block cursor-pointer hover:text-red-600 text-lg"
                      onClick={() => handleDeletePermanent(soal.soal_id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BankSoalTrash;
