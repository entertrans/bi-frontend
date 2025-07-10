import { useState, useEffect } from "react";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { FaSave, FaSpinner } from "react-icons/fa";

const DEFAULT_IMAGE =
  "https://res.cloudinary.com/dalcsrtd9/image/upload/v1751646282/404_f4obmp.jpg";

const DokumenUploadField = ({
  id,
  label,
  previewUrl,
  onChange,
  onSave,
  saved,
}) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(DEFAULT_IMAGE);
  const [imageError, setImageError] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // NEW

  // Fallback preview dari props
  useEffect(() => {
    if (previewUrl) {
      setPreview(previewUrl);
    }
  }, [previewUrl]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImageError(false);
    img.onerror = () => setImageError(true);
    img.src = previewUrl;
  }, [previewUrl]);

  const handleChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      onChange(id, selectedFile);
    }
  };

  const handleSave = async () => {
    setIsUploading(true); // MULAI LOADING
    try {
      await onSave(id); // CALL props onSave async
    } finally {
      setIsUploading(false); // SELESAI LOADING
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap border-b pb-4">
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

      <div className="min-w-[60px] text-end">
        <PhotoProvider>
          <PhotoView src={preview}>
            <img
              src={imageError ? DEFAULT_IMAGE : previewUrl}
              alt="Preview"
              className="w-full max-w-[60px] border rounded shadow cursor-pointer hover:opacity-90 transition"
            />
          </PhotoView>
        </PhotoProvider>
      </div>

      <div>
        <button
          onClick={handleSave}
          title="Simpan"
          disabled={isUploading}
          className={`p-2 text-white rounded transition flex items-center justify-center ${
            saved ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
          } ${isUploading && "opacity-70 cursor-not-allowed"}`}
        >
          {isUploading ? <FaSpinner className="animate-spin" /> : <FaSave />}
        </button>
      </div>
    </div>
  );
};

export default DokumenUploadField;
