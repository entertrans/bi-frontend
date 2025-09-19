import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  getPesertaByTest,
  addPeserta,
  deletePeserta,
} from "../../../../api/testOnlineAPI";
import { searchSiswa } from "../../../../api/siswaAPI";
import { HiTrash, HiPlus, HiX, HiSearch } from "react-icons/hi";
import { showAlert } from "../../../../utils/toast";

const SlidePeserta = ({ isOpen, onClose, test }) => {
  const [peserta, setPeserta] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPeserta();
    }
  }, [isOpen, test]);

  const loadPeserta = async () => {
    try {
      const data = await getPesertaByTest(test.test_id);
      setPeserta(data);
    } catch (err) {
      console.error("Gagal memuat peserta:", err);
      showAlert("Gagal memuat peserta", "error");
    }
  };

  const handleSearch = async () => {
    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchSiswa(query);
      const data = Array.isArray(results)
        ? results
        : Array.isArray(results?.data)
        ? results.data
        : [];

      // Filter siswa yang sudah menjadi peserta
      const filteredData = data.filter(
        (siswa) =>
          !peserta.some((p) => p.siswa_nis === siswa.nis) &&
          !selectedSiswa.some((s) => s.nis === siswa.nis)
      );

      setSearchResults(filteredData);
    } catch (error) {
      console.error("Gagal mencari siswa:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSiswa = (siswa) => {
    const sudahAda = selectedSiswa.find((s) => s.nis === siswa.nis);
    if (!sudahAda) {
      setSelectedSiswa([...selectedSiswa, siswa]);
    }
  };

  const handleRemoveSiswa = (nis) => {
    setSelectedSiswa(selectedSiswa.filter((s) => s.nis !== nis));
  };

  const handleTambahPeserta = async () => {
    if (selectedSiswa.length === 0) {
      showAlert("Pilih siswa terlebih dahulu", "warning");
      return;
    }

    try {
      setIsLoading(true);
      const promises = selectedSiswa.map((siswa) =>
        addPeserta({
          test_id: test.test_id,
          siswa_nis: siswa.nis,
        })
      );

      await Promise.all(promises);
      showAlert("Peserta berhasil ditambahkan", "success");
      setSelectedSiswa([]);
      setQuery("");
      setSearchResults([]);
      loadPeserta();
    } catch (err) {
      console.error("Gagal menambahkan peserta:", err);
      showAlert("Gagal menambahkan peserta", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePeserta = async (pesertaId) => {
    try {
      await deletePeserta(pesertaId);
      showAlert("Peserta dihapus", "success");
      loadPeserta();
    } catch (err) {
      console.error("Gagal menghapus peserta:", err);
      showAlert("Gagal menghapus peserta", "error");
    }
  };

  const handleClose = () => {
    setSelectedSiswa([]);
    setQuery("");
    setSearchResults([]);
    onClose();
  };

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* Overlay */}
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          ></div>
        </Transition.Child>

        {/* Panel */}
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="relative bg-white dark:bg-gray-800 w-full max-w-2xl h-full shadow-xl"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  Kelola Peserta Test
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

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Selected Students Section */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <h3 className="text-md font-semibold mb-3 text-blue-800 dark:text-blue-200">
                  Siswa yang Akan Ditambahkan
                </h3>

                {selectedSiswa.length === 0 ? (
                  <p className="text-blue-600 dark:text-blue-300 italic text-sm">
                    Belum ada siswa yang dipilih
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedSiswa.map((siswa) => (
                      <div
                        key={siswa.nis}
                        className="flex justify-between items-center bg-white dark:bg-gray-700 p-3 rounded-lg border border-blue-200 dark:border-blue-700"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 dark:text-white">
                            {siswa.nama}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            NIS: {siswa.nis} | Kelas: {siswa.kelas || "-"}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveSiswa(siswa.nis)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 ml-2"
                          title="Hapus dari list"
                        >
                          <HiTrash size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSiswa.length > 0 && (
                  <div className="mt-4">
                    <button
                      onClick={handleTambahPeserta}
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? "Menambahkan..." : `Tambahkan ${selectedSiswa.length} Peserta`}
                    </button>
                  </div>
                )}
              </div>

              {/* Search Section */}
              <div>
                <h3 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">
                  Cari Siswa
                </h3>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1 relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Cari siswa dengan NIS atau nama..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={query}
                      onChange={(e) => {
                        const val = e.target.value;
                        setQuery(val);
                        if (val.trim().length >= 3) {
                          handleSearch();
                        } else {
                          setSearchResults([]);
                        }
                      }}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={query.trim().length < 3 || isLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    <HiSearch size={16} />
                    {isLoading ? "Mencari..." : "Cari"}
                  </button>
                </div>

                {/* Search Results */}
                {query.trim().length >= 3 && (
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                    {searchResults.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        {isLoading ? "Mencari siswa..." : "Tidak ada hasil ditemukan"}
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-200 dark:divide-gray-600">
                        {searchResults.map((siswa) => (
                          <div
                            key={siswa.nis}
                            className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer transition-colors"
                            onClick={() => handleAddSiswa(siswa)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 dark:text-white">
                                  {siswa.nama}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  NIS: {siswa.nis} | Kelas: {siswa.kelas || "-"}
                                </p>
                              </div>
                              <HiPlus className="text-green-600 dark:text-green-400" size={18} />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Current Participants Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-md font-semibold text-gray-800 dark:text-white">
                    Daftar Peserta Saat Ini
                  </h3>
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                    {peserta.length} peserta
                  </span>
                </div>

                {peserta.length === 0 ? (
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center">
                    <p className="text-gray-500 dark:text-gray-400 italic">
                      Belum ada peserta yang ditambahkan
                    </p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                    <div className="max-h-60 overflow-y-auto">
                      {peserta.map((p) => (
                        <div
                          key={p.peserta_id}
                          className="p-4 border-b border-gray-200 dark:border-gray-600 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                        >
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 dark:text-white">
                                {p.siswa?.siswa_nama || "Nama tidak tersedia"}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                NIS: {p.siswa_nis}
                              </p>
                              <span className={`inline-block px-2 py-1 rounded text-xs mt-1 ${
                                p.status === 'submitted' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                  : p.status === 'in_progress'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'
                              }`}>
                                {p.status || 'not_started'}
                              </span>
                            </div>
                            <button
                              onClick={() => handleDeletePeserta(p.peserta_id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 ml-2"
                              disabled={isLoading}
                              title="Hapus peserta"
                            >
                              <HiTrash size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SlidePeserta;