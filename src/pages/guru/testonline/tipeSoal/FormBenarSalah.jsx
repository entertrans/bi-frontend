import React from "react";

const FormBenarSalah = ({ jawabanBenar, setJawabanBenar }) => {
  return (
    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
        Jawaban Benar
      </label>
      <select
        value={jawabanBenar}
        onChange={(e) => setJawabanBenar(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">-- Pilih Jawaban Benar --</option>
        <option value="benar">Benar</option>
        <option value="salah">Salah</option>
      </select>
    </div>
  );
};

export default FormBenarSalah;
