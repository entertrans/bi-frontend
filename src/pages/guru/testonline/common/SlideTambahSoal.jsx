import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { HiX, HiPencil, HiTrash, HiPlus } from "react-icons/hi";
import LampiranRenderer from "../../../../utils/LampiranRenderer";
import {
  getTestSoalByTestId,
  deleteTestSoal,
} from "../../../../api/testOnlineAPI";
import Swal from "sweetalert2";
import SlideFormTambahSoal from "./SlideFormTambahSoal";
import { showAlert } from "../../../../utils/toast";
import { removeHTMLTags } from "../../../../utils/format";

const SlideTambahSoal = ({ isOpen, onClose, test }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [soalList, setSoalList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setShowPanel(true), 10);
      fetchSoal();
    } else {
      setShowPanel(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [isOpen, test]);

  const fetchSoal = async () => {
    try {
      if (!test?.test_id) return;
      setIsLoading(true);
      const response = await getTestSoalByTestId(test.test_id);

      if (response.success) {
        setSoalList(response.data || []);
      } else {
        console.error("Gagal ambil soal:", response.message);
        setSoalList([]);
      }
    } catch (err) {
      console.error("Gagal ambil soal:", err);
      setSoalList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setShowPanel(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAddSoal = () => {
    setSelectedSoal(null);
    setShowForm(true);
  };


  const handleDeleteSoal = (soal) => {
    Swal.fire({
      title: "Yakin hapus soal?",
      text: "Soal ini akan dihapus permanen dari quis",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteTestSoal(soal.testsoal_id);

          if (response.success) {
            showAlert("Soal berhasil dihapus.", "success");
            fetchSoal();
          } else {
            showAlert("Soal gagal dihapus", "error");
          }
        } catch (error) {
          console.error("Error deleting soal:", error);
          showAlert("Soal gagal dihapus", "error");
        }
      }
    });
  };

  const getBadgeColor = (tipeSoal) => {
    switch (tipeSoal) {
      case "pg":
      case "pg_kompleks":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "uraian":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "isian_singkat":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "bs":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "matching":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  if (!isMounted) return null;

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={handleClose}
        ></div>

        {/* Panel Slide */}
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="relative bg-white dark:bg-gray-800 w-full max-w-5xl h-full shadow-xl"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Kelola Soal Test
                </h2>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  {test?.judul} - {test?.mapel?.nm_mapel || "Mata Pelajaran"}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            {/* Action Bar */}
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total: {soalList.length} soal
              </p>
              <button
                onClick={handleAddSoal}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded flex items-center gap-2"
              >
                <HiPlus className="w-4 h-4" />
                Tambah Soal
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">
                    Memuat soal...
                  </p>
                </div>
              ) : soalList.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <HiPlus className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Belum ada soal
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Tambahkan soal pertama untuk test ini
                  </p>
                  <button
                    onClick={handleAddSoal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    Tambah Soal Pertama
                  </button>
                </div>
              ) : (
                <div className="p-6">
                  <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            No
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Tipe
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Pertanyaan
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Lampiran
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Kunci Jawaban
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {soalList.map((soal, index) => (
                          <tr key={soal.testsoal_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 rounded text-xs ${getBadgeColor(soal.tipe_soal)}`}>
                                {soal.tipe_soal?.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                              <div className="line-clamp-2">
                                {removeHTMLTags(soal.pertanyaan)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <LampiranRenderer
                                lampiran={soal.lampiran}
                                soalId={soal.testsoal_id}
                              />
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900 dark:text-white max-w-xs">
                              <div className="line-clamp-2">
                                {soal.tipe_soal === "bs" ? (
                                  <ul className="list-disc list-inside">
                                    {soal.jawaban_benar?.map((jawaban, i) => (
                                      <li key={i} className="mb-1">
                                        {soal.pilihan_jawaban?.[i]?.teks ||
                                          `Pernyataan ${i + 1}`}{" "}
                                        :{" "}
                                        <span
                                          className={`font-semibold ${
                                            jawaban === "Benar"
                                              ? "text-green-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {jawaban}
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                ) : soal.tipe_soal === "matching" ? (
                                  <ul className="list-disc list-inside">
                                    {soal.pilihan_jawaban?.map((pair, i) => (
                                      <li key={i}>
                                        {removeHTMLTags(
                                          pair.left || pair.leftLampiran?.path_file
                                        )}{" "}
                                        ↔️{" "}
                                        {removeHTMLTags(
                                          pair.right || pair.rightLampiran?.path_file
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                ) : Array.isArray(soal.jawaban_benar) ? (
                                  soal.jawaban_benar
                                    .map((jawaban) => removeHTMLTags(jawaban))
                                    .join(", ")
                                ) : (
                                  removeHTMLTags(soal.jawaban_benar)
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => handleDeleteSoal(soal)}
                                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1"
                                  title="Hapus Soal"
                                >
                                  <HiTrash size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Transition.Child>
      </div>

      {/* Form Modal */}
      <SlideFormTambahSoal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        test={test}
        soal={selectedSoal}
        onSuccess={fetchSoal}
      />
    </Transition>
  );
};

export default SlideTambahSoal;