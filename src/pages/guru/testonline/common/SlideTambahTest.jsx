import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import { fetchAllkelas, fetchAllMapelByKelas } from "../../../../api/siswaAPI";
import { showToast } from "../../../../utils/toast";

const SlideTambahTest = ({ isOpen, onClose, onSubmit, type = "ub" }) => {
  const [kelasList, setKelasList] = useState([]);
  const [mapelList, setMapelList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMapel, setIsLoadingMapel] = useState(false);
  const [useTime, setUseTime] = useState(false);

  const getDefaultForm = () => ({
    guru_id: 1,
    kelas_id: "",
    mapel_id: "",
    type_test: type,
    judul: "",
    deskripsi: "",
    durasi_menit: type === "tugas" ? 0 : 60,
    random_soal: 0,
    jumlah_soal_tampil: type === "tugas" ? 0 : 10,
    deadline: "",
    deadline_time: "23:59",
  });

  const [form, setForm] = useState(getDefaultForm);
  const [errors, setErrors] = useState({});

  // 🔹 Helpers
  const buildDeadlineString = () => {
    if (!form.deadline) return null;
    if (useTime && form.deadline_time) {
      return `${form.deadline}T${form.deadline_time}:00+07:00`;
    }
    return `${form.deadline}T23:59:59+07:00`;
  };

  const calculateDurationMinutes = (deadlineStr) => {
    if (!deadlineStr) return 0;
    const now = new Date();
    const deadlineDate = new Date(deadlineStr);
    const diffMs = deadlineDate - now;
    return Math.max(Math.floor(diffMs / 60000), 1);
  };

  const getMinDate = () => new Date().toISOString().split("T")[0];

  const getTestTypeLabel = () => {
    switch (type) {
      case "tr":
        return "test review";
      case "tugas":
        return "tugas";
      case "ub":
        return "ujian bulanan";
      default:
        return "test";
    }
  };

  const getTitle = () => {
    switch (type) {
      case "tr":
        return "Tambah Test Review";
      case "tugas":
        return "Tambah Tugas";
      case "ub":
        return "Tambah Ujian Bulanan";
      default:
        return "Tambah Test";
    }
  };

  // 🔹 Effects
  useEffect(() => {
    if (isOpen) {
      fetchKelasData();
      setForm(getDefaultForm());
      setUseTime(false);
    }
  }, [isOpen, type]);

  useEffect(() => {
    const fetchMapelByKelas = async () => {
      if (form.kelas_id) {
        try {
          setIsLoadingMapel(true);
          const mapelData = await fetchAllMapelByKelas(form.kelas_id);
          setMapelList(mapelData || []);
        } catch (error) {
          console.error("Gagal mengambil data mapel:", error);
          showToast("Gagal mengambil data mapel", "error");
          setMapelList([]);
        } finally {
          setIsLoadingMapel(false);
        }
      } else {
        setMapelList([]);
        setForm((prev) => ({ ...prev, mapel_id: "" }));
      }
    };

    fetchMapelByKelas();
  }, [form.kelas_id]);

  const fetchKelasData = async () => {
    try {
      setIsLoading(true);
      const kelasResponse = await fetchAllkelas();
      const kelasData = Array.isArray(kelasResponse?.aktif)
        ? kelasResponse.aktif
        : [];
      setKelasList(kelasData);
    } catch (error) {
      console.error("Gagal mengambil data kelas:", error);
      showToast("Gagal mengambil data kelas", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Handlers
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.kelas_id) newErrors.kelas_id = "Kelas harus dipilih";
    if (!form.mapel_id) newErrors.mapel_id = "Mapel harus dipilih";
    if (!form.judul.trim()) newErrors.judul = "Judul test harus diisi";

    if (type !== "tugas") {
      if (!form.durasi_menit || form.durasi_menit <= 0)
        newErrors.durasi_menit = "Durasi harus lebih dari 0 menit";
      if (!form.jumlah_soal_tampil || form.jumlah_soal_tampil <= 0)
        newErrors.jumlah_soal_tampil = "Jumlah soal harus lebih dari 0";
    }

    if (type === "tugas") {
      if (!form.deadline) {
        newErrors.deadline = "Deadline harus diisi";
      } else {
        const deadlineStr = buildDeadlineString();
        const deadlineDate = new Date(deadlineStr);
        if (deadlineDate <= new Date()) {
          newErrors.deadline = "Deadline harus lebih besar dari waktu sekarang";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const testData = {
        guru_id: parseInt(form.guru_id),
        kelas_id: parseInt(form.kelas_id),
        mapel_id: parseInt(form.mapel_id),
        type_test: form.type_test,
        judul: form.judul,
        deskripsi: form.deskripsi,
        random_soal: Boolean(form.random_soal),
        jumlah_soal_tampil: parseInt(form.jumlah_soal_tampil),
      };

      if (type === "tugas") {
        const deadlineStr = buildDeadlineString();
        testData.deadline = deadlineStr;
        testData.durasi_menit = calculateDurationMinutes(deadlineStr);
      } else {
        testData.durasi_menit = parseInt(form.durasi_menit);
      }

      // console.log("Data test yang dikirim:", testData);
      await onSubmit(testData);
      // resetForm();
      // onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      showToast(`Gagal membuat ${getTestTypeLabel()}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setForm(getDefaultForm());
    setErrors({});
    setMapelList([]);
    setUseTime(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const isTugas = type === "tugas";

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={handleClose}
        ></div>

        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="relative bg-white dark:bg-gray-800 w-full max-w-2xl h-full shadow-xl"
        >
          <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b dark:border-gray-700 flex justify-between items-center">
              <h2 className="font-bold text-lg dark:text-white">
                {getTitle()}
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Kelas */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kelas
                  </label>
                  <select
                    value={form.kelas_id}
                    onChange={(e) => handleChange("kelas_id", e.target.value)}
                    className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${
                      errors.kelas_id ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoading}
                  >
                    <option value="">Pilih Kelas</option>
                    {kelasList.map((kelas) => (
                      <option key={kelas.kelas_id} value={kelas.kelas_id}>
                        {kelas.kelas_nama}
                      </option>
                    ))}
                  </select>
                  {errors.kelas_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.kelas_id}
                    </p>
                  )}
                </div>

                {/* Mapel */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mata Pelajaran
                  </label>
                  <select
                    value={form.mapel_id}
                    onChange={(e) => handleChange("mapel_id", e.target.value)}
                    className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${
                      errors.mapel_id ? "border-red-500" : "border-gray-300"
                    }`}
                    disabled={isLoadingMapel || !form.kelas_id}
                  >
                    <option value="">Pilih Mapel</option>
                    {isLoadingMapel ? (
                      <option value="" disabled>
                        Memuat mapel...
                      </option>
                    ) : (
                      mapelList.map((mapel) => (
                        <option key={mapel.kd_mapel} value={mapel.kd_mapel}>
                          {mapel.nm_mapel}
                        </option>
                      ))
                    )}
                  </select>
                  {errors.mapel_id && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.mapel_id}
                    </p>
                  )}
                  {!form.kelas_id && (
                    <p className="mt-1 text-sm text-gray-500">
                      Pilih kelas terlebih dahulu
                    </p>
                  )}
                </div>

                {/* Judul */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Judul {getTestTypeLabel()}
                  </label>
                  <input
                    type="text"
                    value={form.judul}
                    onChange={(e) => handleChange("judul", e.target.value)}
                    className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${
                      errors.judul ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder={`Masukkan judul ${getTestTypeLabel()}`}
                  />
                  {errors.judul && (
                    <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
                  )}
                </div>

                {/* Deskripsi */}
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={form.deskripsi}
                    onChange={(e) => handleChange("deskripsi", e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                    rows="3"
                    placeholder="Masukkan deskripsi"
                  />
                </div>

                {/* Durasi - hanya untuk test, bukan tugas */}
                {!isTugas && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Durasi (menit)
                    </label>
                    <input
                      type="number"
                      value={form.durasi_menit}
                      onChange={(e) =>
                        handleChange(
                          "durasi_menit",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${
                        errors.durasi_menit
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      min="1"
                    />
                    {errors.durasi_menit && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.durasi_menit}
                      </p>
                    )}
                  </div>
                )}

                {/* Jumlah Soal Tampil - hanya untuk test, bukan tugas */}
                {!isTugas && (
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jumlah Soal yang Ditampilkan
                    </label>
                    <input
                      type="number"
                      value={form.jumlah_soal_tampil}
                      onChange={(e) =>
                        handleChange(
                          "jumlah_soal_tampil",
                          parseInt(e.target.value) || 0
                        )
                      }
                      className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${
                        errors.jumlah_soal_tampil
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      min="1"
                    />
                    {errors.jumlah_soal_tampil && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.jumlah_soal_tampil}
                      </p>
                    )}
                  </div>
                )}

                {/* Deadline - hanya untuk tugas */}
                {isTugas && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Deadline
                    </label>

                    {/* Input Tanggal */}
                    <div>
                      <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                        Tanggal
                      </label>
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={(e) =>
                          handleChange("deadline", e.target.value)
                        }
                        className={`w-full p-2 border rounded dark:bg-gray-700 dark:text-white ${
                          errors.deadline ? "border-red-500" : "border-gray-300"
                        }`}
                        min={getMinDate()}
                      />
                      {errors.deadline && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.deadline}
                        </p>
                      )}
                    </div>

                    {/* Toggle Waktu */}
                    <div className="flex items-center">
                      <input
                        id="use-time"
                        type="checkbox"
                        checked={useTime}
                        onChange={(e) => setUseTime(e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                      <label
                        htmlFor="use-time"
                        className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Tentukan waktu spesifik
                      </label>
                    </div>

                    {/* Input Waktu (conditional) */}
                    {useTime && (
                      <div>
                        <label className="block mb-1 text-sm text-gray-600 dark:text-gray-400">
                          Waktu
                        </label>
                        <input
                          type="time"
                          value={form.deadline_time}
                          onChange={(e) =>
                            handleChange("deadline_time", e.target.value)
                          }
                          className="w-full p-2 border border-gray-300 rounded dark:bg-gray-700 dark:text-white"
                        />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Kosongkan untuk menggunakan waktu default (23:59)
                        </p>
                      </div>
                    )}

                    {!useTime && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Deadline akan berlaku sampai akhir hari (23:59) pada
                        tanggal yang dipilih
                      </p>
                    )}
                  </div>
                )}

                {/* Random Soal - hanya untuk test, bukan tugas */}
                {!isTugas && (
                  <div className="flex items-center">
                    <input
                      id="random_soal"
                      type="checkbox"
                      checked={form.random_soal}
                      onChange={(e) =>
                        handleChange("random_soal", e.target.checked ? 1 : 0)
                      }
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="random_soal"
                      className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                    >
                      Acak urutan soal
                    </label>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? "Menyimpan..." : `Simpan ${getTestTypeLabel()}`}
                </button>
              </form>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
};

export default SlideTambahTest;
