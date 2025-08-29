import React from "react";

const FormBenarSalah = ({ pernyataan, setPernyataan, errors, setErrors }) => {
  const handleTextChange = (idx, value) => {
    const updated = [...pernyataan];
    updated[idx].teks = value;
    setPernyataan(updated);

    // Hapus error untuk field ini jika sudah diisi
    if (errors && errors[`pernyataan_${idx}`]) {
      const newErrors = { ...errors };
      delete newErrors[`pernyataan_${idx}`];
      setErrors(newErrors);
    }
  };

  const handleJawabanChange = (idx, value) => {
    const updated = [...pernyataan];
    updated[idx].jawaban = value;
    setPernyataan(updated);

    // Hapus error untuk field ini jika sudah diisi
    if (errors && errors[`jawaban_${idx}`]) {
      const newErrors = { ...errors };
      delete newErrors[`jawaban_${idx}`];
      setErrors(newErrors);
    }
  };

  const handleAdd = () => {
    setPernyataan([...pernyataan, { teks: "", jawaban: "" }]);
  };

  const handleRemove = (idx) => {
    // Jangan biarkan menghapus jika hanya tersisa 1 pernyataan
    if (pernyataan.length <= 1) {
      alert("Minimal harus ada 1 pernyataan!");
      return;
    }

    setPernyataan(pernyataan.filter((_, i) => i !== idx));

    // Hapus error untuk field yang dihapus
    if (errors) {
      const newErrors = { ...errors };
      delete newErrors[`pernyataan_${idx}`];
      delete newErrors[`jawaban_${idx}`];
      setErrors(newErrors);
    }
  };

  // Validasi sebelum submit (bisa dipanggil dari parent component)
  const validate = () => {
    const newErrors = {};

    pernyataan.forEach((p, idx) => {
      if (!p.teks.trim()) {
        newErrors[`pernyataan_${idx}`] = "Pernyataan harus diisi";
      }
      if (!p.jawaban) {
        newErrors[`jawaban_${idx}`] = "Jawaban harus dipilih";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div>
      <label className="block mb-2 text-gray-700 dark:text-gray-300 font-semibold">
        Pernyataan & Jawaban Benar/Salah
      </label>

      {pernyataan.map((p, idx) => (
        <div
          key={idx}
          className="flex items-center space-x-2 mb-2 border p-2 rounded"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder={`Pernyataan ${idx + 1}`}
              value={p.teks}
              onChange={(e) => handleTextChange(idx, e.target.value)}
              className={`w-full p-2 border rounded dark:bg-gray-800 dark:text-white ${
                errors && errors[`pernyataan_${idx}`] ? "border-red-500" : ""
              }`}
            />
            {errors && errors[`pernyataan_${idx}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`pernyataan_${idx}`]}
              </p>
            )}
          </div>

          <div className="w-40">
            <select
              value={p.jawaban}
              onChange={(e) => handleJawabanChange(idx, e.target.value)}
              className={`w-full p-2 border rounded dark:bg-gray-800 dark:text-white ${
                errors && errors[`jawaban_${idx}`] ? "border-red-500" : ""
              }`}
            >
              <option value="">-- Pilih -- </option>
              <option value="benar">Benar</option>
              <option value="salah">Salah</option>
            </select>
            {errors && errors[`jawaban_${idx}`] && (
              <p className="text-red-500 text-sm mt-1">
                {errors[`jawaban_${idx}`]}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={pernyataan.length <= 1}
            title={
              pernyataan.length <= 1
                ? "Minimal 1 pernyataan"
                : "Hapus pernyataan"
            }
          >
            ✕
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        + Tambah Pernyataan
      </button>
    </div>
  );
};

export default FormBenarSalah;
