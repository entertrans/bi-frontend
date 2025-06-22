import React, { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { FaSave } from "react-icons/fa";

const dokumenList = [
  {
    id: "Photo",
    label: "Photo",
    preview: "https://picsum.photos/id/1011/800/600",
  },
  {
    id: "ktp-ayah",
    label: "KTP Ayah",
    preview: "https://picsum.photos/id/1011/800/600",
  },
  {
    id: "ktp-ibu",
    label: "KTP Ibu",
    preview: "https://picsum.photos/id/1012/800/600",
  },
  {
    id: "kk",
    label: "Kartu Keluarga",
    preview: "https://picsum.photos/id/1013/800/600",
  },
  {
    id: "akta",
    label: "Akta Lahir",
    preview: "https://picsum.photos/id/1014/800/600",
  },
  {
    id: "kitas",
    label: "KITAS (optional)",
    preview: "https://picsum.photos/id/1015/800/600",
  },
  {
    id: "ijazah-depan",
    label: "Ijazah Depan (SMP/SMA)",
    preview: "https://picsum.photos/id/1016/800/600",
  },
  {
    id: "ijazah-belakang",
    label: "Ijazah Belakang (SMP/SMA)",
    preview: "https://picsum.photos/id/1016/800/600",
  },
  {
    id: "surat-pindah",
    label: "Surat Pindah (optional)",
    preview: "https://picsum.photos/id/1018/800/600",
  },
  {
    id: "surat-perjanjian",
    label: "Surat Perjanjian",
    preview: "https://picsum.photos/id/1018/800/600",
  },
];

const kelasOptions = [
  "X IPA",
  "XI IPA",
  "XII IPA",
  "X IPS",
  "XI IPS",
  "XII IPS",
];
const LanjutkanPPDB = () => {
  const [dokumen, setDokumen] = useState({});
  const [saved, setSaved] = useState({});

  const handleFileChange = (e, id) => {
    const file = e.target.files[0];
    setDokumen((prev) => ({ ...prev, [id]: file }));
    setSaved((prev) => ({ ...prev, [id]: false }));
  };
  const handleSave = (id) => {
    if (!dokumen[id]) return alert("Pilih file terlebih dahulu.");
    console.log("Simpan dokumen:", dokumen[id]);
    setSaved((prev) => ({ ...prev, [id]: true }));
    setTimeout(() => setSaved((prev) => ({ ...prev, [id]: false })), 2000);
  };

  return (
    <div className="max-w mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
        Setting
      </h1>

      {/* Avatar & Profil Ringkas (Pusat) */}
      <div className="flex flex-col items-center justify-center mb-6">
        <img
          src="https://i.pravatar.cc/100?u=siswa1"
          alt="Foto Siswa"
          className="w-24 h-24 rounded-full border-2 border-blue-500 shadow"
        />
        <p className="text-xl font-bold text-gray-800 dark:text-white mt-4">
          Aditya Narayan
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          2017151 | 9988776655
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Kontainer 1 - Kiri Atas */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow ">
          <p className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-200 pb-5 border-b border-gray-200">
            Lampiran
          </p>

          <div className="space-y-6">
            {dokumenList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 flex-wrap border-b pb-4"
              >
                {/* Input */}
                <div className="flex-1 min-w-[100px]">
                  <label
                    htmlFor={item.id}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    {item.label}
                  </label>
                  <input
                    id={item.id}
                    type="file"
                    onChange={(e) => handleFileChange(e, item.id)}
                    className="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  />
                </div>

                {/* Preview */}
                <div className="min-w-[80px] text-end">
                  <PhotoProvider>
                    <PhotoView src={item.preview}>
                      <img
                        src={item.preview.replace("/800/600", "/120/80")}
                        alt={`Preview ${item.label}`}
                        className="w-full max-w-[80px] border rounded shadow cursor-pointer hover:opacity-90 transition"
                      />
                    </PhotoView>
                  </PhotoProvider>
                </div>

                {/* Save Button */}
                <div>
                  <button
                    onClick={() => handleSave(item.id)}
                    title="Simpan"
                    className={`p-2 text-white rounded ${
                      saved[item.id]
                        ? "bg-green-600"
                        : "bg-blue-600 hover:bg-blue-700"
                    } transition`}
                  >
                    <FaSave />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kontainer 2 - Kanan Atas */}
        <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow ">
          <div className="flex justify-between items-center mb-4 pb-5 border-b border-gray-200">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Informasi Siswa
            </p>
            <button
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              onClick={() => alert("Data orang tua/wali disimpan")}
            >
              Simpan
            </button>
          </div>

          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Nama Lengkap - Full Width */}
            <div className="col-span-2">
              <label
                htmlFor="nama"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Nama Lengkap
              </label>
              <input
                type="text"
                id="nama"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Aditya Narayan"
              />
            </div>

            {/* Alamat - Full Width */}
            <div className="col-span-2">
              <label
                htmlFor="alamat"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Alamat
              </label>
              <textarea
                id="alamat"
                rows="2"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Jl. Anggrek No.123, BSD"
              />
            </div>

            {/* Satelit */}
            <div className="col-span-2">
              <label
                htmlFor="satelit"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Satelit / Cabang
              </label>
              <select
                id="satelit"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              >
                <option value="">-- Pilih Cabang --</option>
                <option value="BSD">BSD</option>
                <option value="Serpong">Serpong</option>
                <option value="Bogor">Bogor</option>
              </select>
            </div>

            {/* Kelas */}
            <div className="col-span-2">
              <label
                htmlFor="kelas"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Kelas
              </label>
              <select
                id="kelas"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              >
                <option value="">-- Pilih Kelas --</option>
                <option value="X IPA">X IPA</option>
                <option value="XI IPS">XI IPS</option>
                <option value="XII IPA">XII IPA</option>
              </select>
            </div>

            {/* Anak Ke */}
            <div className="col-span-2">
              <label
                htmlFor="anakke"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Anak Ke
              </label>
              <input
                type="number"
                id="anakke"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="1"
              />
            </div>

            {/* NIK Siswa */}
            <div className="col-span-2">
              <label
                htmlFor="nik"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                NIK Siswa
              </label>
              <input
                type="text"
                id="nik"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="1234567890123456"
              />
            </div>

            {/* NIS */}
            <div className="col-span-2">
              <label
                htmlFor="nis"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                NIS
              </label>
              <input
                type="text"
                id="nis"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="2017151"
              />
            </div>

            {/* NISN */}
            <div className="col-span-2">
              <label
                htmlFor="nisn"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                NISN
              </label>
              <input
                type="text"
                id="nisn"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="9988776655"
              />
            </div>

            {/* No Ijazah */}
            <div className="col-span-2">
              <label
                htmlFor="noijazah"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                No Ijazah
              </label>
              <input
                type="text"
                id="noijazah"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="IJZ-09234781"
              />
            </div>

            {/* Sekolah Asal */}
            <div className="col-span-2">
              <label
                htmlFor="sekolah"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sekolah Asal
              </label>
              <input
                type="text"
                id="sekolah"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="SMPN 2 Tangerang"
              />
            </div>

            {/* No Telpon */}
            <div className="col-span-2">
              <label
                htmlFor="telepon"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                No Telepon
              </label>
              <input
                type="text"
                id="telepon"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="081234567890"
              />
            </div>

            {/* Tempat Lahir */}
            <div className="col-span-2">
              <label
                htmlFor="tempatlahir"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tempat Lahir
              </label>
              <input
                type="text"
                id="tempatlahir"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Tangerang"
              />
            </div>

            {/* Tanggal Lahir */}
            <div className="col-span-2">
              <label
                htmlFor="tanggallahir"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Tanggal Lahir
              </label>
              <input
                type="date"
                id="tanggallahir"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
            </div>

            {/* Jenis Kelamin */}
            <div className="col-span-2">
              <label
                htmlFor="jenkel"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Jenis Kelamin
              </label>
              <select
                id="jenkel"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            {/* Email */}
            <div className="col-span-2">
              <label
                htmlFor="email"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="example@email.com"
              />
            </div>

            {/* Kewarganegaraan */}
            <div className="col-span-2">
              <label
                htmlFor="kewarganegaraan"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Kewarganegaraan
              </label>
              <input
                type="text"
                id="kewarganegaraan"
                className="block w-full p-2 text-xs text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Indonesia"
              />
            </div>
          </form>
        </div>

        {/* Kontainer 3 - Bawah */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4 pb-5 border-b border-gray-200">
            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Orang Tua / Wali
            </p>
            <button
              type="button"
              className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              onClick={() => alert("Data orang tua/wali disimpan")}
            >
              Simpan
            </button>
          </div>

          {/* Form Orang Tua / Wali */}

          <form className="grid grid-cols-1 gap-6 text-xs">
            {/* Data Ayah */}
            <div className="pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
                Data Ayah
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label
                    htmlFor="namaAyah"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Nama Ayah
                  </label>
                  <input
                    type="text"
                    id="namaAyah"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="nikAyah"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    NIK
                  </label>
                  <input
                    type="text"
                    id="nikAyah"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="NIK"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tempatLahirAyah"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    id="tempatLahirAyah"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Kota/Kabupaten"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalLahirAyah"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    id="tanggalLahirAyah"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pendidikanAyah"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    id="pendidikanAyah"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="SMA / S1 / D3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telpAyah"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    No Telepon
                  </label>
                  <input
                    type="text"
                    id="telpAyah"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="08xxxx"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="emailAyah"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="emailAyah"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="email@ayah.com"
                  />
                </div>
              </div>
            </div>

            {/* Data Ibu */}
            <div className="pb-6 border-b border-gray-200">
              <p className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
                Data Ibu
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label
                    htmlFor="namaIbu"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Nama Ibu
                  </label>
                  <input
                    type="text"
                    id="namaIbu"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="nikIbu"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    NIK
                  </label>
                  <input
                    type="text"
                    id="nikIbu"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="NIK"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tempatLahirIbu"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    id="tempatLahirIbu"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalLahirIbu"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    id="tanggalLahirIbu"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="pendidikanIbu"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Pendidikan Terakhir
                  </label>
                  <input
                    type="text"
                    id="pendidikanIbu"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="SMA / S1 / D3"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telpIbu"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    No Telepon
                  </label>
                  <input
                    type="text"
                    id="telpIbu"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="emailIbu"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="emailIbu"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Data Wali */}
            <div>
              <p className="text-sm font-semibold mb-2 text-gray-800 dark:text-white">
                Data Wali (Opsional)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label
                    htmlFor="namaWali"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Nama Wali
                  </label>
                  <input
                    type="text"
                    id="namaWali"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="nikWali"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    NIK
                  </label>
                  <input
                    type="text"
                    id="nikWali"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tempatLahirWali"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    id="tempatLahirWali"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="tanggalLahirWali"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    id="tanggalLahirWali"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="telpWali"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    No Telepon
                  </label>
                  <input
                    type="text"
                    id="telpWali"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label
                    htmlFor="emailWali"
                    className="block mb-1 font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="emailWali"
                    className="block w-full p-2 border text-xs rounded-lg bg-gray-50 border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LanjutkanPPDB;
