import axios from "./axios"; // ini mengarah ke file konfigurasi di atas

export const updateSiswaField = async (nis, field, value) => {
  const response = await axios.put(`http://localhost:8080/updatesiswa/${nis}`, {
    field,
    value,
  });
  return response.data;
};

export const batalkanSiswa = async (nis) => {
  return await axios.delete(`http://localhost:8080/batalkan-siswa/${nis}`);
};

export const keluarkanSiswa = async (nis) => {
  const res = await axios.patch(`http://localhost:8080/siswa/${nis}/keluarkan`);
  return res.data;
};
export const toggleKelasOnline = async (nis) => {
  const res = await axios.patch(`http://localhost:8080/siswa/${nis}/online`);
  return res.data;
};
export const toggleKelasOffline = async (nis) => {
  const res = await axios.patch(`http://localhost:8080/siswa/${nis}/offline`);
  return res.data;
};

export const terimaSiswa = async (nis) => {
  const res = await fetch(`http://localhost:8080/siswa/${nis}/terima`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      soft_deleted: 0,
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal menerima siswa.");
  }

  return await res.json();
};

export const uploadDokumen = async (nis, id, file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("nis", nis);
  formData.append("dokumen_jenis", id);

  const res = await fetch("http://localhost:8080/api/upload-dokumen", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Gagal upload");
  return res.json(); // { url }
};

export async function fetchAllSiswa() {
  const response = await fetch("http://localhost:8080/siswaaktif");
  if (!response.ok) {
    throw new Error("Gagal mengambil data siswa dari server");
  }
  return await response.json();
}
export async function fetchAllSiswaAlumni() {
  const response = await fetch("http://localhost:8080/siswaalumni");
  if (!response.ok) {
    throw new Error("Gagal mengambil data siswa dari server");
  }
  return await response.json();
}

export async function fetchAllSiswaKeluar() {
  const response = await fetch("http://localhost:8080/siswakeluar");
  if (!response.ok) {
    throw new Error("Gagal mengambil data siswa dari server");
  }
  return await response.json();
}

export async function fetchAllkelas() {
  const response = await fetch("http://localhost:8080/lookup/kelas");
  if (!response.ok) {
    throw new Error("Gagal mengambil data kelas dari server");
  }
  return await response.json();
}
export async function fetchAllSatelit() {
  const response = await fetch("http://localhost:8080/lookup/satelit");
  if (!response.ok) {
    throw new Error("Gagal mengambil data satelit dari server");
  }
  return await response.json();
}
export async function fetchAllagama() {
  const response = await fetch("http://localhost:8080/lookup/agama");
  if (!response.ok) {
    throw new Error("Gagal mengambil data agama dari server");
  }
  return await response.json();
}

export async function fetchAllTa() {
  const response = await fetch("http://localhost:8080/lookup/tahun_ajaran");
  if (!response.ok) {
    throw new Error("Gagal mengambil data Ta dari server");
  }
  return await response.json();
}

export async function fetchAllPPDB() {
  const response = await fetch("http://localhost:8080/siswappdb");
  if (!response.ok) {
    throw new Error("Gagal mengambil data PPDB dari server");
  }
  return await response.json();
}
