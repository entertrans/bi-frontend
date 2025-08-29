import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import FormFields from "../../guru/banksoal/FormFields";
import SlideGaleryLampiran from "../../guru/banksoal/SlideGaleryLampiran";
import FormPilihanGanda from "../../guru/banksoal/tipeSoal/FormPilihanGanda";
import FormBenarSalah from "../../guru/banksoal/tipeSoal/FormBenarSalah";
import FormMatching from "../../guru/banksoal/tipeSoal/FormMatching";
import FormUraian from "../../guru/banksoal/tipeSoal/FormUraian";
import { createSoal } from "../../../api/bankSoalAPI";
import { showToast } from "../../../utils/toast";

const tipeSoalOptionsBank = [
  { value: "pg", label: "Pilihan Ganda" },
  { value: "pg_kompleks", label: "Pilihan Ganda Kompleks" },
  { value: "uraian", label: "Uraian" },
  { value: "bs", label: "Benar / Salah" },
  { value: "matching", label: "Mencocokkan" },
  { value: "isian_singkat", label: "Isian Singkat" },
];

const SlideTambahBankSoal = ({ isOpen, onClose, kelas, mapel }) => {
  const [errors, setErrors] = useState({});
  const [openLampiran, setOpenLampiran] = useState(false);
  const [openMatchingGallery, setOpenMatchingGallery] = useState({
    index: null,
    side: null,
  });

  // Perbaiki inisialisasi state form
  const [form, setForm] = useState({
    kelasID: kelas?.kd_kelas || kelas?.kelas_id || "",
    kelas_nama: kelas?.nm_kelas || kelas?.kelas_nama || "",
    mapelID: mapel?.kd_mapel || "",
    mapel_nama: mapel?.nm_mapel || "",
    tipeSoal: "",
    pertanyaan: "",
    bobot: 1,
    lampiran: null,
  });

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      kelasID: kelas?.kd_kelas || kelas?.kelas_id || "",
      kelas_nama: kelas?.nm_kelas || kelas?.kelas_nama || "",
      mapelID: mapel?.kd_mapel || "",
      mapel_nama: mapel?.nm_mapel || "",
    }));
  }, [kelas, mapel]);

  // 🟢 state tambahan utk tipe soal tertentu
  const [pgOptions, setPgOptions] = useState([
    { key: "a", text: "" },
    { key: "b", text: "" },
    { key: "c", text: "" },
    { key: "d", text: "" },
    { key: "e", text: "" },
  ]);
  const [jawabanBenar, setJawabanBenar] = useState(
    form.tipeSoal === "pg_kompleks" ? [] : ""
  );
  const [matchingPairs, setMatchingPairs] = useState([{ left: "", right: "" }]);

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

  //reset
  const resetForm = () => {
    setForm((prev) => ({
      ...prev,
      tipeSoal: "",
      pertanyaan: "",
      bobot: 1,
      lampiran: null,
    }));
    setPgOptions([
      { key: "a", text: "" },
      { key: "b", text: "" },
      { key: "c", text: "" },
      { key: "d", text: "" },
      { key: "e", text: "" },
    ]);
    setBsPernyataan([{ teks: "", jawaban: "" }]);

    // Reset berdasarkan tipe soal yang aktif
    setJawabanBenar(form.tipeSoal === "pg_kompleks" ? [] : "");

    setMatchingPairs([{ left: "", right: "" }]);
    setOpenMatchingGallery({ index: null, side: null });
  };
  const [bsPernyataan, setBsPernyataan] = useState([{ teks: "", jawaban: "" }]);

  // 🟢 handler form umum
  const handleChange = (field, value) => {
    if (field === "openLampiran") {
      setOpenLampiran(true);
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  useEffect(() => {
    if (form.tipeSoal === "pg_kompleks") {
      setJawabanBenar([]);
    } else {
      setJawabanBenar("");
    }
  }, [form.tipeSoal]);

  // 🟢 submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    let newErrors = {};

    // === VALIDASI UTAMA ===
    if (!form.tipeSoal) {
      newErrors.tipeSoal = "Tipe soal harus dipilih";
    }
    if (!form.pertanyaan.trim()) {
      newErrors.pertanyaan = "Pertanyaan tidak boleh kosong";
    }

    // === VALIDASI TIPE SOAL ===
    if (form.tipeSoal === "pg" || form.tipeSoal === "pg_kompleks") {
      pgOptions.forEach((opt, i) => {
        if (!opt.text.trim()) {
          newErrors[`pg_${i}`] = `Pilihan ${String.fromCharCode(
            65 + i
          )} kosong`;
        }
      });

      if (form.tipeSoal === "pg" && jawabanBenar === "") {
        newErrors.jawabanBenar = "Pilih jawaban benar";
      }
      if (form.tipeSoal === "pg_kompleks" && jawabanBenar.length === 0) {
        newErrors.jawabanBenar = "Minimal satu jawaban benar";
      }
    }

    if (form.tipeSoal === "bs") {
      bsPernyataan.forEach((p, i) => {
        if (!p.teks.trim()) {
          newErrors[`pernyataan_${i}`] = "Pernyataan harus diisi";
        }
        if (!p.jawaban) {
          newErrors[`jawaban_${i}`] = "Jawaban harus dipilih";
        }
      });
    }

    if (form.tipeSoal === "matching") {
      matchingPairs.forEach((pair, i) => {
        if (!pair.left && !pair.leftLampiran) {
          newErrors[`matching_left_${i}`] = "Isi teks/gambar sisi kiri";
        }
        if (!pair.right && !pair.rightLampiran) {
          newErrors[`matching_right_${i}`] = "Isi teks/gambar sisi kanan";
        }
      });
    }

    // set error ke state
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast("Isi semua form terlebih dahulu", "error"); // ✅ alert
      return;
    }

    // === LANJUT PROSES SUBMIT ===
    let pilihan_jawaban = "[]";
    let jawaban_benar = "[]";

    if (form.tipeSoal === "pg") {
      pilihan_jawaban = JSON.stringify(pgOptions.map((opt) => opt.text));
      jawaban_benar = JSON.stringify([jawabanBenar.toString()]);
    } else if (form.tipeSoal === "pg_kompleks") {
      pilihan_jawaban = JSON.stringify(pgOptions.map((opt) => opt.text));
      jawaban_benar = JSON.stringify(jawabanBenar.map((i) => i.toString()));
    } else if (form.tipeSoal === "matching") {
      pilihan_jawaban = JSON.stringify(
        matchingPairs.map((pair) => ({
          left: pair.left,
          right: pair.right,
          leftLampiran: pair.leftLampiran || null,
          rightLampiran: pair.rightLampiran || null,
        }))
      );
    } else if (form.tipeSoal === "bs") {
      // Pilihan jawaban = array object { teks }
      pilihan_jawaban = JSON.stringify(
        bsPernyataan.map((p) => ({
          teks: p.teks.trim(),
        }))
      );

      // Jawaban benar = array string ("benar"/"salah")
      jawaban_benar = JSON.stringify(bsPernyataan.map((p) => p.jawaban));
    } else if (
      form.tipeSoal === "uraian" ||
      form.tipeSoal === "isian_singkat"
    ) {
      jawaban_benar = JSON.stringify([jawabanBenar || ""]);
    }

    const payloadBank = {
      guru_id: 1,
      mapel_id: Number(form.mapelID),
      kelas_id: Number(form.kelasID),
      tipe_soal: form.tipeSoal,
      pertanyaan: form.pertanyaan,
      bobot: Number(form.bobot),
      pilihan_jawaban,
      jawaban_benar,
      lampiran_id: form.lampiran?.lampiran_id || null,
    };

    // console.log("Data ke backend:", payloadBank);

    try {
      await createSoal(payloadBank);
      showToast("Soal berhasil ditambahkan", "success");
      resetForm();
      onClose();
    } catch (error) {
      showToast("Gagal menambahkan soal", "error");
    }
  };

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={() => {
            resetForm();
            onClose();
          }}
        ></div>

        {/* panel slide */}
        <Transition.Child
          enter="transform transition ease-in-out duration-300"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-300"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
          className="relative bg-white dark:bg-gray-800 w-full max-w-4xl h-full shadow-xl"
        >
          <div className="flex flex-col h-full">
            {/* header */}
            <div className="px-4 py-3 border-b flex justify-between items-center">
              <h2 className="font-bold text-lg">
                Tambah Soal - {form.kelas_nama} - {form.mapel_nama}
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  onClose();
                }}
                className="text-gray-500 hover:text-red-500"
              >
                ✕
              </button>
            </div>

            {/* isi form */}
            <div className="flex-1 overflow-y-auto">
              <form className="p-4 space-y-4" onSubmit={handleSubmit}>
                <FormFields
                  form={form}
                  onChange={handleChange}
                  tipeSoalOptions={tipeSoalOptionsBank}
                  errors={errors}
                  setErrors={setErrors}
                />

                {(form.tipeSoal === "pg" ||
                  form.tipeSoal === "pg_kompleks") && (
                  <FormPilihanGanda
                    options={pgOptions}
                    setOptions={setPgOptions}
                    jawabanBenar={jawabanBenar}
                    setJawabanBenar={setJawabanBenar}
                    isKompleks={form.tipeSoal === "pg_kompleks"}
                    errors={errors}
                    setErrors={setErrors}
                  />
                )}

                {form.tipeSoal === "bs" && (
                  <FormBenarSalah
                    pernyataan={bsPernyataan}
                    setPernyataan={setBsPernyataan}
                    errors={errors}
                    setErrors={setErrors}
                  />
                )}

                {form.tipeSoal === "matching" && (
                  <FormMatching
                    pairs={matchingPairs}
                    setPairs={setMatchingPairs}
                    onOpenGallery={setOpenMatchingGallery}
                    errors={errors}
                    setErrors={setErrors}
                  />
                )}

                {(form.tipeSoal === "uraian" ||
                  form.tipeSoal === "isian_singkat") && <FormUraian />}

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
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Simpan
                </button>
              </form>
            </div>
          </div>
        </Transition.Child>
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
    </Transition>
  );
};

export default SlideTambahBankSoal;
