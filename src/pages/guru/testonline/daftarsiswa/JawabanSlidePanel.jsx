// src/pages/guru/JawabanSlidePanel.jsx
import React from "react";
import { Transition } from "@headlessui/react";

// 🔹 Slide Panel Level 2
function JawabanSlidePanel({ siswa, isOpen, onClose }) {
  if (!siswa) return null;

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* Overlay */}
        <Transition.Child
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          ></div>
        </Transition.Child>

        {/* Slide panel */}
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="relative bg-white dark:bg-gray-800 w-full max-w-3xl h-full shadow-xl"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="px-6 py-4 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400">
                Manajemen Jawaban - {siswa.siswa_nama}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <p className="mb-2 text-gray-700 dark:text-gray-300">
                  <span className="font-medium">NIS:</span> {siswa.siswa_nis}
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300">
                  <span className="font-medium">Kelas:</span> {siswa.kelas?.kelas_nama || "-"}
                </p>
              </div>

              {/* TODO: fetch & tampilkan data test dari to_jawabanfinal */}
              <table className="w-full text-sm text-left border dark:border-gray-600">
                <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                  <tr>
                    <th className="px-4 py-3">Jenis Test</th>
                    <th className="px-4 py-3">Mapel</th>
                    <th className="px-4 py-3">Judul</th>
                    <th className="px-4 py-3">Nilai</th>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Contoh data dummy - ganti dengan data dari API */}
                  <tr className="border-b dark:border-gray-600">
                    <td className="px-4 py-3">UB</td>
                    <td className="px-4 py-3">Bahasa Indonesia</td>
                    <td className="px-4 py-3">UB 1 Blabla</td>
                    <td className="px-4 py-3">80</td>
                    <td className="px-4 py-3">02 Sept 2025</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-blue-600 hover:underline text-sm dark:text-blue-400">
                        Detail Jawaban
                      </button>
                      <button className="text-red-600 hover:underline text-sm dark:text-red-400">
                        Reset Jawaban
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b dark:border-gray-600">
                    <td className="px-4 py-3">PTS</td>
                    <td className="px-4 py-3">Matematika</td>
                    <td className="px-4 py-3">PTS Ganjil</td>
                    <td className="px-4 py-3">85</td>
                    <td className="px-4 py-3">15 Okt 2025</td>
                    <td className="px-4 py-3 flex gap-2">
                      <button className="text-blue-600 hover:underline text-sm dark:text-blue-400">
                        Detail Jawaban
                      </button>
                      <button className="text-red-600 hover:underline text-sm dark:text-red-400">
                        Reset Jawaban
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <button
                onClick={onClose}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}

export default JawabanSlidePanel;