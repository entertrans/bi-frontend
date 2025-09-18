import axios from "./axios";

// Ambil semua kisi-kisi (tanpa filter)
export const getAllKisiKisiGuru = async () => {
  try {
    // console.log("Fetching kisi-kisi data...");
    const res = await axios.get("/siswa/kisikisi/");
    // console.log("Kisi-kisi response:", res);
    
    // Kembalikan res.data.data (array kisi-kisi) bukan res.data
    return res.data.data || [];
  } catch (err) {
    console.error("Error fetch all kisi-kisi guru:", err);
    // if (err.response) {
    //   console.error("Response status:", err.response.status);
    //   console.error("Response data:", err.response.data);
    // }
    return [];
  }
};

// Tambah kisi-kisi baru
export const createKisiKisi = async (data) => {
  try {
    console.log("Sending data:", data); // Debug
    const res = await axios.post("http://localhost:8080/siswa/kisikisi", data, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    return res.data;
  } catch (err) {
    console.error("Error create kisi-kisi:", err);
    if (err.response) {
      console.error("Response status:", err.response.status);
      console.error("Response data:", err.response.data);
    }
    throw err;
  }
};

// Hapus kisi-kisi
export const deleteKisiKisi = async (id) => {
  try {
    await axios.delete(`/siswa/kisikisi/${id}`);
    return true;
  } catch (err) {
    console.error("Error delete kisi-kisi:", err);
    throw err;
  }
};

export const getAllRekapNilai = async () => {
  try {
    const res = await axios.get("/guru/nilai/rekap");
    return res.data;
  } catch (err) {
    console.error("Error fetch rekap nilai:", err);
    return [];
  }
};

export const getDetailTest = async (type, kelas_id, mapel_id) => {
  try {
    const res = await axios.get(`/guru/nilai/${type}/${kelas_id}/${mapel_id}`);
    return res.data.data || [];
  } catch (err) {
    console.error(`Error fetch detail ${type}:`, err);
    return [];
  }
};

export const getDetailPesertaTest = async (type, test_id, kelas_id) => {
  try {
    const res = await axios.get(`/guru/nilai/${type}/peserta/${test_id}/${kelas_id}`);
    return res.data.data || [];
  } catch (err) {
    console.error(`Error fetch detail peserta ${type}:`, err);
    return [];
  }
};