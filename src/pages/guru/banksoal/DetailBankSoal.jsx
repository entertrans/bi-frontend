import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllBankSoal } from "../../../api/bankSoalAPI";
import { fetchDetailKelasMapel } from "../../../api/siswaAPI"; // ⬅️ tambahkan ini
import { HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import SlideTambahBankSoal from "./SlideTambahBankSoal";
import Swal from "sweetalert2";
import { showAlert } from "../../../utils/toast";

const DetailBankSoal = () => {
  const { kelas, mapel } = useParams();
  const [dataSoal, setDataSoal] = useState([]);
  const [showTambahSoal, setShowTambahSoal] = useState(false);
  const [kelasInfo, setKelasInfo] = useState(null);
  const [mapelInfo, setMapelInfo] = useState(null);

  const fetchLookup = async () => {
    try {
      const res = await fetchDetailKelasMapel(kelas, mapel);
      setKelasInfo(res.data.kelas);
      setMapelInfo(res.data.mapel);
    } catch (err) {
      console.error("Gagal ambil detail kelas/mapel:", err);
    }
  };

  const fetchData = async () => {
    try {
      const data = await getAllBankSoal(kelas, mapel);
      setDataSoal(data);
    } catch (err) {
      console.error("Gagal ambil data bank soal:", err);
    }
  };

  useEffect(() => {
    fetchLookup();
    fetchData();
  }, [kelas, mapel]);

  const handleDelete = (soalID) => {
    Swal.fire({
      title: "Hapus Soal?",
      text: "Soal akan dihapus permanen dari bank soal.",
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
          // TODO: panggil API hapus
          setDataSoal((prev) => prev.filter((s) => s.soal_id !== soalID));
          showAlert("Soal berhasil dihapus.", "success");
        } catch (err) {
          console.error(err);
          showAlert("Gagal menghapus soal.", "error");
        }
      }
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Detail Bank Soal - {kelasInfo?.nm_kelas || `Kelas ${kelas}`} |{" "}
          {mapelInfo?.nm_mapel || `Mapel ${mapel}`}
        </h1>
        <button
          onClick={() => setShowTambahSoal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <HiPlus className="text-lg" />
          Tambah Soal
        </button>
      </div>

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
            {dataSoal.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-500">
                  Belum ada soal untuk kelas & mapel ini.
                </td>
              </tr>
            )}

            {dataSoal.map((soal) => (
              <tr key={soal.soal_id}>
                <td className="px-6 py-4">{soal.kelas.kelas_nama}</td>
                <td className="px-6 py-4">{soal.mapel.nm_mapel}</td>
                <td className="px-6 py-4">{soal.guru.guru_nama}</td>
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
                    <HiPencil
                      title="Edit Soal"
                      className="inline-block cursor-pointer hover:text-blue-600 text-lg"
                    />
                    <HiTrash
                      title="Hapus Soal"
                      className="inline-block cursor-pointer hover:text-red-600 text-lg"
                      onClick={() => handleDelete(soal.soal_id)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SlideTambahBankSoal
        isOpen={showTambahSoal}
        onClose={() => {
          setShowTambahSoal(false);
          fetchData(); // refresh setelah tambah
        }}
        kelas={kelasInfo}
        mapel={mapelInfo}
      />
    </div>
  );
};

export default DetailBankSoal;
