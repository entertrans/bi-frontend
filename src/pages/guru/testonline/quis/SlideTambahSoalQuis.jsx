import React, { useState, useEffect } from "react";
import { HiX, HiPencil, HiTrash } from "react-icons/hi";
import { getTestSoalByTestId, deleteTestSoal } from "../../../../api/testOnlineAPI"; // ⬅️ API ambil & hapus soal
import Swal from "sweetalert2";
import SlideFormTambahSoal from "./SlideFormTambahSoal"; // ⬅️ form yang tadi kamu rename

// fungsi bantu buat truncate pertanyaan
const truncateText = (text, maxWords = 150) => {
  if (!text) return "";
  const words = text.split(" ");
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(" ") + " ...";
};

const SlideTambahSoalQuis = ({ isOpen, onClose, test }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [soalList, setSoalList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSoal, setSelectedSoal] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setShowPanel(true), 10);
      fetchSoal();
    }
  }, [isOpen, test]);

  const fetchSoal = async () => {
    try {
      if (!test?.test_id) return;
      const data = await getTestSoalByTestId(test.test_id);
      setSoalList(data || []);
    } catch (err) {
      console.error("Gagal ambil soal:", err);
    }
  };

  const handleClose = () => {
    setShowPanel(false);
    setTimeout(() => {
      setIsMounted(false);
      onClose();
    }, 300);
  };

  const handleAddSoal = () => {
    setSelectedSoal(null); // mode tambah
    setShowForm(true);
  };

  const handleEditSoal = (soal) => {
    setSelectedSoal(soal); // mode edit
    setShowForm(true);
  };

  const handleDeleteSoal = (soal) => {
    Swal.fire({
      title: "Yakin hapus soal?",
      text: "Soal ini akan dihapus permanen dari quis",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteTestSoal(soal.id);
          Swal.fire("Terhapus!", "Soal berhasil dihapus.", "success");
          fetchSoal();
        } catch (error) {
          Swal.fire("Gagal!", "Soal gagal dihapus.", "error");
        }
      }
    });
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
        className={`fixed top-0 right-0 h-full w-full max-w-4xl z-50 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 transform ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Kelola Soal Quis: {test?.judul}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-red-600 text-2xl font-bold"
          >
            <HiX />
          </button>
        </div>

        {/* Tombol Tambah */}
        <div className="p-4 flex justify-end">
          <button
            onClick={handleAddSoal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
          >
            + Tambah Soal
          </button>
        </div>

        {/* List Soal */}
        <div className="overflow-y-auto h-[80%] px-4 pb-6">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left">Tipe</th>
                <th className="px-6 py-3 text-left">Pertanyaan</th>
                <th className="px-6 py-3 text-left">Lampiran</th>
                <th className="px-6 py-3 text-left">Kunci</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {soalList.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 text-center italic text-gray-500"
                  >
                    Belum ada soal, silakan tambah soal.
                  </td>
                </tr>
              ) : (
                soalList.map((soal) => (
                  <tr key={soal.id}>
                    <td className="px-6 py-4">{soal.tipe_soal?.toUpperCase()}</td>
                    <td className="px-6 py-4">
                      {truncateText(soal.pertanyaan)}
                    </td>
                    <td className="px-6 py-4">
                      {soal.lampiran ? (
                        <span className="text-blue-600 cursor-pointer hover:underline">
                          📎 {soal.lampiran}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {Array.isArray(soal.jawaban_benar)
                        ? soal.jawaban_benar.join(", ")
                        : soal.jawaban_benar}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center space-x-3">
                        <HiPencil
                          className="cursor-pointer hover:text-yellow-600 text-lg"
                          onClick={() => handleEditSoal(soal)}
                        />
                        <HiTrash
                          className="cursor-pointer hover:text-red-600 text-lg"
                          onClick={() => handleDeleteSoal(soal)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Tambah/Edit Soal */}
      <SlideFormTambahSoal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        test={test}
        soal={selectedSoal}
        onSuccess={fetchSoal}
      />
    </>
  );
};

export default SlideTambahSoalQuis;
