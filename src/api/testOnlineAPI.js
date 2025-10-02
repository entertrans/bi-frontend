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

//pilih bank soal
// ambil soal dari bank soal berdasarkan kelas + mapel
export const fetchBankSoalByKelasMapel= async (kelasID, mapelID, testID) => {
  try {
    const res = await axios.get(`${BASE_URL}/guru/by-kelas-mapel`, {
      params: { 
        kelas_id: kelasID, 
        mapel_id: mapelID,
        test_id: testID
      },
    });
    return res.data;
  } catch (err) {
    console.error("Gagal ambil bank soal dengan selection:", err);
    throw err;
  }
};

export const removeSoalFromTest = async (testId, soalId) => {
  try {
    const res = await axios.delete(`${BASE_URL}/guru/${testId}/soal/${soalId}`);
    return res.data;
  } catch (err) {
    console.error("Gagal menghapus soal dari test:", err);
    throw err;
  }
};



// tambah soal ke test
export const addSoalToTest = async (testID, soalIDs) => {
  console.log(testID,soalIDs);
  
  try {
    const res = await axios.post(`${BASE_URL}/guru/tests/${testID}/add-soal`, {
      soal_ids: soalIDs,
    });
    return res.data;
  } catch (err) {
    console.error("Gagal tambah soal ke test:", err);
    throw err;
  }
};


// end of pilih


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
  const res = await axios.get(`${BASE_URL}/testreview/peserta/test/${testID}`);
  return res.data;
};

// tambah peserta
export const addPeserta = async (pesertaData) => {
  const res = await axios.post(`${BASE_URL}/testreview/peserta`, pesertaData);
  return res.data;
};

// update peserta
export const updatePeserta = async (pesertaID, data) => {
  const res = await axios.put(
    `${BASE_URL}/testreview/peserta/${pesertaID}`,
    data
  );
  return res.data;
};

// hapus peserta
export const deletePeserta = async (pesertaID) => {
  const res = await axios.delete(`${BASE_URL}/testreview/peserta/${pesertaID}`);
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

// api/testOnlineAPI.js
export const getActiveTestSession = async (testId, nis) => {
  try {
    const res = await axios.get(
      `${BASE_URL}/siswa/test/${testId}/active-session?nis=${nis}`
    );
    return res.data; // null jika tidak ada session
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

// Mulai session baru + ambil soal fix
export const startTest = async (testId, nis) => {
  const res = await axios.post(
    `${BASE_URL}/siswa/test/start/${testId}?nis=${nis}`
  );
  return res.data; // session + soal fix
};
// Load soal fix + jawaban lama berdasarkan session
export const continueTest = async (sessionId) => {
  const res = await axios.get(`${BASE_URL}/siswa/test/lanjut/${sessionId}`);
  return res.data; // { session, soal, jawaban }
};

// Submit test
export const submitTest = async (sessionId) => {
  const res = await axios.post(`${BASE_URL}/siswa/test/submit/${sessionId}`);
  return res.data;
};
export const submitTugas = async (sessionId) => {
  const res = await axios.post(`${BASE_URL}/siswa/tugas/submit/${sessionId}`);
  return res.data;
};

// Ambil semua test UB (Ujian Blok)
export const getAllUBTests = async () => {
  const res = await axios.get(`${BASE_URL}/siswa/tests/ub`);
  return res.data;
};

// Ambil soal berdasarkan test ID
export const getSoalByTestId = async (testId) => {
  try {
    const response = await axios.get(`/siswa/test/${testId}/soal`);
    return response.data; // Sekarang response adalah object, bukan array
  } catch (error) {
    throw error;
  }
};

// Simpan jawaban siswa
export const saveJawaban = async (jawabanData) => {
  const res = await axios.post(`${BASE_URL}/siswa/jawaban/save`, jawabanData);
  return res.data;
};

// testOnlineAPI.js
export const getTestSession = async (sessionId) => {
  const res = await axios.get(`${BASE_URL}/siswa/test/session/${sessionId}`);
  return res.data; // session lengkap + waktu sisa
};

export const gettestbykelas = async (type, kelasId) => {
  const res = await axios.get(
    `${BASE_URL}/siswa/tests/by-type/${type}/kelas/${kelasId}`
  );
  return res.data;
};

//jawaban siswa

// Get detail siswa
export const fetchSiswaDetail = async (siswaNis) => {
  try {
    const response = await axios.get(`${BASE_URL}/siswa/${siswaNis}`);
    return response.data.data; // { data: {...} }
  } catch (error) {
    console.error("Error fetching siswa detail:", error);
    throw error;
  }
};
export const fetchDetailJawabanBySession = async (sessionID,jenis) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/guru/session/${sessionID}/${jenis}/jawaban`
    );

    // Pastikan response structure sesuai
    // console.log("API Response:", response.data);

    // Cek jika response memiliki data
    if (response.data && response.data.data) {
      return response.data.data;
    } else if (response.data) {
      return response.data; // Jika data langsung di root
    } else {
      throw new Error("Data tidak ditemukan dalam response");
    }
  } catch (error) {
    console.error("Error fetching jawaban detail:", error);
    throw error;
  }
};

// src/api/testOnlineAPI.js
export const fetchJawabanSiswaDetail = async (siswaNis) => {
  try {
    const response = await axios.get(`${BASE_URL}/siswa/${siswaNis}`);
    // console.log("✅ Response siswa detail:", response.data);
    return response.data; // Langsung return response.data (object langsung)
  } catch (error) {
    // console.error('❌ Error fetching siswa detail:', error);
    throw error;
  }
};

export const fetchJawabanBySiswa = async (siswaNis) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/guru/jawaban/siswa/${siswaNis}`
    );
    // console.log("✅ Response jawaban:", response.data);
    return response.data; // {results: [], count: X, siswa_nis: "..."}
  } catch (error) {
    // console.error('❌ Error fetching jawaban:', error);
    throw error;
  }
};

export const updateTestAktif = async (testID, aktif) => {
  const res = await axios.put(`${BASE_URL}/guru/test/${testID}`, {
    aktif,
  });
  return res.data;
};
// api/testOnlineAPI.js
export const updateJawabanFinal = async (sessionID, scoreload) => {
  try {
    console.log("Sending update request:", { sessionID, scoreload });

    const response = await axios.put(
      `${BASE_URL}/guru/session/${sessionID}/jawaban`,
      scoreload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("Update response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating jawaban final:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);

      if (error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(`Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("Tidak ada respons dari server");
    } else {
      console.error("Error setting up request:", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

export const updateOverrideNilai = async (sessionID, scoreload) => {
  try {
    console.log("Sending override request:", { sessionID, scoreload });

    const response = await axios.put(
      `${BASE_URL}/guru/session/${sessionID}/nilai-akhir`,
      scoreload,
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    console.log("Override response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating override nilai:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);

      if (error.response.data && error.response.data.error) {
        throw new Error(error.response.data.error);
      } else {
        throw new Error(`Server error: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      throw new Error("Tidak ada respons dari server");
    } else {
      console.error("Error setting up request:", error.message);
      throw new Error(`Error: ${error.message}`);
    }
  }
};

// api/testOnlineAPI.js
export const resetTestSession = async (sessionId, additionalData = {}) => {
  // console.log("Data reset:", { sessionId, ...additionalData });
  
  const res = await axios.delete(`${BASE_URL}/guru/test/reset/${sessionId}`, {
    data: additionalData // Kirim data tambahan di body
  });
  return res.data;
};

export const fetchNilaiBySession = async (sessionID) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/siswa/test/session/${sessionID}/nilai`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching nilai:", error);
    throw error;
  }
};



