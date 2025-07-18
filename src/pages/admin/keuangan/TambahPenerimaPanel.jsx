import React, { useState, useEffect } from "react";
import { searchSiswa, tambahPenerimaInvoice } from "../../../api/siswaAPI";
import { showToast, showAlert } from "../../../utils/toast";

const TambahPenerimaPanel = ({
  invoiceId,
  onClose,
  onSubmit,
  penerimaList = [],
}) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState([]);

  // Animasi muncul dan keluar
  const [isMounted, setIsMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setTimeout(() => setShowPanel(true), 10);
  }, []);

  const handleClose = () => {
    setShowPanel(false);
    setTimeout(() => {
      setIsMounted(false);
      onClose();
    }, 300);
  };

  const handleSearch = async () => {
    if (query.trim().length < 2) return;
    try {
      const results = await searchSiswa(query);
      const data = Array.isArray(results)
        ? results
        : Array.isArray(results?.data)
        ? results.data
        : [];
      setSearchResults(data);
    } catch (error) {
      setSearchResults([]);
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

  const handleSubmit = async () => {
    try {
      const payload = selectedSiswa.map((s) => ({ nis: s.nis }));
      await tambahPenerimaInvoice(invoiceId, payload);
      showToast("Berhasil menambahkan penerima.");
      onSubmit();
      handleClose();
    } catch (err) {
      showAlert("Gagal menambahkan penerima.");
    }
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
        className={`fixed top-0 right-0 h-full w-full max-w-xl z-50 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 transform ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">
              Tambah Penerima
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          {/* Bagian Atas: Daftar Pilihan */}
          <div className="mb-4">
            <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-white">
              Siswa yang akan ditambahkan
            </h3>
            <div className="overflow-x-auto mb-2">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">NIS</th>
                    <th className="px-6 py-3 text-left">Nama</th>
                    <th className="px-6 py-3 text-left">Kelas</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {selectedSiswa.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center italic text-gray-500 dark:text-gray-400"
                      >
                        Silakan tambahkan siswa
                      </td>
                    </tr>
                  ) : (
                    selectedSiswa.map((siswa) => (
                      <tr key={siswa.nis}>
                        <td className="px-6 py-4">{siswa.nis}</td>
                        <td className="px-6 py-4">{siswa.nama}</td>
                        <td className="px-6 py-4">
                          {siswa.kelas?.replace(/^Kelas\s*/i, "") || "-"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleRemoveSiswa(siswa.nis)}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 text-xs rounded shadow"
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Tombol Simpan */}
            <div className="text-right mb-4">
              <button
                onClick={handleSubmit}
                disabled={selectedSiswa.length === 0}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-sm rounded shadow disabled:opacity-50"
              >
                Simpan
              </button>
            </div>
          </div>

          {/* Bagian Bawah: Cari Siswa */}
          <div className="mb-2">
            <h3 className="text-md font-semibold mb-2 text-gray-700 dark:text-white">
              List Siswa
            </h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Cari nama siswa..."
                className="w-full px-4 py-2 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600"
                value={query}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuery(val);
                  if (val.trim().length >= 4) {
                    handleSearch(val);
                  } else {
                    setSearchResults([]);
                  }
                }}
              />
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm"
              >
                Cari
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left">NIS</th>
                    <th className="px-6 py-3 text-left">Nama</th>
                    <th className="px-6 py-3 text-left">Kelas</th>
                    <th className="px-6 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {query.trim().length < 4 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center italic text-gray-500 dark:text-gray-400"
                      >
                        Ketik minimal 4 huruf untuk mencari siswa.
                      </td>
                    </tr>
                  ) : searchResults.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center italic text-gray-500 dark:text-gray-400"
                      >
                        Tidak ada hasil.
                      </td>
                    </tr>
                  ) : (
                    searchResults
                      .filter(
                        (s) =>
                          !penerimaList.some((p) => p.nis === s.nis) &&
                          !selectedSiswa.some((sel) => sel.nis === s.nis)
                      )
                      .map((siswa) => (
                        <tr key={siswa.nis}>
                          <td className="px-6 py-4">{siswa.nis}</td>
                          <td className="px-6 py-4">{siswa.nama}</td>
                          <td className="px-6 py-4">
                            {siswa.kelas?.replace(/^Kelas\s*/i, "") || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleAddSiswa(siswa)}
                              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded shadow text-xs"
                            >
                              +
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TambahPenerimaPanel;
