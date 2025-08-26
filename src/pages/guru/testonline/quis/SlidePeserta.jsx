import React, { useState, useEffect } from "react";
import {
  getPesertaByTest,
  addPeserta,
  deletePeserta,
} from "../../../../api/testOnlineAPI";
import { searchSiswa } from "../../../../api/siswaAPI"; // Pastikan ada API ini
import { HiTrash, HiPlus, HiX } from "react-icons/hi";
import { showAlert } from "../../../../utils/toast";

const SlidePeserta = ({ isOpen, onClose, test }) => {
  const [peserta, setPeserta] = useState([]);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Animasi
  const [isMounted, setIsMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setShowPanel(true), 10);
      loadPeserta();
    } else {
      setShowPanel(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [isOpen]);

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
    if (query.trim().length < 4) {
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
      // Kirim semua siswa yang dipilih sekaligus
      const promises = selectedSiswa.map((siswa) =>
        addPeserta({
          test_id: test.test_id,
          siswa_nis: siswa.nis, // Sesuaikan dengan field yang diharapkan API
        })
      );

      await Promise.all(promises);
      showAlert("Peserta berhasil ditambahkan", "success");
      setSelectedSiswa([]);
      setQuery("");
      setSearchResults([]);
      loadPeserta(); // Refresh daftar peserta
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
      loadPeserta(); // Refresh daftar peserta
    } catch (err) {
      console.error("Gagal menghapus peserta:", err);
      showAlert("Gagal menghapus peserta", "error");
    }
  };

  const handleClose = () => {
    setShowPanel(false);
    setTimeout(() => {
      setIsMounted(false);
      setSelectedSiswa([]);
      setQuery("");
      setSearchResults([]);
      onClose();
    }, 300);
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-2xl z-50 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 transform ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Peserta Test: {test?.judul}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kelas: {test?.kelas?.kelas_nama} | {test?.mapel?.nm_mapel}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-red-600 text-xl font-bold p-2"
            >
              <HiX size={24} />
            </button>
          </div>

          {/* Bagian Atas: Daftar Siswa yang Akan Ditambahkan */}
          <div className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">
              Siswa yang akan ditambahkan
            </h3>
            
            {selectedSiswa.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                Belum ada siswa yang dipilih
              </p>
            ) : (
              <div className="space-y-2">
                {selectedSiswa.map((siswa) => (
                  <div
                    key={siswa.nis}
                    className="flex justify-between items-center bg-white dark:bg-gray-600 p-3 rounded border"
                  >
                    <div>
                      <p className="font-medium">{siswa.nama}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        NIS: {siswa.nis} | Kelas: {siswa.kelas_nama || "-"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemoveSiswa(siswa.nis)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <HiTrash size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedSiswa.length > 0 && (
              <div className="mt-4 text-right">
                <button
                  onClick={handleTambahPeserta}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                >
                  {isLoading ? "Menambahkan..." : "Tambahkan Peserta"}
                </button>
              </div>
            )}
          </div>

          {/* Bagian Tengah: Pencarian Siswa */}
          <div className="mb-6">
            <h3 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">
              Cari Siswa
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                placeholder="Ketik minimal 4 huruf untuk mencari siswa..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                value={query}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery(val);
                  if (val.trim().length >= 4) {
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
              <button
                onClick={handleSearch}
                disabled={query.trim().length < 4 || isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {isLoading ? "Mencari..." : "Cari"}
              </button>
            </div>

            {/* Hasil Pencarian */}
            {query.trim().length >= 4 && (
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md max-h-60 overflow-y-auto">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    {isLoading ? "Mencari..." : "Tidak ada hasil ditemukan"}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-600">
                    {searchResults.map((siswa) => (
                      <div
                        key={siswa.nis}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => handleAddSiswa(siswa)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{siswa.nama}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              NIS: {siswa.nis} | Kelas: {siswa.kelas_nama || "-"}
                            </p>
                          </div>
                          <HiPlus className="text-green-600" size={18} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bagian Bawah: Daftar Peserta Saat Ini */}
          <div className="flex-1 overflow-hidden">
            <h3 className="text-md font-semibold mb-3 text-gray-800 dark:text-white">
              Daftar Peserta Saat Ini ({peserta.length})
            </h3>
            
            {peserta.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 italic text-sm">
                Belum ada peserta yang ditambahkan
              </p>
            ) : (
              <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
                <div className="max-h-60 overflow-y-auto">
                  {peserta.map((p) => (
                    <div
                      key={p.peserta_id}
                      className="p-3 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{p.siswa?.siswa_nama || "Nama tidak tersedia"}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            NIS: {p.siswa_nis} | Status: {p.status}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeletePeserta(p.peserta_id)}
                          className="text-red-600 hover:text-red-800 p-1"
                          disabled={isLoading}
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
    </>
  );
};

export default SlidePeserta;