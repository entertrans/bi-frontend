import React, { useState } from "react";
import { FaEdit, FaCheck, FaTimes } from "react-icons/fa";


const EditableField = ({ label, value, rawValue, options, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [tempValue, setTempValue] = useState(rawValue || value);
  

  const handleSave = () => {
    onSave(tempValue);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempValue(rawValue || value);
    setEditing(false);
  };

  return (
    <div className="relative group">
      <div className="text-gray-500 dark:text-gray-400">{label}:</div>
      {!editing ? (
        <div className="flex justify-between items-center text-gray-800 dark:text-white">
          <span className="whitespace-pre-line break-words max-w-[85%]">
            {value || "-"}
          </span>
          <button
            onClick={() => setEditing(true)}
            className="ml-2 text-blue-500 opacity-0 group-hover:opacity-100 transition"
          >
            <FaEdit />
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 mt-1">
          {options ? (
            <select
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 p-1 border rounded text-sm dark:bg-gray-800 dark:text-white"
            >
              <option value="">Pilih {label}</option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              type="text"
              value={tempValue}
              onChange={(e) => setTempValue(e.target.value)}
              className="flex-1 p-1 border rounded text-sm dark:bg-gray-800 dark:text-white"
            />
          )}
          <button
            onClick={handleSave}
            className="text-green-600 hover:text-green-800"
            title="Simpan"
          >
            <FaCheck />
          </button>
          <button
            onClick={handleCancel}
            className="text-red-600 hover:text-red-800"
            title="Batal"
          >
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableField;
