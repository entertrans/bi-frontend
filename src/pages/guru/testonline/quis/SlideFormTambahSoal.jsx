import React, { useState, useEffect } from "react";
import { Transition } from "@headlessui/react";
import FormFields from "./FormFields";
// import FormFields from "./FormFields";
import SlideGaleryLampiran from "../../../guru/banksoal/SlideGaleryLampiran";
import FormPilihanGanda from "../../../guru/banksoal/tipeSoal/FormPilihanGanda";
import FormBenarSalah from "../../../guru/banksoal/tipeSoal/FormBenarSalah";
import FormMatching from "../../../guru/banksoal/tipeSoal/FormMatching";
import FormUraian from "../../../guru/banksoal/tipeSoal/FormUraian";
import { createTestSoal } from "../../../../api/testOnlineAPI"; // ⬅️ endpoint baru
import { showToast } from "../../../../utils/toast";

const tipeSoalOptionsQuis = [
  { value: "pg", label: "Pilihan Ganda" },
  { value: "pg_kompleks", label: "Pilihan Ganda Kompleks" },
  { value: "uraian", label: "Uraian" },
  { value: "matching", label: "Mencocokkan" },
  { value: "isian_singkat", label: "Isian Singkat" },
];

const SlideFormTambahSoal = ({ isOpen, onClose, test, onSuccess }) => {
  const [openLampiran, setOpenLampiran] = useState(false);
  const [openMatchingGallery, setOpenMatchingGallery] = useState({
    index: null,
    side: null,
  });

  const [form, setForm] = useState({
    tipeSoal: "",
    pertanyaan: "",
    bobot: 1,
    lampiran: null,
  });

  // 🟢 reset setiap kali test berubah
  useEffect(() => {
    setForm({
      tipeSoal: "",
      pertanyaan: "",
      bobot: 1,
      lampiran: null,
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
  }, [test]);

  // 🟢 state tambahan utk tipe soal
  const [pgOptions, setPgOptions] = useState([
    { key: "a", text: "" },
    { key: "b", text: "" },
    { key: "c", text: "" },
    { key: "d", text: "" },
    { key: "e", text: "" },
  ]);
  const [jawabanBenar, setJawabanBenar] = useState("");
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

  const handleChange = (field, value) => {
    if (field === "openLampiran") {
      setOpenLampiran(true);
    } else {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  // 🟢 submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    let pilihan_jawaban = "[]";
    let jawaban_benar = "[]";

    if (form.tipeSoal === "pg") {
      pilihan_jawaban = JSON.stringify(pgOptions.map((opt) => opt.text));
      jawaban_benar = JSON.stringify([jawabanBenar]);
    } else if (form.tipeSoal === "pg_kompleks") {
      pilihan_jawaban = JSON.stringify(pgOptions.map((opt) => opt.text));
      jawaban_benar = JSON.stringify(jawabanBenar);
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
      jawaban_benar = JSON.stringify([jawabanBenar]);
    } else if (
      form.tipeSoal === "uraian" ||
      form.tipeSoal === "isian_singkat"
    ) {
      jawaban_benar = JSON.stringify([jawabanBenar || ""]);
    }

    const payloadQuis = {
      test_id: test?.test_id,
      tipe_soal: form.tipeSoal,
      pertanyaan: form.pertanyaan,
      bobot: Number(form.bobot),
      pilihan_jawaban,
      jawaban_benar,
      lampiran_id: form.lampiran?.lampiran_id || null,
    };
    try {
      // console.log(payloadQuis);

      await createTestSoal(payloadQuis);
      showToast("Soal berhasil ditambahkan", "success");
      // Reset form
      setForm({
        tipeSoal: "",
        pertanyaan: "",
        bobot: 1,
        lampiran: null,
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

      // Panggil callback
      if (onSuccess) onSuccess();

      onClose();
    } catch (error) {
      showToast("Gagal menambahkan soal", "error");
      console.error("Error creating soal:", error);
    }
  };

  return (
    <Transition show={isOpen}>
      <div className="fixed inset-0 flex justify-end z-50">
        {/* overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={onClose}
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
                Tambah Soal Quis - {test?.judul}
              </h2>
              <button
                onClick={onClose}
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
                  tipeSoalOptions={tipeSoalOptionsQuis}
                />

                {(form.tipeSoal === "pg" ||
                  form.tipeSoal === "pg_kompleks") && (
                  <FormPilihanGanda
                    options={pgOptions}
                    setOptions={setPgOptions}
                    jawabanBenar={jawabanBenar}
                    setJawabanBenar={setJawabanBenar}
                    isKompleks={form.tipeSoal === "pg_kompleks"}
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
                    onOpenGallery={setOpenMatchingGallery}
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

      {/* SlideGaleryLampiran */}
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

export default SlideFormTambahSoal;
