import React, { useState, useEffect } from "react";
import FormFields from "./FormFields";
import SlideGaleryLampiran from "./SlideGaleryLampiran";
import FormPilihanGanda from "./tipeSoal/FormPilihanGanda";
import FormBenarSalah from "./tipeSoal/FormBenarSalah";
import FormMatching from "./tipeSoal/FormMatching";
import FormUraian from "./tipeSoal/FormUraian";
import { fetchAllkelas, fetchAllMapelByKelas } from "../../../api/siswaAPI";

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
  const [openLampiran, setOpenLampiran] = useState(false);
  const [openMatchingGallery, setOpenMatchingGallery] = useState({ index: null, side: null });
  const [mapels, setMapels] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  const [form, setForm] = useState({
    mapel: "",
    tipeSoal: "",
    kelasID: "",
    pertanyaan: "",
    bobot: 1,
  });

  // State tipe soal
  const [pgOptions, setPgOptions] = useState([
    { key: "a", text: "" },
    { key: "b", text: "" },
    { key: "c", text: "" },
    { key: "d", text: "" },
    { key: "e", text: "" },
  ]);
  const [jawabanBenar, setJawabanBenar] = useState("");
  const [matchingPairs, setMatchingPairs] = useState([{ left: "", right: "" }]);

  // Function untuk handle matching lampiran
  const handleSelectMatchingLampiran = (lampiran) => {
    if (openMatchingGallery.index !== null && openMatchingGallery.side) {
      const newPairs = [...matchingPairs];
      const side = openMatchingGallery.side;
      
      newPairs[openMatchingGallery.index][`${side}Lampiran`] = lampiran;
      newPairs[openMatchingGallery.index][side] = "";
      
      setMatchingPairs(newPairs);
      setOpenMatchingGallery({ index: null, side: null });
    }
  };

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
      async function fetchKelas() {
        try {
          const kelasData = await fetchAllkelas();
          setKelasList(kelasData.aktif || []);
        } catch (err) {
          console.error("Gagal fetch kelas:", err);
        }
      }
      fetchKelas();
    }
  }, [mounted]);

  // Fetch mapel saat kelas berubah
  useEffect(() => {
    if (form.kelasID) {
      async function fetchMapel() {
        try {
          const mapelData = await fetchAllMapelByKelas(form.kelasID);
          setMapels(mapelData);
        } catch (err) {
          setMapels([]);
        }
      }
      fetchMapel();
    } else {
      setMapels([]);
    }
  }, [form.kelasID]);

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
    setMapels([]);
    setOpenMatchingGallery({ index: null, side: null });
  };

  const handleChange = (field, value) => {
    if (field === "openLampiran") {
      setOpenLampiran(true);
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
      // Reset mapel kalau kelas diganti
      if (field === "kelasID") setForm((prev) => ({ ...prev, mapel: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let pilihan_jawaban = "";
    let jawaban_benar = jawabanBenar;

    if (form.tipeSoal === "pg") {
      pilihan_jawaban = JSON.stringify(pgOptions.map((opt) => opt.text));
    } else if (form.tipeSoal === "matching") {
      pilihan_jawaban = JSON.stringify(matchingPairs.map(pair => ({
        left: pair.left,
        right: pair.right,
        leftLampiran: pair.leftLampiran || null,
        rightLampiran: pair.rightLampiran || null
      })));
      jawaban_benar = "";
    } else if (form.tipeSoal === "bs") {
      pilihan_jawaban = "";
    } else {
      pilihan_jawaban = "";
      jawaban_benar = "";
    }

    const payload = {
      mapel: form.mapel,
      tipe_soal: form.tipeSoal,
      kelas_id: form.kelasID,
      pertanyaan: form.pertanyaan,
      bobot: form.bobot,
      pilihan_jawaban,
      jawaban_benar,
      lampiran_id: form.lampiran ? form.lampiran.id : null,
    };

    console.log("Data yang dikirim ke backend:", payload);
    onSubmit(payload);
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

        {/* FORM - Ini yang utama */}
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
              onOpenGallery={setOpenMatchingGallery}  // PASS PROPS DI SINI
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
      
      {/* SlideGaleryLampiran untuk form utama */}
      <SlideGaleryLampiran
        isOpen={openLampiran}
        onClose={() => setOpenLampiran(false)}
        onSelectLampiran={(lampiran) => {
          setForm((prev) => ({ ...prev, lampiran }));
          setOpenLampiran(false);
        }}
      />

      {/* SlideGaleryLampiran untuk matching */}
      <SlideGaleryLampiran
        isOpen={openMatchingGallery.index !== null}
        onClose={() => setOpenMatchingGallery({ index: null, side: null })}
        onSelectLampiran={handleSelectMatchingLampiran}
      />
    </>
  );
};

export default SlideTambahBankSoal;