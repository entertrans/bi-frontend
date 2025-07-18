import React, { useEffect, useState } from "react";
import EditableField from "./EditableField";
import { updateSiswaField, uploadDokumen } from "../../../api/siswaAPI";
import DokumenUploadField from "./DokumenUploadField";
import { showToast } from "../../../utils/toast";
import Swal from "sweetalert2";

import {
  fetchAllkelas,
  fetchAllagama,
  fetchAllSatelit,
} from "../../../api/siswaAPI";
import { FaUser, FaPaperclip, FaUserFriends } from "react-icons/fa";
const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dalcsrtd9/image/upload/v1751646282/404_f4obmp.jpg";

const TABS = [
  { key: "informasi", label: "Informasi", icon: <FaUser /> },
  { key: "orangtua", label: "Orangtua Siswa", icon: <FaUserFriends /> },
  { key: "wali", label: "Wali Siswa", icon: <FaUserFriends /> },
  { key: "lampiran", label: "Lampiran", icon: <FaPaperclip /> },
];

const dokumenList = [
  { id: "profil-picture", label: "Photo Profile" },
  { id: "ktp-ayah", label: "KTP Ayah" },
  { id: "ktp-ibu", label: "KTP Ibu" },
  { id: "kk", label: "Kartu Keluarga" },
  { id: "akta", label: "Akta Lahir" },
  { id: "kitas", label: "KITAS (optional)" },
  { id: "ijazah-depan", label: "Ijazah Depan (SMP/SMA)" },
  { id: "ijazah-belakang", label: "Ijazah Belakang (SMP/SMA)" },
  { id: "surat-pindah", label: "Surat Pindah (optional)" },
  { id: "surat-perjanjian", label: "Surat Perjanjian" },
];

const jenkelList = [
  { value: "L", label: "Laki-laki" },
  { value: "P", label: "Perempuan" },
];
const negaraList = [
  { value: "Indonesia", label: "Indonesia" },
  { value: "Asing", label: "Warga Negara Asing" },
];

const formatTanggal = (tanggal) => {
  if (!tanggal) return "-";
  const bulanIndo = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];
  const [tahun, bulan, hari] = tanggal.split("-");
  return `${parseInt(hari)} ${bulanIndo[parseInt(bulan) - 1]} ${tahun}`;
};

const SiswaDetailPanel = ({ siswa, isOpen, onClose }) => {
  const [files, setFiles] = useState({});
  const [savedStatus, setSavedStatus] = useState({});
  const [kelasList, setKelasList] = useState([]);
  const [agamaList, setAgamaList] = useState([]);
  const [satelitList, setSatelitList] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("informasi");
  const [dokumenListState, setDokumenListState] = useState(dokumenList);

  // const [siswaState, setSiswaState] = useState(siswa);
  const handleFileChange = (id, file) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
    setSavedStatus((prev) => ({ ...prev, [id]: false }));
  };
  const handleSave = async (id) => {
    const file = files[id];
    const nis = currentSiswa?.siswa_nis;
    if (!file || !nis) return;

    try {
      const data = await uploadDokumen(nis, id, file); // ← pakai API centralized
      showToast(`Upload ${id} berhasil`);

      setSavedStatus((prev) => ({ ...prev, [id]: true }));
      setDokumenListState((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, preview: data.url } : item
        )
      );
    } catch (err) {
      console.error(err);
      showToast("Upload gagal");
    }
  };

  const [currentSiswa, setCurrentSiswa] = useState(siswa);

  const handleFieldSave = async (field, value) => {
    try {
      const nis = currentSiswa?.siswa_nis;
      if (!nis) throw new Error("NIS tidak ditemukan");

      // Optimistic update (langsung update UI)
      setCurrentSiswa((prev) => ({
        ...prev,
        [field]: value,
      }));

      // Kirim ke backend
      await updateSiswaField(nis, field, value);
      // console.log(`Field ${field} berhasil diperbarui.`);
      showToast(`Berhasil mengubah ${field}`);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal menyimpan!",
        text: error.message || "Terjadi kesalahan.",
      });
      console.error("Gagal update:", error);
    }
  };

  useEffect(() => {
    if (siswa) {
      setCurrentSiswa(siswa);
    }
  }, [siswa]);
  useEffect(() => {
    if (siswa?.lampiran && Array.isArray(siswa.lampiran)) {
      const updatedList = dokumenList.map((item) => {
        const found = siswa.lampiran.find(
          (lampiran) => lampiran.dokumen_jenis === item.id
        );
        return {
          ...item,
          preview: found?.url || DEFAULT_IMAGE,
        };
      });

      setDokumenListState(updatedList);
    }
  }, [siswa]);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setTimeout(() => setShowPanel(true), 10);
    } else {
      setShowPanel(false);
      setTimeout(() => setIsMounted(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const kelasRes = await fetchAllkelas(); // hasilnya punya 'aktif' & 'alumni'
        const agamaRes = await fetchAllagama(); // anggap hasilnya array [{agama_id, agama_nama}]
        const satelitRes = await fetchAllSatelit(); // anggap hasilnya array [{satelit_id, satelit_nama}]

        // Gabungkan kelas aktif dan alumni kalau perlu
        const allKelas = [...kelasRes.aktif, ...kelasRes.alumni];

        setKelasList(
          allKelas.map((k) => ({
            value: k.kelas_id,
            label: k.kelas_nama.replace(/^Kelas\s*/i, ""),
          }))
        );

        setAgamaList(
          agamaRes.map((a) => ({
            value: a.agama_id,
            label: a.agama_nama,
          }))
        );
        setSatelitList(
          satelitRes.map((s) => ({
            value: s.satelit_id,
            label: s.satelit_nama,
          }))
        );
      } catch (err) {
        console.error("Gagal memuat data dropdown:", err);
      }
    };

    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  if (!isMounted) return null;

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      ></div>

      <div
        className={`overflow-y-auto scroll-thin scroll-hidden fixed top-0 right-0 h-full w-full sm:w-[600px] z-50 bg-white dark:bg-gray-900 shadow-lg transition-transform duration-300 transform ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold dark:text-white">
            Detail Siswa
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-600 dark:text-gray-300"
          >
            ❌
          </button>
        </div>

        <div className="flex flex-col items-center justify-center my-6">
          <img
            src={
              dokumenListState.find((d) => d.id === "profil-picture")
                ?.preview || DEFAULT_IMAGE
            }
            alt="Foto Siswa"
            className="w-24 h-24 rounded-full border-2 border-blue-500 shadow"
          />
          <p className="text-xl font-bold text-gray-800 dark:text-white mt-4">
            {currentSiswa?.siswa_nama}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {currentSiswa?.siswa_nis} | {currentSiswa?.siswa_nisn}
          </p>
        </div>

        <div className="flex overflow-x-auto border-b dark:border-gray-700">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 overflow-y-auto text-sm dark:text-white">
          {activeTab === "informasi" && (
            <div className="space-y-3 text-sm">
              <EditableField
                label="Nama Lengkap"
                value={currentSiswa?.siswa_nama}
                onSave={(val) => handleFieldSave("siswa_nama", val)}
              />
              <EditableField
                label="Alamat"
                value={currentSiswa?.siswa_alamat}
                onSave={(val) => handleFieldSave("siswa_alamat", val)}
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField
                  label="Cabang"
                  value={currentSiswa?.Satelit?.satelit_nama}
                  rawValue={currentSiswa?.Satelit?.satelit_id}
                  options={satelitList}
                  onSave={(val) => handleFieldSave("siswa_satelit", val)}
                />
                <EditableField
                  label="Agama"
                  value={currentSiswa?.agama?.agama_nama}
                  rawValue={currentSiswa?.agama?.agama_id}
                  options={agamaList}
                  onSave={(val) => handleFieldSave("agama_nama", val)}
                />
                <EditableField
                  label="Kelas"
                  value={currentSiswa?.kelas?.kelas_nama.replace(
                    /^Kelas\s*/i,
                    ""
                  )}
                  rawValue={currentSiswa?.siswa_kelas_id}
                  options={kelasList}
                  onSave={(val) => handleFieldSave("siswa_kelas_id", val)}
                />
                <EditableField
                  label="NISN Siswa"
                  value={currentSiswa?.siswa_nisn}
                  onSave={(val) => handleFieldSave("siswa_nisn", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="NIK Siswa"
                  value={currentSiswa?.nik_siswa}
                  onSave={(val) => handleFieldSave("nik_siswa", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Anak Ke"
                  value={currentSiswa?.anak_ke}
                  onSave={(val) => handleFieldSave("anak_ke", val)}
                />
                <EditableField
                  label="No Ijazah"
                  value={currentSiswa?.no_ijazah}
                  onSave={(val) => handleFieldSave("no_ijazah", val)}
                />
                <EditableField
                  label="Sekolah Asal"
                  value={currentSiswa?.sekolah_asal}
                  onSave={(val) => handleFieldSave("sekolah_asal", val)}
                />
                <EditableField
                  label="No. Telp"
                  value={currentSiswa?.siswa_no_telp}
                  onSave={(val) => handleFieldSave("siswa_no_telp", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Tempat Lahir"
                  value={currentSiswa?.siswa_tempat}
                  onSave={(val) => handleFieldSave("siswa_tempat", val)}
                />

                <EditableField
                  label="Tanggal Lahir"
                  value={formatTanggal(currentSiswa?.siswa_tgl_lahir)}
                  rawValue={currentSiswa?.siswa_tgl_lahir}
                  type="date"
                  onSave={(val) => handleFieldSave("siswa_tgl_lahir", val)}
                />

                <EditableField
                  label="Jenis Kelamin"
                  value={
                    currentSiswa?.siswa_jenkel === "P"
                      ? "Perempuan"
                      : currentSiswa?.siswa_jenkel === "L"
                      ? "Laki-laki"
                      : "-"
                  }
                  rawValue={currentSiswa?.siswa_jenkel}
                  options={jenkelList}
                  onSave={(val) => handleFieldSave("siswa_jenkel", val)}
                />
                <EditableField
                  label="Email"
                  value={currentSiswa?.siswa_email}
                  onSave={(val) => handleFieldSave("siswa_email", val)}
                />
                <EditableField
                  label="Kewarganegaraan"
                  value={currentSiswa?.siswa_kewarganegaraan}
                  rawValue={currentSiswa?.siswa_kewarganegaraan}
                  options={negaraList}
                  onSave={(val) =>
                    handleFieldSave("siswa_kewarganegaraan", val)
                  }
                />
              </div>
            </div>
          )}

          {activeTab === "orangtua" && (
            <div className="space-y-3 text-sm">
              <h3 className="text-center py-3 font-semibold text-gray-800 dark:text-white mb-2">
                Biodata Ayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField
                  label="Nama Ayah"
                  value={currentSiswa?.orangtua?.ayah_nama}
                  onSave={(val) => handleFieldSave("ayah_nama", val)}
                />
                <EditableField
                  label="NIK"
                  value={currentSiswa?.orangtua?.ayah_nik}
                  onSave={(val) => handleFieldSave("ayah_nik", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Tempat Lahir"
                  value={currentSiswa?.orangtua?.ayah_tempat}
                  onSave={(val) => handleFieldSave("ayah_tempat", val)}
                />
                <EditableField
                  label="Tanggal Lahir"
                  value={formatTanggal(currentSiswa?.orangtua?.ayah_tanggal)}
                  rawValue={currentSiswa?.orangtua?.ayah_tanggal}
                  type="date"
                  onSave={(val) => handleFieldSave("ayah_tanggal", val)}
                />
                <EditableField
                  label="Pendidikan Terakhir"
                  value={currentSiswa?.orangtua?.ayah_pekerjaan}
                  onSave={(val) => handleFieldSave("ayah_pekerjaan", val)}
                />
                <EditableField
                  label="No. Telp Ayah"
                  value={currentSiswa?.orangtua?.no_telp_ayah}
                  onSave={(val) => handleFieldSave("no_telp_ayah", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Email"
                  value={currentSiswa?.orangtua?.email_ayah}
                  onSave={(val) => handleFieldSave("email_ayah", val)}
                />
              </div>
              <h3 className="text-center py-3 font-semibold text-gray-800 dark:text-white mb-2">
                Biodata Ibu
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField
                  label="Nama Ibu"
                  value={currentSiswa?.orangtua?.ibu_nama}
                  onSave={(val) => handleFieldSave("ibu_nama", val)}
                />
                <EditableField
                  label="NIK"
                  value={currentSiswa?.orangtua?.ibu_nik}
                  onSave={(val) => handleFieldSave("ibu_nik", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Tempat Lahir"
                  value={currentSiswa?.orangtua?.ibu_tempat}
                  onSave={(val) => handleFieldSave("ibu_tempat", val)}
                />
                <EditableField
                  label="Tanggal Lahir"
                  value={formatTanggal(currentSiswa?.orangtua?.ibu_tanggal)}
                  rawValue={currentSiswa?.orangtua?.ibu_tanggal}
                  type="date"
                  onSave={(val) => handleFieldSave("ibu_tanggal", val)}
                />
                <EditableField
                  label="Pendidikan Terakhir"
                  value={currentSiswa?.orangtua?.ibu_pekerjaan}
                  onSave={(val) => handleFieldSave("ibu_pekerjaan", val)}
                />
                <EditableField
                  label="No. Telp Ibu"
                  value={currentSiswa?.orangtua?.no_telp_ibu}
                  onSave={(val) => handleFieldSave("no_telp_ibu", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Email"
                  value={currentSiswa?.orangtua?.email_ibu}
                  onSave={(val) => handleFieldSave("email_ibu", val)}
                />
              </div>
            </div>
          )}

          {activeTab === "wali" && (
            <div className="space-y-3 text-sm">
              <h3 className="text-center py-3 font-semibold text-gray-800 dark:text-white mb-2">
                Biodata Wali
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <EditableField
                  label="Nama Ayah"
                  value={currentSiswa?.orangtua?.wali_nama}
                  onSave={(val) => handleFieldSave("wali_nama", val)}
                />
                <EditableField
                  label="NIK"
                  value={currentSiswa?.orangtua?.wali_nik}
                  onSave={(val) => handleFieldSave("wali_nik", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Tempat Lahir"
                  value={currentSiswa?.orangtua?.wali_tempat}
                  onSave={(val) => handleFieldSave("wali_tempat", val)}
                />
                <EditableField
                  label="Tanggal Lahir"
                  value={formatTanggal(currentSiswa?.orangtua?.wali_tanggal)}
                  rawValue={currentSiswa?.orangtua?.wali_tanggal}
                  type="date"
                  onSave={(val) => handleFieldSave("wali_tanggal", val)}
                />
                <EditableField
                  label="Pendidikan Terakhir"
                  value={currentSiswa?.orangtua?.wali_pekerjaan}
                  onSave={(val) => handleFieldSave("wali_pekerjaan", val)}
                />
                <EditableField
                  label="No. Telp Wali"
                  value={currentSiswa?.orangtua?.wali_notelp}
                  onSave={(val) => handleFieldSave("wali_notelp", val)}
                  onlyNumber={true}
                />
                <EditableField
                  label="Alamat"
                  value={currentSiswa?.orangtua?.wali_alamat}
                  onSave={(val) => handleFieldSave("wali_alamat", val)}
                />
              </div>
            </div>
          )}

          {activeTab === "lampiran" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              {dokumenListState.map((item) => {
                const nis = currentSiswa?.siswa_nis;
                const cloudinaryPreviewUrl = item.preview || DEFAULT_IMAGE;

                return (
                  <DokumenUploadField
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    previewUrl={cloudinaryPreviewUrl}
                    onChange={handleFileChange}
                    onSave={handleSave}
                    saved={savedStatus[item.id]}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SiswaDetailPanel;
