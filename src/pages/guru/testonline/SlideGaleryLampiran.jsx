import React, { useState, useEffect } from "react";
import {
  getActiveLampiran,
  deleteLampiran,
  uploadLampiran,
} from "../../../api/testOnlineAPI";
import {
  HiDocumentText,
  HiMusicNote,
  HiVideoCamera,
  HiArchive,
} from "react-icons/hi";

const SlideGaleryLampiran = ({ isOpen, onClose, onSelectLampiran }) => {
  const [mounted, setMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [lampiranList, setLampiranList] = useState([]);
  const [uploading, setUploading] = useState(false);

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
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation(); // TAMBAH INI
    if (!window.confirm("Yakin hapus lampiran ini?")) return;
    try {
      await deleteLampiran(id);
      fetchLampiran();
    } catch (err) {
      console.error("Gagal hapus lampiran:", err);
    }
  };

  const handleSelect = (lampiran, e) => {
    e.stopPropagation(); // TAMBAH INI
    onSelectLampiran(lampiran);
    onClose();
  };

  const handleUpload = async (e) => {
    e.stopPropagation(); // TAMBAH INI
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await uploadLampiran(formData);
      await fetchLampiran();
    } catch (err) {
      console.error("Gagal upload lampiran:", err);
      alert("Upload gagal!");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  // TAMBAH FUNGSI INI: Handle click pada panel untuk stop propagation
  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  const renderPreview = (lampiran) => {
    switch (lampiran.tipe_file) {
      case "image":
        return (
          <img
            src={`http://localhost:8080/${lampiran.path_file}`}
            alt={lampiran.nama_file}
            className="w-16 h-16 object-cover mx-auto"
          />
        );
      case "pdf":
        return <HiDocumentText className="w-10 h-10 text-red-600 mx-auto" />;
      case "audio":
        return <HiMusicNote className="w-10 h-10 text-blue-600 mx-auto" />;
      case "video":
        return <HiVideoCamera className="w-10 h-10 text-green-600 mx-auto" />;
      default:
        return <HiArchive className="w-10 h-10 text-gray-600 mx-auto" />;
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide panel - TAMBAH onClick HANDLER */}
      <div
        onClick={handlePanelClick} // TAMBAH INI
        className={`fixed top-0 right-0 w-full max-w-3xl h-full bg-white dark:bg-gray-900 z-50 shadow-lg overflow-auto transition-transform duration-300 ease-in-out ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Pilih Lampiran
          </h2>
          <button
            onClick={(e) => {
              e.stopPropagation(); // TAMBAH INI
              onClose();
            }}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold leading-none"
          >
            ×
          </button>
        </div>

        {/* List Lampiran */}
        <div className="p-4">
          <table className="w-full border border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-800">
              <tr>
                <th className="p-2 border">Thumb</th>
                <th className="p-2 border">Nama File</th>
                <th className="p-2 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {lampiranList.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-4 text-gray-500">
                    Belum ada lampiran
                  </td>
                </tr>
              ) : (
                lampiranList.map((lampiran) => (
                  <tr key={lampiran.lampiran_id}>
                    <td className="p-2 border text-center">
                      {renderPreview(lampiran)}
                    </td>
                    <td className="p-2 border">{lampiran.nama_file}</td>
                    <td className="p-2 border space-x-2 text-center">
                      <button
                        onClick={(e) => handleSelect(lampiran, e)} // UPDATE INI
                        className="px-3 py-1 rounded bg-blue-600 text-white"
                      >
                        Tambahkan
                      </button>
                      <button
                        onClick={(e) => handleDelete(lampiran.lampiran_id, e)} // UPDATE INI
                        className="px-3 py-1 rounded bg-red-500 text-white"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Upload Section */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-lg mx-auto">
            <label
              htmlFor="lampiran_upload"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Upload file
            </label>
            <input
              id="lampiran_upload"
              type="file"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 
                         dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              onClick={(e) => e.stopPropagation()} // TAMBAH INI
            />
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-300">
              {uploading
                ? "Mengupload file..."
                : "Pilih file untuk ditambahkan ke lampiran"}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SlideGaleryLampiran;