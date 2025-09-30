import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import {
  getPesertaByTest,
  addPeserta,
  deletePeserta,
} from "../../../../api/testOnlineAPI";
import { fetchAllSiswaByKelas } from "../../../../api/siswaAPI";
import { HiTrash, HiPlus, HiX, HiUserAdd, HiUserRemove } from "react-icons/hi";
import Swal from "sweetalert2";
import { showAlert } from "../../../../utils/toast";

const SlidePeserta = ({ isOpen, onClose, test }) => {
  const [peserta, setPeserta] = useState([]);
  const [siswaKelas, setSiswaKelas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && test?.kelas_id) {
      loadPeserta();
      loadSiswaKelas(test.kelas_id);
    }
  }, [isOpen, test]);

  const loadPeserta = async () => {
    try {
      const data = await getPesertaByTest(test.test_id);
      setPeserta(data);
    } catch (err) {
      console.error("Gagal memuat peserta:", err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat peserta',
        text: 'Terjadi kesalahan saat memuat data peserta',
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const loadSiswaKelas = async (kelasID) => {
    try {
      const data = await fetchAllSiswaByKelas(kelasID);
      setSiswaKelas(data);
    } catch (err) {
      console.error("Gagal memuat siswa kelas:", err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal memuat siswa',
        text: 'Terjadi kesalahan saat memuat data siswa',
        timer: 3000,
        showConfirmButton: false
      });
    }
  };

  const handleAddPeserta = async (siswa) => {
    try {
      setIsLoading(true);
      await addPeserta({
        test_id: test.test_id,
        siswa_nis: siswa.siswa_nis,
      });
      showAlert("Peserta berhasil ditambahka", "success");
      
      loadPeserta();
    } catch (err) {
      console.error("Gagal menambahkan peserta:", err);
      showAlert("Gagal menambahkan peserta", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePeserta = async (pesertaId) => {
    const result = await Swal.fire({
      title: 'Hapus Peserta?',
      text: "Apakah Anda yakin ingin menghapus peserta ini?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 mr-1 rounded",
        cancelButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 ml-1 rounded",
      }
    });

    if (result.isConfirmed) {
      try {
        await deletePeserta(pesertaId);
        
        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Peserta berhasil dihapus',
          timer: 2000,
          showConfirmButton: false
        });
        
        loadPeserta();
      } catch (err) {
        console.error("Gagal menghapus peserta:", err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal!',
          text: 'Gagal menghapus peserta',
          timer: 3000,
          showConfirmButton: false
        });
      }
    }
  };

  const handleClose = () => {
    onClose();
    setPeserta([]);
    setSiswaKelas([]);
  };

  // Filter siswa yang belum jadi peserta
  const pesertaNIS = peserta.map((p) => p.siswa_nis);
  const calonSiswa = siswaKelas.filter((s) => !pesertaNIS.includes(s.siswa_nis));

  return (
    <Transition show={isOpen}>
      {/* Overlay */}
      <Transition.Child
        as="div"
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40"
        onClick={handleClose}
      />
      
      {/* Panel */}
      <Transition.Child
        as="div"
        enter="transform transition ease-in-out duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
        className="fixed inset-y-0 right-0 w-full max-w-2xl bg-white dark:bg-gray-800 shadow-xl z-50 flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <HiUserAdd className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Kelola Peserta Test
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {test?.judul} • {test?.mapel?.nm_mapel || "Mata Pelajaran"}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <HiX className="w-5 h-5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Peserta Saat Ini */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <HiUserAdd className="w-5 h-5 text-green-600" />
                Daftar Peserta
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full ml-2">
                  {peserta.length} siswa
                </span>
              </h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
              {peserta.length > 0 ? (
                peserta.map((p, index) => (
                  <div
                    key={p.peserta_id}
                    className={`flex justify-between items-center p-4 ${
                      index !== peserta.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                    } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {p.siswa?.siswa_nama?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {p.siswa?.siswa_nama || 'Nama tidak tersedia'}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">NIS: {p.siswa_nis}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeletePeserta(p.peserta_id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      title="Hapus peserta"
                    >
                      <HiUserRemove className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <HiUserAdd className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Belum ada peserta yang ditambahkan
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tambahkan Siswa */}
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <HiPlus className="w-5 h-5 text-blue-600" />
                Tambahkan Siswa
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full ml-2">
                  {calonSiswa.length} tersedia
                </span>
              </h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '40vh' }}>
              {calonSiswa.length > 0 ? (
                calonSiswa.map((s, index) => (
                  <div
                    key={s.siswa_id}
                    className={`flex justify-between items-center p-4 ${
                      index !== calonSiswa.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''
                    } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {s.siswa_nama?.charAt(0) || 'S'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {s.siswa_nama}
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs">NIS: {s.siswa_nis}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAddPeserta(s)}
                      className="p-2 text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                      title="Tambah peserta"
                    >
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <HiUserAdd className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Tidak ada siswa tersedia untuk ditambahkan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
          <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Total peserta: {peserta.length} siswa</span>
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
            >
              Selesai
            </button>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default SlidePeserta;