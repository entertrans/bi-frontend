export async function fetchAllSiswa() {
  const response = await fetch("http://localhost:8080/siswaaktif");
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