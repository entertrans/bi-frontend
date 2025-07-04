import { useState } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { FaSave } from "react-icons/fa";

const DokumenUploadField = ({ id, label, previewUrl, onChange, onSave, saved }) => {
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange(id, selectedFile);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap border-b pb-4">
      {/* Input */}
      <div className="flex-1 min-w-[100px]">
        <label
          htmlFor={id}
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          {label}
        </label>
        <input
          id={id}
          type="file"
          onChange={handleChange}
          className="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        />
      </div>

      {/* Preview */}
      <div className="min-w-[60px] text-end">
        <PhotoProvider>
          <PhotoView src={previewUrl}>
            <img
              src={previewUrl?.replace("/800/600", "/120/80") || ""}
              alt={`Preview ${label}`}
              className="w-full max-w-[60px] border rounded shadow cursor-pointer hover:opacity-90 transition"
            />
          </PhotoView>
        </PhotoProvider>
      </div>

      {/* Save Button */}
      <div>
        <button
          onClick={() => onSave(id)}
          title="Simpan"
          className={`p-2 text-white rounded ${
            saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          <FaSave />
        </button>
      </div>
    </div>
  );
};

export default DokumenUploadField;
