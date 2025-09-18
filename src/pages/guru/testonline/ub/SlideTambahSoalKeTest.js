import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import {
  fetchBankSoalByKelasMapel,
  addSoalToTest,
  removeSoalFromTest,
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

      setSelectedSoal((prev) => prev.filter((id) => id !== soalId));
      setExistingSelections((prev) => prev.filter((id) => id !== soalId));

      showToast("Soal berhasil dihapus dari test", "success");
    } catch (err) {
      console.error(err);
      showToast("Gagal menghapus soal dari test", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimpan = async () => {
    const newSelections = selectedSoal.filter(
      (id) => !existingSelections.includes(id)
    );

    if (newSelections.length === 0) {
      showToast("Tidak ada soal baru yang dipilih", "info");
      return;
    }

    try {
      setIsLoading(true);
      await addSoalToTest(test.test_id, newSelections);
      showToast("Soal berhasil ditambahkan ke test", "success");
      setExistingSelections(selectedSoal);
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

  const getSoalStatus = (soalId) => {
    if (selectedSoal.includes(soalId) && existingSelections.includes(soalId)) {
      return "already-selected";
    } else if (selectedSoal.includes(soalId)) {
      return "newly-selected";
    } else {
      return "not-selected";
    }
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
            {/* Header */}
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center bg-blue-50 dark:bg-blue-900/20">
              <div>
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Kelola Soal Test
                </h2>
                <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                  {test?.mapel?.nm_mapel || "-"} -{" "}
                  {test?.kelas?.kelas_nama || "-"}
                  <span className="font-medium">
                    {" "}
                    ({test?.judul || "Test"})
                  </span>
                </p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Info Panel */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      Status Soal
                    </p>
                    <p className="text-lg font-bold">
                      {selectedSoal.length} soal dipilih (
                      {existingSelections.length} sudah ada di test)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                      Perubahan
                    </p>
                    <p className="text-lg font-bold">
                      {selectedSoal.length - existingSelections.length > 0
                        ? "+"
                        : ""}
                      {selectedSoal.length - existingSelections.length} soal
                      baru
                    </p>
                  </div>
                </div>
              </div>

              {selectedSoal.length > existingSelections.length && (
                <div className="mb-4 flex justify-end">
                  <button
                    onClick={() => setSelectedSoal(existingSelections)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800 text-sm"
                  >
                    Batalkan Perubahan
                  </button>
                </div>
              )}

              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  <p className="ml-3 text-gray-600 dark:text-gray-400">
                    Memuat data soal...
                  </p>
                </div>
              ) : bankSoal.length === 0 ? (
                <div className="text-center py-10 text-gray-500 dark:text-gray-400">
                  <svg
                    className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <p className="text-lg font-medium">Tidak ada soal tersedia</p>
                  <p className="text-sm">
                    Bank soal untuk kelas dan mapel ini masih kosong
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Pertanyaan
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                          Tipe
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
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
                              status === "already-selected"
                                ? "bg-blue-50 dark:bg-blue-900/20"
                                : ""
                            }`}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              {status === "already-selected" && (
                                <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  Sudah Dipilih
                                </span>
                              )}
                              {status === "newly-selected" && (
                                <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                  Baru Dipilih
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 dark:text-white line-clamp-2">
                                {s.pertanyaan
                                  .replace(/<[^>]*>/g, "")
                                  .slice(0, 80)}
                                ...
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-2 py-1 rounded text-xs ${getBadgeColor(
                                  s.tipe_soal
                                )}`}
                              >
                                {s.tipe_soal}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {status === "already-selected" ? (
                                <button
                                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-sm"
                                  onClick={() => handleHapusSoal(s.soal_id)}
                                  disabled={isLoading}
                                >
                                  Hapus
                                </button>
                              ) : (
                                <button
                                  className={`px-3 py-1 rounded text-sm ${
                                    status === "newly-selected"
                                      ? "bg-orange-600 text-white hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800"
                                      : "bg-green-600 text-white hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                                  }`}
                                  onClick={() => handleToggle(s.soal_id)}
                                  disabled={isLoading}
                                >
                                  {status === "newly-selected"
                                    ? "Batal"
                                    : "Pilih"}
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

            {/* Footer */}
            <div className="px-6 py-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex justify-end space-x-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={handleSimpan}
                disabled={
                  isLoading || selectedSoal.length === existingSelections.length
                }
              >
                {isLoading
                  ? "Menyimpan..."
                  : `Simpan (${
                      selectedSoal.length - existingSelections.length
                    })`}
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SlideTambahSoalKeTest;
