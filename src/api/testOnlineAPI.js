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

export const getTestsByType = async (type) => {
  const res = await axios.get(`${BASE_URL}/guru/test/type/${type}`);
  return res.data;
};

export const getTestsByGuru = async (guruID) => {
  const res = await axios.get(`${BASE_URL}/guru/${guruID}`);
  return res.data;
};

export const createTest = async (testData) => {
  const res = await axios.post(`${BASE_URL}/guru/test`, testData);
  return res.data;
};

export const updateTest = async (id, data) => {
  const res = await axios.put(`${BASE_URL}/${id}`, data);
  return res.data;
};

export const deleteTest = async (id) => {
  const res = await axios.delete(`${BASE_URL}/guru/test/${id}`);
  return res.data;
};

// ambil semua peserta by test
export const getPesertaByTest = async (testID) => {
  const res = await axios.get(`${BASE_URL}/testquis/peserta/test/${testID}`);
  return res.data;
};

// tambah peserta
export const addPeserta = async (pesertaData) => {
  const res = await axios.post(`${BASE_URL}/testquis/peserta`, pesertaData);
  return res.data;
};

// update peserta
export const updatePeserta = async (pesertaID, data) => {
  const res = await axios.put(
    `${BASE_URL}/testquis/peserta/${pesertaID}`,
    data
  );
  return res.data;
};

// hapus peserta
export const deletePeserta = async (pesertaID) => {
  const res = await axios.delete(`${BASE_URL}/testquis/peserta/${pesertaID}`);
  return res.data;
};

// ambil semua soal by test
export const getTestSoalByTestId = async (testId) => {
  try {
    const res = await axios.get(`${BASE_URL}/test-soal/by-test/${testId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching test soal:", error);
    throw error;
  }
};

// ambil detail soal by id
export const getDetailTestSoal = async (soalId) => {
  try {
    const res = await axios.get(`${BASE_URL}/test-soal/detail/${soalId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching detail test soal:", error);
    throw error;
  }
};

// buat soal baru
export const createTestSoal = async (soalData) => {
  try {
    const res = await axios.post(`${BASE_URL}/test-soal/create`, soalData);
    return res.data;
  } catch (error) {
    console.error("Error creating test soal:", error);
    throw error;
  }
};

// hapus soal
export const deleteTestSoal = async (soalId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/test-soal/delete/${soalId}`);
    return res.data;
  } catch (error) {
    console.error("Error deleting test soal:", error);
    throw error;
  }
};

// update soal
export const updateTestSoal = async (soalId, data) => {
  try {
    const res = await axios.put(`${BASE_URL}/test-soal/update/${soalId}`, data);
    return res.data;
  } catch (error) {
    console.error("Error updating test soal:", error);
    throw error;
  }
};
