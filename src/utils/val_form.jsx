import React from "react";

const NumberInput = ({ name, value, onChange, placeholder = "", className = "" }) => {
  const handleChange = (e) => {
    // Hanya angka & menghindari karakter lain
    const val = e.target.value.replace(/[^0-9]/g, "");
    onChange({ target: { name, value: val } });
  };

  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      className={`p-2 border rounded w-full md:w-32 dark:bg-gray-700 dark:text-white ${className}`}
      inputMode="numeric"
    />
  );
};

export default NumberInput;