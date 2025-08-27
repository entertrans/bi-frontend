import React, { useState, useEffect } from "react";
import { HiX, HiPencil, HiTrash } from "react-icons/hi";
import {
  getTestSoalByTestId,
  deleteTestSoal,
} from "../../../../api/testOnlineAPI";
import Swal from "sweetalert2";
import SlideFormTambahSoal from "./SlideFormTambahSoal";
import { showAlert } from "../../../../utils/toast";
import { removeHTMLTags } from "../../../../utils/format";

const SlideTambahSoalQuis = ({ isOpen, onClose, test }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [soalList, setSoalList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedSoal, setSelectedSoal] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const response = await getTestSoalByTestId(test.test_id);

      if (response.success) {
        setSoalList(response.data || []);
      } else {
        console.error("Gagal ambil soal:", response.message);
        setSoalList([]);
      }
    } catch (err) {
      console.error("Gagal ambil soal:", err);
      setSoalList([]);
    } finally {
      setIsLoading(false);
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
    setSelectedSoal(null);
    setShowForm(true);
  };

  const handleEditSoal = (soal) => {
    setSelectedSoal(soal);
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
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteTestSoal(soal.testsoal_id);

          if (response.success) {
            showAlert("Soal berhasil dihapus.", "success");
            fetchSoal();
          } else {
            showAlert("Soal gagal dihapus", "error");
          }
        } catch (error) {
          console.error("Error deleting soal:", error);
           showAlert("Soal gagal dihapus", "error");
        }
      }
    });
  };

  if (!isMounted) return null;

  return (
    <>
      <div
        onClick={handleClose}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      <div
        className={`fixed top-0 right-0 h-full w-full max-w-4xl z-50 bg-white dark:bg-gray-800 shadow-lg transition-transform duration-300 transform ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
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

        <div className="p-4 flex justify-end">
          <button
            onClick={handleAddSoal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow text-sm"
          >
            + Tambah Soal
          </button>
        </div>

        {isLoading && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Memuat soal...
            </p>
          </div>
        )}

        {!isLoading && (
          <div className="overflow-y-auto h-[80%] px-4 pb-6">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">No</th>
                  <th className="px-6 py-3 text-left">Tipe</th>
                  <th className="px-6 py-3 text-left">Pertanyaan</th>
                  <th className="px-6 py-3 text-left">Lampiran</th>
                  <th className="px-6 py-3 text-left">Kunci Jawaban</th>
                  <th className="px-6 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {soalList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center italic text-gray-500"
                    >
                      Belum ada soal, silakan tambah soal.
                    </td>
                  </tr>
                ) : (
                  soalList.map((soal, index) => (
                    <tr key={soal.testsoal_id}>
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4">
                        {soal.tipe_soal?.toUpperCase()}
                      </td>
                      <td className="px-6 py-4">
                        {removeHTMLTags(soal.pertanyaan)}
                      </td>
                      <td className="px-6 py-4">
                        {soal.lampiran ? (
                          <img
                            src={`http://localhost:8080/${soal.lampiran.path_file}`}
                            alt="lampiran"
                            className="w-10 h-10 object-cover rounded border"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {Array.isArray(soal.jawaban_benar)
                          ? soal.jawaban_benar
                              .map((jawaban) => removeHTMLTags(jawaban))
                              .join(", ")
                          : removeHTMLTags(soal.jawaban_benar)}
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
        )}
      </div>

      <SlideFormTambahSoal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        test={test}
        soal={selectedSoal}
        onSuccess={fetchSoal} // Ini sudah benar, pastikan tidak ada typo
      />
    </>
  );
};

export default SlideTambahSoalQuis;
