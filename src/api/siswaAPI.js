export async function fetchAllSiswa() {
  const response = await fetch("http://localhost:8080/siswaaktif");
  if (!response.ok) {
    throw new Error("Gagal mengambil data siswa dari server");
  }
  return await response.json();
}
