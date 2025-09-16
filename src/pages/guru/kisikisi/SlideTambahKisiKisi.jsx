import React from "react";
import { Transition } from "@headlessui/react";

const SlideTambahKisiKisi = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  kelasList,
  formMapelList,
  error,
  loadMapel
}) => {
  return (
    <Transition show={isOpen}>
      {/* Backdrop */}
      <Transition.Child
        enter="ease-in-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in-out duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />
      </Transition.Child>

      {/* Slide Panel */}
      <Transition.Child
        enter="transform transition ease-in-out duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed inset-y-0 right-0 w-full sm:w-1/3 bg-white dark:bg-gray-800 shadow-xl">
          <div className="relative h-full overflow-y-auto p-6">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Tambah Kisi-Kisi</h3>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Kelas - SESUAIKAN DENGAN BACKEND: kisikisi_kelas_id */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Kelas *
                </label>
                <select
                  value={formData.kisikisi_kelas_id || ""}
                  onChange={(e) => {
                    const kelasId = e.target.value;
                    setFormData({ 
                      ...formData, 
                      kisikisi_kelas_id: kelasId, 
                      kisikisi_mapel: "" 
                    });
                    loadMapel(kelasId, true);
                  }}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih Kelas --</option>
                  {kelasList.map((k) => (
                    <option key={k.kelas_id} value={k.kelas_id}>
                      {k.kelas_nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Mapel - SESUAIKAN DENGAN BACKEND: kisikisi_mapel */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Mata Pelajaran *
                </label>
                <select
                  value={formData.kisikisi_mapel || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, kisikisi_mapel: e.target.value })
                  }
                  required
                  disabled={!formData.kisikisi_kelas_id}
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                >
                  <option value="">-- Pilih Mapel --</option>
                  {formMapelList.map((m) => (
                    <option key={m.kd_mapel} value={m.kd_mapel}>
                      {m.nm_mapel}
                    </option>
                  ))}
                </select>
              </div>

              {/* Semester - SESUAIKAN DENGAN BACKEND: kisikisi_semester */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Semester *
                </label>
                <select
                  value={formData.kisikisi_semester || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, kisikisi_semester: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih Semester --</option>
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                </select>
              </div>

              {/* UB - SESUAIKAN DENGAN BACKEND: kisikisi_ub */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  UB (Unit Belajar) *
                </label>
                <select
                  value={formData.kisikisi_ub || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, kisikisi_ub: e.target.value })
                  }
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">-- Pilih UB --</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={(i + 1).toString()}>
                      UB {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              {/* Deskripsi - SESUAIKAN DENGAN BACKEND: kisikisi_deskripsi */}
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                  Deskripsi Kisi-Kisi *
                </label>
                <textarea
                  value={formData.kisikisi_deskripsi || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, kisikisi_deskripsi: e.target.value })
                  }
                  placeholder="Tuliskan kisi-kisi..."
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg h-32 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default SlideTambahKisiKisi;