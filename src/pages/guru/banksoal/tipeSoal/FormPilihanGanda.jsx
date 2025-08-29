import React from "react";
import TinyMCEWrapper from "../TinyMCEWrapper";

const FormPilihanGanda = ({
  options,
  setOptions,
  jawabanBenar,
  setJawabanBenar,
  isKompleks = false,
  errors,
  setErrors,
}) => {
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);

    // hapus error kalau sudah diisi
    if (errors && errors[`option_${index}`]) {
      const newErrors = { ...errors };
      delete newErrors[`option_${index}`];
      setErrors(newErrors);
    }
  };

  const toggleJawabanBenar = (index) => {
    if (jawabanBenar.includes(index)) {
      setJawabanBenar(jawabanBenar.filter((item) => item !== index));
    } else {
      setJawabanBenar([...jawabanBenar, index]);
    }

    // hapus error jawaban kalau sudah ada pilihan
    if (errors?.jawabanBenar) {
      const newErrors = { ...errors };
      delete newErrors.jawabanBenar;
      setErrors(newErrors);
    }
  };

  // fungsi validasi (dipanggil parent)
  const validate = () => {
    const newErrors = {};

    options.forEach((opt, i) => {
      if (!opt.text || opt.text.trim() === "") {
        newErrors[`option_${i}`] = `Pilihan ${String.fromCharCode(
          65 + i
        )} harus diisi`;
      }
    });

    if (!isKompleks && (jawabanBenar === null || jawabanBenar === "")) {
      newErrors.jawabanBenar = "Pilih jawaban yang benar";
    }

    if (isKompleks && (!jawabanBenar || jawabanBenar.length === 0)) {
      newErrors.jawabanBenar = "Centang minimal 1 jawaban yang benar";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
          {errors && errors[`option_${i}`] && (
            <p className="text-red-500 text-sm mt-1">{errors[`option_${i}`]}</p>
          )}
        </div>
      ))}

      {/* === Input kunci jawaban === */}
      <label className="block mt-4 mb-1 text-gray-700 dark:text-gray-300 font-semibold">
        Jawaban Benar
      </label>

      {!isKompleks ? (
        <div>
          <select
            value={jawabanBenar !== null ? jawabanBenar : ""}
            onChange={(e) => {
              setJawabanBenar(parseInt(e.target.value));
              if (errors?.jawabanBenar) {
                const newErrors = { ...errors };
                delete newErrors.jawabanBenar;
                setErrors(newErrors);
              }
            }}
            className={`w-full p-2 border rounded bg-white dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 ${
              errors?.jawabanBenar
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
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
          {errors?.jawabanBenar && (
            <p className="text-red-500 text-sm mt-1">{errors.jawabanBenar}</p>
          )}
        </div>
      ) : (
        <div className="w-full border rounded p-3 bg-white dark:bg-gray-800 dark:text-white">
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
                    className="w-4 h-4 text-black bg-gray-100 border-gray-300 rounded-sm focus:ring-black dark:focus:ring-gray-400 focus:ring-2"
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
          {errors?.jawabanBenar && (
            <p className="text-red-500 text-sm mt-1">{errors.jawabanBenar}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FormPilihanGanda;
