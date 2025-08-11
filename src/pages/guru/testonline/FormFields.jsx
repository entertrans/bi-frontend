import React from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "katex/dist/katex.min.css";
import katex from "katex";

// Daftarkan KaTeX ke window
window.katex = katex;

// Import module formula
import "quill/formula";


const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["formula"], // tombol Sigma untuk rumus
    ["clean"],
  ],
  formula: true,
};

const FormFields = ({ mapels, kelasList, form, onChange, tipeSoalOptions }) => {
  return (
    <>
      {/* Dropdown Mapel */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">Mapel</label>
        <select
          value={form.mapel}
          onChange={(e) => onChange("mapel", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Pilih Mapel --</option>
          {mapels.map((m) => (
            <option key={m.kd_mapel} value={m.kd_mapel}>
              {m.nm_mapel}
            </option>
          ))}
        </select>
      </div>

      {/* Dropdown Kelas */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">Kelas</label>
        <select
          value={form.kelasID}
          onChange={(e) => onChange("kelasID", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Pilih Kelas --</option>
          {kelasList.map((k) => (
            <option key={k.kelas_id} value={k.kelas_id}>
              {k.kelas_nama}
            </option>
          ))}
        </select>
      </div>

      {/* Tipe Soal */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">Tipe Soal</label>
        <select
          value={form.tipeSoal}
          onChange={(e) => onChange("tipeSoal", e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-gray-900 dark:bg-gray-800 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Pilih Tipe Soal --</option>
          {tipeSoalOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pertanyaan */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Pertanyaan (Quill + Rumus)
        </label>
        <ReactQuill
          theme="snow"
          value={form.pertanyaan}
          onChange={(value) => onChange("pertanyaan", value)}
          modules={modules}
        />
      </div>
    </>
  );
};

export default FormFields;
