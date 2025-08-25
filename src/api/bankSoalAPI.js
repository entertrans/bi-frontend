import axios from "./axios"; // ini mengarah ke file konfigurasi di atas
const BASE_URL = "http://localhost:8080";

export const getAllBankSoal = async (kelasId, mapelId) => {
  const res = await axios.get(
    `${BASE_URL}/guru/banksoal/${kelasId}/${mapelId}`
  );
  return res.data;
};

export const getAllRekapBankSoal = async () => {
  const res = await axios.get(`${BASE_URL}/guru/banksoal/rekap`);
  return res.data;
};

// ==============================
// Get inactive soal
// ==============================
export const getInActiveBankSoal = async () => {
  const res = await axios.get(`${BASE_URL}/guru/banksoal/inactive`);
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
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: onProgress
        ? (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(percentCompleted);
          }
        : undefined,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// ==============================
// Soft delete lampiran
// ==============================
export const deleteSoal = async (SoalId) => {
  const res = await axios.delete(`${BASE_URL}/guru/banksoal/${SoalId}`);
  return res.data;
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
// Restore Soal
// ==============================
export const restoreSoal = async (SoalId) => {
  // console.log(SoalId);
  const res = await axios.put(`${BASE_URL}/guru/banksoal/${SoalId}/restore`);
  return res.data;
};

// ==============================
// Hard delete lampiran
// ==============================
export const hardDeleteLampiran = async (lampiranId) => {
  const res = await axios.delete(`${BASE_URL}/lampiran/hard/${lampiranId}`);
  return res.data;
};

// ==============================
// create soal
// ==============================
export const createSoal = async (payload) => {
  // console.log(payload);
  try {
    const res = await axios.post(
      `http://localhost:8080/guru/banksoal/create`,
      payload
    );
    return res.data;
  } catch (error) {
    console.error(
      "Error creating soal:",
      error.response?.data || error.message
    );
    throw error;
  }
};
