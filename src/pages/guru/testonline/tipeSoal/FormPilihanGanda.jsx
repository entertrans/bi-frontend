import React from "react";

const FormPilihanGanda = ({ options, setOptions, jawabanBenar, setJawabanBenar }) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  return (
    <div>
      <label className="block mb-1 text-gray-700 dark:text-gray-300 font-semibold">
        Pilihan Jawaban
      </label>
      {options.map((opt, i) => (
        <div key={opt.key} className="flex items-center mb-2">
          <span className="mr-2 font-bold">{opt.key.toUpperCase()}.</span>
          <input
            type="text"
            value={opt.text}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Jawaban pilihan ${opt.key.toUpperCase()}`}
            required
          />
        </div>
      ))}

      <label className="block mt-4 mb-1 text-gray-700 dark:text-gray-300 font-semibold">
        Jawaban Benar
      </label>
      <select
        value={jawabanBenar}
        onChange={(e) => setJawabanBenar(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      >
        <option value="">-- Pilih Jawaban Benar --</option>
        {options.map((opt) =>
          opt.text.trim() !== "" ? (
            <option key={opt.key} value={opt.key}>
              {opt.key.toUpperCase()}. {opt.text}
            </option>
          ) : null
        )}
      </select>
    </div>
  );
};

export default FormPilihanGanda;
