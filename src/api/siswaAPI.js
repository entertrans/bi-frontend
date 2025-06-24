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
