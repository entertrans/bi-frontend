import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  fetchBankSoalByKelasMapel,
  addSoalToTest,
  removeSoalFromTest
} from "../../../../api/testOnlineAPI";
import { showToast } from "../../../../utils/toast";

const SlideTambahSoalKeTest = ({ isOpen, onClose, test }) => {
  const [bankSoal, setBankSoal] = useState([]);
  const [selectedSoal, setSelectedSoal] = useState([]);
  const [existingSelections, setExistingSelections] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && test) {
      setIsLoading(true);
      fetchBankSoalByKelasMapel(test.kelas_id, test.mapel_id, test.test_id)
        .then((response) => {
          setBankSoal(response.data.soals || []);
          setExistingSelections(response.data.selected_soal_ids || []);
          // Set selectedSoal dengan soal yang sudah ada di test
          setSelectedSoal(response.data.selected_soal_ids || []);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
          showToast("Gagal memuat bank soal", "error");
        });
    }
  }, [isOpen, test]);

  const handleToggle = (soalId) => {
    setSelectedSoal((prev) =>
      prev.includes(soalId)
        ? prev.filter((id) => id !== soalId)
        : [...prev, soalId]
    );
  };

  const handleHapusSoal = async (soalId) => {
    try {
      setIsLoading(true);
      await removeSoalFromTest(test.test_id, soalId);
      
      // Update state
      setSelectedSoal(prev => prev.filter(id => id !== soalId));
      setExistingSelections(prev => prev.filter(id => id !== soalId));
      
      showToast("Soal berhasil dihapus dari test", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus soal dari test", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimpan = async () => {
    // Cari soal yang baru ditambahkan (belum ada di existingSelections)
    const newSelections = selectedSoal.filter(id => !existingSelections.includes(id));
    
    if (newSelections.length === 0) {
      showToast("Tidak ada soal baru yang dipilih", "info");
      return;
    }

    try {
      setIsLoading(true);
      await addSoalToTest(test.test_id, newSelections);
      showToast("Soal berhasil ditambahkan ke test", "success");
      setExistingSelections(selectedSoal); // Update existing selections
      onClose();
    } catch (err) {
      console.error(err);
      showToast("Gagal menambahkan soal ke test", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedSoal([]);
    setExistingSelections([]);
    onClose();
  };

  // Fungsi untuk menentukan status soal
  const getSoalStatus = (soalId) => {
    if (selectedSoal.includes(soalId) && existingSelections.includes(soalId)) {
      return "already-selected"; // Sudah ada di database
    } else if (selectedSoal.includes(soalId)) {
      return "newly-selected"; // Baru dipilih tapi belum disimpan
    } else {
      return "not-selected"; // Belum dipilih
    }
  };

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={handleClose}
        ></div>

        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="relative bg-white dark:bg-gray-800 w-full max-w-4xl h-full shadow-xl"
        >
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-bold text-lg dark:text-white">
                Kelola Soal untuk {test?.mapel?.nm_mapel || "-"}{" "}
                {test?.kelas?.kelas_nama || "-"} ({test?.judul || "Test"})
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="mb-4 flex justify-between items-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedSoal.length} soal dipilih ({existingSelections.length} sudah ada di test)
                </p>
                {selectedSoal.length > 0 && (
                  <button
                    onClick={() => setSelectedSoal(existingSelections)} // Reset ke keadaan semula
                    className="text-sm text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Batalkan perubahan
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : bankSoal.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  Tidak ada soal tersedia di bank soal untuk kelas dan mapel ini
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Pertanyaan
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Tipe
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {bankSoal.map((s) => {
                        const status = getSoalStatus(s.soal_id);
                        return (
                          <tr
                            key={s.soal_id}
                            className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${
                              status === "already-selected" ? "bg-blue-50 dark:bg-blue-900/20" : ""
                            }`}
                          >
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {status === "already-selected" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Sudah Dipilih
                                </span>
                              )}
                              {status === "newly-selected" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Baru Dipilih
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                              {s.pertanyaan.slice(0, 50)}...
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                {s.tipe_soal}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              {status === "already-selected" ? (
                                <button
                                  className="px-3 py-1 rounded text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 transition-colors"
                                  onClick={() => handleHapusSoal(s.soal_id)}
                                  disabled={isLoading}
                                >
                                  Hapus
                                </button>
                              ) : (
                                <button
                                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                    status === "newly-selected"
                                      ? "bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-200 dark:hover:bg-orange-800"
                                      : "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200 dark:hover:bg-green-800"
                                  }`}
                                  onClick={() => handleToggle(s.soal_id)}
                                  disabled={isLoading}
                                >
                                  {status === "newly-selected" ? "Batalkan" : "Pilih"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="px-4 py-3 border-t dark:border-gray-700 flex justify-end space-x-2">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                onClick={handleSimpan}
                disabled={isLoading || selectedSoal.length === existingSelections.length}
              >
                {isLoading ? "Menyimpan..." : `Simpan Perubahan (${selectedSoal.length - existingSelections.length})`}
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SlideTambahSoalKeTest;