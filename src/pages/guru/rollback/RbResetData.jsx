import React, { useState, useEffect } from "react";
import {
  HiArrowPath,
  HiCheckCircle,
  HiXCircle,
  HiCloudArrowUp,
  HiExclamationTriangle,
  HiDocumentText,
} from "react-icons/hi2";
import Swal from "sweetalert2";
import axios from "axios";

const RbResetData = () => {
  const tables = [
    { name: "rb_banksoal", description: "Bank soal dan pertanyaan" },
    { name: "rb_jawabanfinal", description: "Jawaban final siswa" },
    { name: "rb_lampiran", description: "File lampiran soal" },
    { name: "rb_peserta", description: "Data peserta ujian" },
    { name: "rb_sessionsoal", description: "Session pengerjaan soal" },
    { name: "rb_test", description: "Data test dan ujian" },
    { name: "rb_testsession", description: "Session test" },
    { name: "rb_testsoal", description: "Soal dalam test" },
    { name: "rb_test_soal", description: "Relasi test dan soal" },
  ];

  const [statuses, setStatuses] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [loading, setLoading] = useState({});
  const [isResetting, setIsResetting] = useState(false);

  // 🔹 Fetch status awal
  const fetchStatuses = async () => {
    try {
      const res = await axios.get("/api/rollback/status");
      setStatuses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const handleFileSelect = (tableName, file) => {
    setSelectedFiles((prev) => ({ ...prev, [tableName]: file }));
  };

  const handleImport = async (tableName) => {
    const file = selectedFiles[tableName];
    if (!file) {
      Swal.fire({
        icon: "warning",
        title: "File belum dipilih",
        text: `Silakan pilih file SQL untuk ${tableName} terlebih dahulu.`,
      });
      return;
    }

    const confirm = await Swal.fire({
      title: `Import ${tableName}?`,
      text: "Data akan ditimpa sesuai isi file SQL yang diupload.",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Ya, import!",
      cancelButtonText: "Batal",
      confirmButtonColor: "#7e3af2",
    });

    if (!confirm.isConfirmed) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading((prev) => ({ ...prev, [tableName]: true }));

      await axios.post(`/api/rollback/import/${tableName}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil diimport!",
        text: `Data ${tableName} berhasil diupdate.`,
        timer: 2000,
        showConfirmButton: false,
      });

      fetchStatuses();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Import",
        text: err.response?.data?.error || err.message,
      });
    } finally {
      setLoading((prev) => ({ ...prev, [tableName]: false }));
    }
  };

  const handleResetAll = async () => {
    const confirm = await Swal.fire({
      title: "Yakin ingin mereset semua data rollback?",
      text: "Tindakan ini akan menghapus SEMUA data rb_ dan tidak bisa dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus semua",
      cancelButtonText: "Batal",
      confirmButtonColor: "#dc2626",
    });

    if (!confirm.isConfirmed) return;

    try {
      setIsResetting(true);
      await axios.post("/api/rollback/reset");

      Swal.fire({
        icon: "success",
        title: "Data direset!",
        text: "Semua tabel rollback telah dikosongkan.",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchStatuses();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal Reset",
        text: err.response?.data?.error || err.message,
      });
    } finally {
      setIsResetting(false);
    }
  };

  const getStatusColor = (hasData) =>
    hasData
      ? "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-300"
      : "text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400";

  const getStatusIcon = (hasData) =>
    hasData ? (
      <HiCheckCircle className="text-green-500" size={20} />
    ) : (
      <HiXCircle className="text-gray-400" size={20} />
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <HiArrowPath
              className="text-purple-600 dark:text-purple-400"
              size={28}
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Reset Data Rollback
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              Kelola dan reset data sistem dengan file SQL backup
            </p>
          </div>
        </div>

        <button
          onClick={handleResetAll}
          disabled={isResetting}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-6 py-3 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md disabled:cursor-not-allowed"
        >
          {isResetting ? (
            <HiArrowPath className="animate-spin" size={20} />
          ) : (
            <HiExclamationTriangle size={20} />
          )}
          {isResetting ? "Memproses..." : "Reset Semua Data"}
        </button>
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <HiExclamationTriangle
            className="text-yellow-600 dark:text-yellow-500 mt-0.5"
            size={20}
          />
          <div className="text-yellow-800 dark:text-yellow-300 text-sm">
            <strong className="font-semibold">Peringatan:</strong> Reset data
            akan menghapus seluruh data rollback dan tidak bisa dibatalkan.
            Pastikan Anda sudah melakukan backup.
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {tables.map((table) => {
          const hasData = statuses[table.name];
          const file = selectedFiles[table.name];
          const isLoading = loading[table.name];

          return (
            <div
              key={table.name}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 p-5"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <HiDocumentText
                    className="text-purple-500 dark:text-purple-400"
                    size={18}
                  />
                  <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
                    {table.name}
                  </h3>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    hasData
                  )}`}
                >
                  {hasData ? "Ada Data" : "Kosong"}
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-xs mb-4">
                {table.description}
              </p>

              <div className="space-y-3">
                <input
                  type="file"
                  accept=".sql"
                  onChange={(e) =>
                    handleFileSelect(table.name, e.target.files[0])
                  }
                  className="block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-purple-50 file:text-purple-700 dark:file:bg-purple-900 dark:file:text-purple-300 hover:file:bg-purple-100 dark:hover:file:bg-purple-800 transition-colors cursor-pointer"
                />

                {file && (
                  <div className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
                    📁 {file.name}
                  </div>
                )}

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => handleImport(table.name)}
                    disabled={!file || isLoading}
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    {isLoading ? (
                      <HiArrowPath className="animate-spin" size={16} />
                    ) : (
                      <HiCloudArrowUp size={16} />
                    )}
                    {isLoading ? "Mengimpor..." : "Import SQL"}
                  </button>
                  {getStatusIcon(hasData)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center text-gray-500 dark:text-gray-400 text-sm pt-4 border-t border-gray-200 dark:border-gray-800">
        <p>
          Pastikan file SQL yang diimport kompatibel dengan struktur database
          saat ini.
        </p>
      </div>
    </div>
  );
};

export default RbResetData;
