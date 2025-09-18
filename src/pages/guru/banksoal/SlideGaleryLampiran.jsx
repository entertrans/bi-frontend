import React, { useState, useEffect } from "react";
import {
  getActiveLampiran,
  deleteLampiran,
  uploadLampiran,
} from "../../../api/bankSoalAPI";
import {
  HiDocumentText,
  HiMusicNote,
  HiVideoCamera,
  HiArchive,
  HiX,
  HiPlus,
  HiTrash,
  HiPhotograph,
} from "react-icons/hi";
import { showAlert } from "../../../utils/toast";

const SlideGaleryLampiran = ({ isOpen, onClose, onSelectLampiran }) => {
  const [mounted, setMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [lampiranList, setLampiranList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => setShowPanel(true), 10);
      fetchLampiran();
    } else {
      setShowPanel(false);
      setTimeout(() => setMounted(false), 300);
    }
  }, [isOpen]);

  const fetchLampiran = async () => {
    try {
      const data = await getActiveLampiran();
      setLampiranList(data || []);
    } catch (err) {
      console.error("Gagal fetch lampiran:", err);
      showAlert("Gagal memuat lampiran", "error");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();

    if (!window.confirm("Yakin hapus lampiran ini?")) return;

    try {
      setIsDeleting(id);
      await deleteLampiran(id);
      await fetchLampiran();
      showAlert("Lampiran berhasil dihapus", "success");
    } catch (err) {
      console.error("Gagal hapus lampiran:", err);
      showAlert("Gagal menghapus lampiran", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSelect = (lampiran, e) => {
    e.stopPropagation();
    onSelectLampiran(lampiran);
    onClose();
  };

  const handleUpload = async (e) => {
    e.stopPropagation();
    const file = e.target.files[0];
    if (!file) return;

    // Validasi ukuran file (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showAlert("Ukuran file maksimal 10MB", "error");
      e.target.value = null;
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadLampiran(formData);
      await fetchLampiran();
      showAlert("File berhasil diupload", "success");
    } catch (err) {
      console.error("Gagal upload lampiran:", err);
      showAlert("Upload gagal", "error");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  const getFileIcon = (lampiran) => {
    const iconClass = "w-8 h-8 mx-auto";

    switch (lampiran.tipe_file) {
      case "image":
        return <HiPhotograph className={`${iconClass} text-blue-500`} />;
      case "pdf":
        return <HiDocumentText className={`${iconClass} text-red-500`} />;
      case "audio":
        return <HiMusicNote className={`${iconClass} text-green-500`} />;
      case "video":
        return <HiVideoCamera className={`${iconClass} text-purple-500`} />;
      default:
        return <HiArchive className={`${iconClass} text-gray-500`} />;
    }
  };

  const getFilePreview = (lampiran) => {
    if (lampiran.tipe_file === "image") {
      return (
        <img
          src={`http://localhost:8080/${lampiran.path_file}`}
          alt={lampiran.nama_file}
          className="w-16 h-16 object-cover rounded-lg mx-auto"
        />
      );
    }
    return getFileIcon(lampiran);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          showPanel ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide panel */}
      <div
        onClick={handlePanelClick}
        className={`fixed top-0 right-0 w-full max-w-4xl h-full bg-white dark:bg-gray-800 z-50 shadow-xl overflow-auto transition-transform duration-300 ease-in-out ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
              Galeri Lampiran
            </h2>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              Pilih atau upload file untuk ditambahkan ke soal
            </p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Upload Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <label
              htmlFor="lampiran_upload"
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Upload File Baru
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="lampiran_upload"
                className="flex-1 cursor-pointer"
              >
                <div className="flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  {uploading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-gray-600 dark:text-gray-400">
                        Mengupload...
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <HiPlus className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">
                        Pilih file untuk diupload
                      </span>
                    </div>
                  )}
                </div>
                <input
                  id="lampiran_upload"
                  type="file"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                  onClick={(e) => e.stopPropagation()}
                />
              </label>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Maksimal 10MB per file. Format yang didukung: gambar, PDF, audio,
              video
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {lampiranList.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <HiArchive className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <p className="text-lg font-medium">Belum ada lampiran</p>
              <p className="text-sm">
                Upload file pertama Anda menggunakan form di atas
              </p>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                File Tersedia ({lampiranList.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lampiranList.map((lampiran) => (
                  <div
                    key={lampiran.lampiran_id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                  >
                    <div className="flex flex-col items-center mb-3">
                      {getFilePreview(lampiran)}
                    </div>

                    <div className="text-center mb-3">
                      <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                        {lampiran.nama_file}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {lampiran.tipe_file} •{" "}
                        {formatFileSize(lampiran.ukuran_file)}
                      </p>
                    </div>

                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={(e) => handleSelect(lampiran, e)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                      >
                        Pilih
                      </button>
                      <button
                        onClick={(e) => handleDelete(lampiran.lampiran_id, e)}
                        disabled={isDeleting === lampiran.lampiran_id}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                      >
                        {isDeleting === lampiran.lampiran_id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mx-2"></div>
                        ) : (
                          <HiTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SlideGaleryLampiran;
