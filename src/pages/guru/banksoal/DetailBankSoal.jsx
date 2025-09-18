import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAllBankSoal, deleteSoal } from "../../../api/bankSoalAPI";
import { fetchDetailKelasMapel } from "../../../api/siswaAPI";
import LampiranRenderer from "../../../utils/LampiranRenderer";
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
  const [isLoading, setIsLoading] = useState(true);

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
      setIsLoading(true);
      const data = await getAllBankSoal(kelas, mapel);
      setDataSoal(data);
    } catch (err) {
      console.error("Gagal ambil data bank soal:", err);
      showAlert("Gagal memuat data bank soal", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLookup();
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          await deleteSoal(soalID);
          setDataSoal((prev) => prev.filter((s) => s.soal_id !== soalID));
          showAlert("Soal berhasil dihapus.", "success");
        } catch (err) {
          console.error(err);
          showAlert("Gagal menghapus soal.", "error");
        }
      }
    });
  };

  const getBadgeColor = (tipeSoal) => {
    switch (tipeSoal) {
      case "pilihan_ganda":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "uraian":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "isian_singkat":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "true_false":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Header */}
      <div className="flex items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          Detail Bank Soal
        </h1>
        <button
          onClick={() => setShowTambahSoal(true)}
          className="ml-auto bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
        >
          <HiPlus className="text-lg" />
          Tambah Soal
        </button>
      </div>

      {/* Info Kelas dan Mapel */}
      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Kelas
            </p>
            <p className="text-lg font-bold">
              {kelasInfo?.kelas_nama || `Kelas ${kelas}`}
            </p>
          </div>
          <div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
              Mata Pelajaran
            </p>
            <p className="text-lg font-bold">
              {mapelInfo?.nm_mapel || `Mapel ${mapel}`}
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            Memuat data bank soal...
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Tipe Soal
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pertanyaan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Lampiran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Bobot
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Pembuat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dataSoal.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-8 text-gray-500 dark:text-gray-400"
                  >
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-lg font-medium">Belum ada soal</p>
                      <p className="text-sm">
                        Klik "Tambah Soal" untuk menambahkan soal pertama
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                dataSoal.map((soal) => (
                  <tr
                    key={soal.soal_id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${getBadgeColor(
                          soal.tipe_soal
                        )}`}
                      >
                        {soal.tipe_soal}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div
                        className="line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: soal.pertanyaan }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <LampiranRenderer
                        lampiran={soal.lampiran}
                        soalId={soal.soal_id}
                      />
                    </td>
                    <td className="px-6 py-4 font-bold">{soal.bobot}</td>
                    <td className="px-6 py-4">{soal.guru.guru_nama}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1">
                          <HiPencil size={18} title="Edit Soal" />
                        </button>
                        <button
                          onClick={() => handleDelete(soal.soal_id)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                        >
                          <HiTrash size={18} title="Hapus Soal" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <SlideTambahBankSoal
        isOpen={showTambahSoal}
        onClose={() => {
          setShowTambahSoal(false);
          fetchData();
        }}
        kelas={kelasInfo}
        mapel={mapelInfo}
      />
    </div>
  );
};

export default DetailBankSoal;
