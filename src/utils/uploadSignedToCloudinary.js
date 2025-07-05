/**
 * Upload signed file ke Cloudinary
 * @param {File} file - File yang akan diupload
 * @param {string} publicId - ID unik untuk Cloudinary (misalnya: "profil-2025001")
 * @param {string} folder - Nama folder di Cloudinary (misal: "lampiran/2025001")
 * @returns {Promise<string>} URL gambar Cloudinary
 */
const uploadSignedToCloudinary = async (file, publicId, folder) => {
  const queryParams = new URLSearchParams({
    public_id: publicId,
    folder: folder,
  });

  // Minta signature dari backend
  const sigRes = await fetch(
    `http://localhost:8080/api/cloudinary-signature?${queryParams}`
  );

  const sigData = await sigRes.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sigData.api_key);
  formData.append("timestamp", sigData.timestamp);
  formData.append("signature", sigData.signature);
  formData.append("public_id", publicId);
  formData.append("folder", folder);
  formData.append("overwrite", "true");
  formData.append("invalidate", "true");

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${sigData.cloud_name}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || "Upload ke Cloudinary gagal");
  }

  const data = await res.json();
  return {
    url: data.secure_url,
    public_id: data.public_id,
    version: data.version,
  };
};

export default uploadSignedToCloudinary;
