import React, { useState, useEffect } from "react";
import FormFields from "./FormFields";
import FormPilihanGanda from "./tipeSoal/FormPilihanGanda";
import FormBenarSalah from "./tipeSoal/FormBenarSalah";
import FormMatching from "./tipeSoal/FormMatching";
import FormUraian from "./tipeSoal/FormUraian";
import { fetchAllMapel, fetchAllkelas } from "../../../api/siswaAPI";

const tipeSoalOptions = [
  { value: "pg", label: "Pilihan Ganda" },
  { value: "uraian", label: "Uraian" },
  { value: "bs", label: "Benar / Salah" },
  { value: "matching", label: "Mencocokkan" },
  { value: "short_answer", label: "Isian Singkat" },
];

const SlideTambahBankSoal = ({ isOpen, onClose, onSubmit }) => {
  const [mounted, setMounted] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const [mapels, setMapels] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  // Form utama state
  const [form, setForm] = useState({
    mapel: "",
    tipeSoal: "",
    kelasID: "",
    pertanyaan: "",
    bobot: 1,
  });

  // State untuk tipe soal yang berbeda
  const [pgOptions, setPgOptions] = useState([
    { key: "a", text: "" },
    { key: "b", text: "" },
    { key: "c", text: "" },
    { key: "d", text: "" },
    { key: "e", text: "" },
  ]);
  const [jawabanBenar, setJawabanBenar] = useState("");
  const [matchingPairs, setMatchingPairs] = useState([{ left: "", right: "" }]);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      setTimeout(() => setShowPanel(true), 10);
    } else {
      setShowPanel(false);
      setTimeout(() => setMounted(false), 300);
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (mounted) {
      async function fetchData() {
        try {
          const mapelData = await fetchAllMapel();
          setMapels(mapelData);

          const kelasData = await fetchAllkelas();
          setKelasList(kelasData.aktif || []);
        } catch (err) {
          console.error("Gagal fetch mapel atau kelas:", err);
        }
      }
      fetchData();
    }
  }, [mounted]);

  const resetForm = () => {
    setForm({
      mapel: "",
      tipeSoal: "",
      kelasID: "",
      pertanyaan: "",
      bobot: 1,
    });
    setPgOptions([
      { key: "a", text: "" },
      { key: "b", text: "" },
      { key: "c", text: "" },
      { key: "d", text: "" },
      { key: "e", text: "" },
    ]);
    setJawabanBenar("");
    setMatchingPairs([{ left: "", right: "" }]);
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let pilihan_jawaban = "";
    let jawaban_benar = jawabanBenar;

    if (form.tipeSoal === "pg") {
      pilihan_jawaban = JSON.stringify(pgOptions.map((opt) => opt.text));
    } else if (form.tipeSoal === "matching") {
      pilihan_jawaban = JSON.stringify(matchingPairs);
      jawaban_benar = "";
    } else if (form.tipeSoal === "bs") {
      pilihan_jawaban = "";
    } else {
      pilihan_jawaban = "";
      jawaban_benar = "";
    }

    onSubmit({
      mapel: form.mapel,
      tipe_soal: form.tipeSoal,
      kelas_id: form.kelasID,
      pertanyaan: form.pertanyaan,
      bobot: form.bobot,
      pilihan_jawaban,
      jawaban_benar,
    });
  };

  if (!mounted) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          showPanel ? "opacity-50" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Slide panel */}
      <div
        className={`fixed top-0 right-0 w-full max-w-4xl h-full bg-white dark:bg-gray-900 z-50 shadow-lg overflow-auto transition-transform duration-300 ease-in-out ${
          showPanel ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Tambah Bank Soal Baru
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-2xl font-bold leading-none"
            aria-label="Tutup"
          >
            ×
          </button>
        </div>

        <form className="p-4 space-y-4" onSubmit={handleSubmit}>
          <FormFields
            mapels={mapels}
            kelasList={kelasList}
            form={form}
            onChange={handleChange}
            tipeSoalOptions={tipeSoalOptions}
          />

          {form.tipeSoal === "pg" && (
            <FormPilihanGanda
              options={pgOptions}
              setOptions={setPgOptions}
              jawabanBenar={jawabanBenar}
              setJawabanBenar={setJawabanBenar}
            />
          )}

          {form.tipeSoal === "bs" && (
            <FormBenarSalah
              jawabanBenar={jawabanBenar}
              setJawabanBenar={setJawabanBenar}
            />
          )}

          {form.tipeSoal === "matching" && (
            <FormMatching
              pairs={matchingPairs}
              setPairs={setMatchingPairs}
            />
          )}

          {(form.tipeSoal === "uraian" || form.tipeSoal === "short_answer") && (
            <FormUraian />
          )}

          {/* Bobot */}
          <div>
            <label className="block mb-1 text-gray-700 dark:text-gray-300">
              Bobot
            </label>
            <input
              type="number"
              value={form.bobot}
              onChange={(e) => handleChange("bobot", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min={1}
              max={10}
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Simpan
          </button>
        </form>
      </div>
    </>
  );
};

export default SlideTambahBankSoal;
