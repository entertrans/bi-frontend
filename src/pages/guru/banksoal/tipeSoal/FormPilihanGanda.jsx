import React from "react";
import TinyMCEWrapper from "../TinyMCEWrapper";

const FormPilihanGanda = ({
  options,
  setOptions,
  jawabanBenar,
  setJawabanBenar,
  isKompleks = false,
}) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const toggleJawabanBenar = (index) => {
    if (jawabanBenar.includes(index)) {
      setJawabanBenar(jawabanBenar.filter((item) => item !== index));
    } else {
      setJawabanBenar([...jawabanBenar, index]);
    }
  };

  return (
    <div>
      {/* === Input pilihan jawaban === */}
      <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
        Pilihan Jawaban
      </label>
      {options.map((opt, i) => (
        <div key={i} className="mb-4">
          <div className="flex items-center mb-1">
            <span className="mr-2 font-bold">
              {String.fromCharCode(65 + i)}.
            </span>
          </div>
          <TinyMCEWrapper
            value={opt.text}
            onChange={(val) => handleOptionChange(i, val)}
            height={110}
            placeholder={`Jawaban ${String.fromCharCode(65 + i)}`}
            toolbar="bold italic underline | bullist numlist | removeformat"
          />
        </div>
      ))}

      {/* === Input kunci jawaban === */}
      <label className="block mt-4 mb-1 text-gray-700 dark:text-gray-300 font-semibold">
        Jawaban Benar
      </label>

      {!isKompleks ? (
        // 🔸 Untuk PG biasa (single answer)
        <select
          value={jawabanBenar !== null ? jawabanBenar : ""}
          onChange={(e) => setJawabanBenar(parseInt(e.target.value))}
          className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">-- Pilih Jawaban Benar --</option>
          {options.map(
            (opt, i) =>
              opt.text.trim() !== "" && (
                <option key={i} value={i}>
                  {String.fromCharCode(65 + i)}.{" "}
                  {opt.text.replace(/<[^>]+>/g, "")}
                </option>
              )
          )}
        </select>
      ) : (
        // 🔸 Untuk PG kompleks (multi answer)
        <div className="w-full border border-gray-300 rounded p-3 bg-white dark:bg-gray-800 dark:text-white">
          {options.map(
            (opt, i) =>
              opt.text.trim() !== "" && (
                <label
                  key={i}
                  htmlFor={`checkbox-${i}`}
                  className="flex items-center mb-2 cursor-pointer"
                >
                  <input
                    id={`checkbox-${i}`}
                    type="checkbox"
                    checked={jawabanBenar.includes(i)}
                    onChange={() => toggleJawabanBenar(i)}
                    className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded-sm focus:ring-black dark:focus:ring-gray-400 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <span className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                    <span className="font-semibold mr-1">
                      {String.fromCharCode(65 + i)}.
                    </span>
                    {opt.text.replace(/<[^>]+>/g, "")}
                  </span>
                </label>
              )
          )}
          {jawabanBenar.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Centang satu atau lebih jawaban yang benar
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormPilihanGanda;
