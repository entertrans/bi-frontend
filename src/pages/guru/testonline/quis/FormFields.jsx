// src/components/guru/quis/FormFields.js
import React from "react";
import TinyMCEWrapper from "../../banksoal/TinyMCEWrapper";

const FormFields = ({ form, onChange, tipeSoalOptions }) => {
  const handleEditorChange = (data) => {
    onChange("pertanyaan", data);
  };

  return (
    <div className="space-y-4">
      {/* Dropdown Tipe Soal */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Tipe Soal *
        </label>
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

      {/* Lampiran */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Lampiran
        </label>
        {form.lampiran ? (
          <div className="flex items-center space-x-3">
            {form.lampiran.tipe_file === "image" ? (
              <img
                src={`http://localhost:8080/${form.lampiran.path_file}`}
                alt={form.lampiran.nama_file}
                className="w-16 h-16 object-cover rounded border"
              />
            ) : (
              <div className="w-16 h-16 flex items-center justify-center rounded bg-gray-200 dark:bg-gray-700">
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {form.lampiran.tipe_file?.toUpperCase()}
                </span>
              </div>
            )}
            <span className="text-gray-900 dark:text-gray-200">
              {form.lampiran.nama_file}
            </span>
            <button
              type="button"
              onClick={() => onChange("lampiran", null)}
              className="text-red-500 hover:underline"
            >
              Hapus
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onChange("openLampiran", true)}
            className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-gray-800 dark:text-white"
          >
            Pilih Lampiran
          </button>
        )}
      </div>

      {/* Editor Pertanyaan */}
      <div>
        <label className="block mb-1 text-gray-700 dark:text-gray-300">
          Pertanyaan *
        </label>
        <TinyMCEWrapper
          value={form.pertanyaan || ""}
          onChange={handleEditorChange}
          height={200}
          placeholder="Tulis pertanyaan disini..."
          toolbar="bold italic underline | bullist numlist | removeformat"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Bisa copy-paste langsung dari Word. Gunakan toolbar untuk formatting.
        </p>
      </div>
    </div>
  );
};

export default FormFields;
