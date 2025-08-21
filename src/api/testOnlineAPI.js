import axios from "./axios"; // ini mengarah ke file konfigurasi di atas
const BASE_URL = "http://localhost:8080";
// contoh
// export const getPettyCashByLokasi = async (lokasi) => {
//   const res = await axios.get(
//     `http://localhost:8080/petty-cash/by-lokasi/${lokasi}`
//   );
//   return res.data;
// };
// POST tambah periode petty cash
// export const createPettyCashPeriode = async (data) => {
//   const res = await axios.post(`http://localhost:8080/petty-cash`, data);
//   return res.data;
// };

// // PUT update periode petty cash
// export const updatePettyCashPeriode = async (data) => {
//   const res = await axios.put(`http://localhost:8080/petty-cash`, data);
//   return res.data;
// };

// // DELETE petty cash berdasarkan ID
// export const deletePettyCashPeriode = async (id) => {
//   const res = await axios.delete(`http://localhost:8080/petty-cash/${id}`);
//   return res.data;
// };
// end

// export const getAllBankSoalTO = async () => {
//   const res = await fetch("http://localhost:8080/guru/banksoal");
//   if (!res.ok) throw new Error("Gagal ambil data");
//   return await res.json();
// };

export const getAllBankSoalTO = async () => {
  const res = await axios.get(`${BASE_URL}/guru/banksoal`);
  return res.data;
};

// ==============================
// Get all active lampiran
// ==============================
export const getActiveLampiran = async () => {
  const res = await axios.get(`${BASE_URL}/lampiran/active`);
  return res.data;
};

// ==============================
// Get lampiran trash
// ==============================
export const getTrashLampiran = async () => {
  const res = await axios.get(`${BASE_URL}/trash`);
  return res.data;
};

// ==============================
// Upload lampiran
// (pakai multipart/form-data)
// ==============================
// Dalam file testOnlineAPI.js
export const uploadLampiran = async (formData, onProgress = null) => {
  try {
    const response = await axios.post(`${BASE_URL}/lampiran/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: onProgress ? (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onProgress(percentCompleted);
      } : undefined,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==============================
// Soft delete lampiran
// ==============================
export const deleteLampiran = async (lampiranId) => {
  const res = await axios.delete(`${BASE_URL}/lampiran/${lampiranId}`);
  return res.data;
};

// ==============================
// Restore lampiran
// ==============================
export const restoreLampiran = async (lampiranId) => {
  const res = await axios.put(`${BASE_URL}/lampiran/restore/${lampiranId}`);
  return res.data;
};

// ==============================
// Hard delete lampiran
// ==============================
export const hardDeleteLampiran = async (lampiranId) => {
  const res = await axios.delete(`${BASE_URL}/lampiran/hard/${lampiranId}`);
  return res.data;
};
