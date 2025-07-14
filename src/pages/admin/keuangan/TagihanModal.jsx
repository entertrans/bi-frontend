// TagihanModal.jsx
import React, { useEffect, useState } from "react";
import { fetchAllTagihan, tambahTagihan } from "../../../api/siswaAPI";
import { showToast, showAlert } from "../../../utils/toast";

const TagihanModal = ({ onClose, onSelect }) => {
  const [tagihanList, setTagihanList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set());
  const [showFormTambah, setShowFormTambah] = useState(false);
  const [newTagihan, setNewTagihan] = useState({
    jns_tagihan: "",
    nom_tagihan: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllTagihan()
      .then((res) => setTagihanList(res))
      .catch((err) => console.error("Gagal fetch tagihan:", err));
  }, []);

  const handleAdd = (item) => {
    const key = item.jns_tagihan + item.nom_tagihan;

    if (selectedKeys.has(key)) return; // Jangan tambahkan duplikat

    onSelect([
      {
        nama: item.jns_tagihan,
        nominal: Number(item.nom_tagihan),
      },
    ]);

    setSelectedKeys((prev) => new Set(prev).add(key));
  };
  const handleSubmitNewTagihan = async () => {
    if (!newTagihan.jns_tagihan || !newTagihan.nom_tagihan) {
      showAlert("Isi semua field terlebih dahulu.", "error");
      return;
    }

    setLoading(true); // 👉 mulai loading

    try {
      await tambahTagihan({
        jns_tagihan: newTagihan.jns_tagihan,
        nom_tagihan: Number(newTagihan.nom_tagihan),
      });

      const updatedList = await fetchAllTagihan();
      setTagihanList(updatedList);

      const newAdded = updatedList.find(
        (x) =>
          x.jns_tagihan === newTagihan.jns_tagihan &&
          Number(x.nom_tagihan) === Number(newTagihan.nom_tagihan)
      );

      if (newAdded) {
        const key = newAdded.jns_tagihan + newAdded.nom_tagihan;
        setSelectedKeys((prev) => new Set(prev).add(key));
        onSelect([
          {
            nama: newAdded.jns_tagihan,
            nominal: Number(newAdded.nom_tagihan),
          },
        ]);
      }

      setNewTagihan({ jns_tagihan: "", nom_tagihan: "" });
      setShowFormTambah(false);
    } catch (err) {
      showAlert("Gagal menyimpan tagihan baru", "error");
      console.error(err);
    } finally {
      setLoading(false); // 👉 selesai loading
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl mx-4">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
          Pilih Tagihan
        </h2>

        <div className="max-h-96 overflow-y-auto relative border rounded">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0 z-10">
              <tr>
                <th className="p-2 text-left">Jenis Tagihan</th>
                <th className="p-2 text-left">Nominal</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tagihanList.map((item, idx) => {
                const key = item.jns_tagihan + item.nom_tagihan;
                const isAdded = selectedKeys.has(key);
                return (
                  <tr
                    key={idx}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="p-2">{item.jns_tagihan}</td>
                    <td className="p-2">
                      Rp{Number(item.nom_tagihan).toLocaleString("id-ID")}
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleAdd(item)}
                        disabled={isAdded}
                        className={`text-green-600 hover:text-green-800 ${
                          isAdded ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        title={isAdded ? "Sudah ditambahkan" : "Tambahkan"}
                      >
                        ➕
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Tambah Baru Section */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Tidak menemukan tagihan yang kamu cari?{" "}
            <button
              onClick={() => setShowFormTambah(true)}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Tambah Tagihan Baru
            </button>
          </p>

          {showFormTambah && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                placeholder="Jenis Tagihan"
                value={newTagihan.jns_tagihan}
                onChange={(e) =>
                  setNewTagihan({ ...newTagihan, jns_tagihan: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700"
              />

              <input
                type="text"
                placeholder="Nominal"
                value={newTagihan.nom_tagihan}
                onChange={(e) => {
                  // Hanya izinkan angka
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  setNewTagihan({ ...newTagihan, nom_tagihan: onlyNums });
                }}
                className="w-full px-3 py-2 border rounded text-black dark:text-white bg-white dark:bg-gray-700"
              />

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={handleSubmitNewTagihan}
                  disabled={loading}
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 018 8h-4l3 3 3-3h-4a8 8 0 01-8 8v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                      />
                    </svg>
                  )}
                  {loading ? "Menyimpan..." : "Simpan"}
                </button>

                <button
                  onClick={() => setShowFormTambah(false)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagihanModal;
