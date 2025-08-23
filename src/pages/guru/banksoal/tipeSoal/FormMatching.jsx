import React from "react";
import { HiTrash, HiPaperClip, HiPlus, HiX } from "react-icons/hi";
// HAPUS import SlideGaleryLampiran dari sini

const FormMatching = ({ pairs, setPairs, onOpenGallery }) => {
  // HAPUS state showGallery lokal

  const handleTextChange = (index, side, value) => {
    const newPairs = [...pairs];
    newPairs[index][side] = value;
    
    // Hapus lampiran jika ada teks (hanya satu tipe yang aktif)
    if (value.trim() !== "" && newPairs[index][`${side}Lampiran`]) {
      delete newPairs[index][`${side}Lampiran`];
    }
    
    setPairs(newPairs);
  };

  const removeLampiran = (index, side) => {
    const newPairs = [...pairs];
    delete newPairs[index][`${side}Lampiran`];
    setPairs(newPairs);
  };

  const openGallery = (index, side) => {
    onOpenGallery({ index, side });  // Gunakan function dari parent
  };

  const addPair = () => {
    setPairs([...pairs, { left: "", right: "" }]);
  };

  const removePair = (index) => {
    if (pairs.length <= 1) return;
    const newPairs = pairs.filter((_, i) => i !== index);
    setPairs(newPairs);
  };

  // Fungsi untuk mendapatkan URL gambar yang benar
  const getImageUrl = (lampiran) => {
    if (!lampiran) return "";
    
    if (lampiran.path_file.startsWith('http')) {
      return lampiran.path_file;
    }
    
    return `http://localhost:8080/${lampiran.path_file}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="block text-gray-700 dark:text-gray-300 font-semibold">
          Pasangan yang Dicocokkan
        </label>
        <button
          type="button"
          onClick={addPair}
          className="flex items-center gap-2 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
        >
          <HiPlus className="text-sm" />
          <span>Tambah Pasangan</span>
        </button>
      </div>

      {/* Header Table */}
      <div className="grid grid-cols-12 gap-2 mb-2 px-2">
        <div className="col-span-5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Sisi Kiri
        </div>
        <div className="col-span-1 text-center text-sm font-medium text-gray-700 dark:text-gray-300">
          =
        </div>
        <div className="col-span-5 text-sm font-medium text-gray-700 dark:text-gray-300">
          Sisi Kanan
        </div>
        <div className="col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
          Aksi
        </div>
      </div>

      {pairs.map((pair, i) => (
        <div key={i} className="grid grid-cols-12 gap-2 items-start p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          {/* Sisi Kiri */}
          <div className="col-span-5 space-y-2">
            {pair.leftLampiran ? (
              <div className="bg-white dark:bg-gray-700 p-2 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Gambar Kiri:
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLampiran(i, "left")}
                    className="text-red-600 hover:text-red-800"
                    title="Hapus gambar"
                  >
                    <HiX className="text-sm" />
                  </button>
                </div>
                {pair.leftLampiran.tipe_file?.startsWith('image/') || 
                 pair.leftLampiran.path_file?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={getImageUrl(pair.leftLampiran)}
                    alt={pair.leftLampiran.nama_file}
                    className="w-full h-16 object-contain rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded text-center">
                    <HiPaperClip className="mx-auto text-lg mb-1" />
                    <p className="text-xs truncate">{pair.leftLampiran.nama_file}</p>
                  </div>
                )}
                {/* Fallback jika gambar error */}
                <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded text-center hidden">
                  <HiPaperClip className="mx-auto text-lg mb-1" />
                  <p className="text-xs truncate">{pair.leftLampiran.nama_file}</p>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Teks kiri"
                  value={pair.left}
                  onChange={(e) => handleTextChange(i, "left", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => openGallery(i, "left")}
                  className="flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 text-xs"
                  title="Pilih gambar dari gallery"
                >
                  <HiPaperClip className="text-xs" />
                  <span>Pilih Gambar</span>
                </button>
              </>
            )}
          </div>

          {/* Tanda Sama Dengan */}
          <div className="col-span-1 flex items-center justify-center h-full">
            <span className="text-xl font-bold text-gray-400">=</span>
          </div>

          {/* Sisi Kanan */}
          <div className="col-span-5 space-y-2">
            {pair.rightLampiran ? (
              <div className="bg-white dark:bg-gray-700 p-2 rounded border">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Gambar Kanan:
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLampiran(i, "right")}
                    className="text-red-600 hover:text-red-800"
                    title="Hapus gambar"
                  >
                    <HiX className="text-sm" />
                  </button>
                </div>
                {pair.rightLampiran.tipe_file?.startsWith('image/') || 
                 pair.rightLampiran.path_file?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img 
                    src={getImageUrl(pair.rightLampiran)}
                    alt={pair.rightLampiran.nama_file}
                    className="w-full h-16 object-contain rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'block';
                    }}
                  />
                ) : (
                  <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded text-center">
                    <HiPaperClip className="mx-auto text-lg mb-1" />
                    <p className="text-xs truncate">{pair.rightLampiran.nama_file}</p>
                  </div>
                )}
                {/* Fallback jika gambar error */}
                <div className="p-2 bg-gray-100 dark:bg-gray-600 rounded text-center hidden">
                  <HiPaperClip className="mx-auto text-lg mb-1" />
                  <p className="text-xs truncate">{pair.rightLampiran.nama_file}</p>
                </div>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Teks kanan"
                  value={pair.right}
                  onChange={(e) => handleTextChange(i, "right", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => openGallery(i, "right")}
                  className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 rounded hover:bg-green-200 dark:hover:bg-green-800 text-xs"
                  title="Pilih gambar dari gallery"
                >
                  <HiPaperClip className="text-xs" />
                  <span>Pilih Gambar</span>
                </button>
              </>
            )}
          </div>

          {/* Aksi */}
          <div className="col-span-1 flex items-center justify-center">
            <button
              type="button"
              onClick={() => removePair(i)}
              className="p-2 text-red-600 hover:text-red-800"
              title="Hapus pasangan"
              disabled={pairs.length <= 1}
            >
              <HiTrash />
            </button>
          </div>
        </div>
      ))}

      <div className="text-sm text-gray-500 dark:text-gray-400 italic">
        <p>💡 Pilih antara teks ATAU gambar untuk setiap sisi. Tidak bisa keduanya.</p>
      </div>
    </div>
  );
};

export default FormMatching;