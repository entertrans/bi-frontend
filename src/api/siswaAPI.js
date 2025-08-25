import axios from "./axios"; // ini mengarah ke file konfigurasi di atas

// kwitansi
export const getAllKwitansi = async () => {
  const res = await fetch("http://localhost:8080/kwitansi");
  const data = await res.json();
  return data;
};

export const fetchPembayaran = async (idPenerima) => {
  const res = await fetch(`http://localhost:8080/pembayaran/${idPenerima}`);
  if (!res.ok) throw new Error("Gagal ambil data pembayaran");
  return await res.json();
};

export const getPembayaranByNis = async (nis) => {
  const response = await fetch(
    `http://localhost:8080/pembayaran/by-nis?nis=${encodeURIComponent(nis)}`
  );
  const data = await response.json();
  return data;
};

export const tambahPembayaran = async (payload) => {
  try {
    const { data } = await axios.post(
      "http://localhost:8080/pembayaran",
      payload
    );
    return data;
  } catch (error) {
    throw new Error("Gagal menambah pembayaran");
  }
};

export const hapusPembayaranById = async (id) => {
  try {
    const { data } = await axios.delete(
      `http://localhost:8080/pembayaran/${id}`
    );
    return data;
  } catch (error) {
    throw new Error("Gagal menghapus pembayaran");
  }
};

//petycash

// GET semua data periode petty cash
export const getPettyCashPeriode = async () => {
  const res = await axios.get(`http://localhost:8080/petty-cash`);
  return res.data;
};

// GET petty cash berdasarkan ID
export const getPettyCashPeriodeByID = async (id) => {
  const res = await axios.get(`http://localhost:8080/petty-cash/${id}`);
  return res.data;
};

// GET petty cash berdasarkan lokasi (hati-hati ini tabrakan sama getByID)
export const getPettyCashByLokasi = async (lokasi) => {
  const res = await axios.get(
    `http://localhost:8080/petty-cash/by-lokasi/${lokasi}`
  );
  return res.data;
};

// POST tambah periode petty cash
export const createPettyCashPeriode = async (data) => {
  const res = await axios.post(`http://localhost:8080/petty-cash`, data);
  return res.data;
};

// PUT update periode petty cash
export const updatePettyCashPeriode = async (data) => {
  const res = await axios.put(`http://localhost:8080/petty-cash`, data);
  return res.data;
};

// DELETE petty cash berdasarkan ID
export const deletePettyCashPeriode = async (id) => {
  const res = await axios.delete(`http://localhost:8080/petty-cash/${id}`);
  return res.data;
};

export const getTransaksiByPeriode = async (periodeId) => {
  const res = await axios.get(`http://localhost:8080/transaksi/${periodeId}`);
  return res.data; // expect { periode, transaksis, saldo }
};

export const addTransaksi = async (data) => {
  const res = await axios.post("http://localhost:8080/transaksi", data);
  return res.data;
};
export const deleteTransaksi = async (id) => {
  const res = await axios.delete(`http://localhost:8080/transaksi/${id}`);
  return res.data;
};

//petcashend

//penerima invoice
export const searchSiswa = async (q) => {
  const response = await fetch(`http://localhost:8080/siswa/search?q=${q}`);
  if (!response.ok) throw new Error("Gagal mencari siswa");
  return await response.json();
};
export const tambahPenerimaInvoice = async (id_invoice, siswaList) => {
  const res = await axios.post(
    `http://localhost:8080/invoice/penerima/id?id=${encodeURIComponent(
      id_invoice
    )}`,
    {
      penerima: siswaList,
    }
  );
  return res.data;
};
export const updatePotonganPenerima = async (id_penerima, potongan) => {
  const res = await axios.put(
    `http://localhost:8080/invoice/penerima/potongan`,
    {
      id_penerima,
      potongan,
    }
  );
  return res.data;
};
export const hapusPenerimaInvoice = async (idPenerima) => {
  const res = await axios.delete(
    `http://localhost:8080/invoice/penerima/${idPenerima}`
  );
  return res.data;
};
export const updateTagihanTambahanPenerima = (payload) =>
  axios.put(`http://localhost:8080/invoice/penerima/tambahan`, payload);

export const fetchInvoicePenerima = async (nis) => {
  const res = await fetch(`http://localhost:8080/invoice/penerima/${nis}`);
  if (!res.ok) throw new Error("Gagal mengambil data invoice");
  return await res.json();
};
export const fetchHistoryInvoice = async (nis) => {
  const res = await fetch(`http://localhost:8080/invoice/history/${nis}`);
  if (!res.ok) throw new Error("Gagal mengambil data invoice");
  return await res.json();
};

export async function updateTambahanTagihan(penerimaId, tambahanTagihan) {
  const res = await fetch(
    `http://localhost:8080/invoice/penerima/${penerimaId}/tambahan`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tambahan_tagihan: tambahanTagihan }),
    }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Gagal menyimpan tagihan tambahan");
  }

  return await res.json();
}

// invoice
export const getInvoiceById = async (id_invoice) => {
  const response = await fetch(
    `http://localhost:8080/invoice/by-id?id=${encodeURIComponent(id_invoice)}`
  );
  const data = await response.json();
  return data;
};

export const getPenerimaInvoice = async (id_invoice) => {
  const response = await fetch(
    `http://localhost:8080/invoice/penerima?id=${encodeURIComponent(
      id_invoice
    )}`
  );
  const data = await response.json();
  return data;
};

export const getKwitansiDetail = async (id_invoice) => {
  const response = await fetch(
    `http://localhost:8080/kwitansi/detail?id=${encodeURIComponent(id_invoice)}`
  );
  const data = await response.json();
  return data;
};

//check invoice
export const cekInvoiceID = async (id_invoice) => {
  const res = await fetch(`http://localhost:8080/invoice/cek?id=${id_invoice}`);
  if (!res.ok) throw new Error("Gagal cek ID Invoice");
  return await res.json(); // { exists: true/false }
};

// Ambil semua invoice
export const getAllInvoice = async () => {
  const response = await axios.get(`http://localhost:8080/invoice`);
  return response.data;
};

// Tambah invoice baru
export const createInvoice = async (data) => {
  const res = await axios.post("http://localhost:8080/invoice", data);
  return res.data;
};

//siswa
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

export const keluarkanSiswa = async (nis, tanggalKeluar) => {
  const res = await axios.patch(
    `http://localhost:8080/siswa/${nis}/keluarkan`,
    {
      tgl_keluar: tanggalKeluar, // << ganti key-nya
    }
  );
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

export const fetchAllSiswaByKelas = async (kelasID) => {
  const res = await axios.get(`http://localhost:8080/lookup/kelas/${kelasID}`);
  return res.data;
};

// Dalam file api/siswaAPI.js
export const fetchAllMapelByKelas = async (id) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/lookup/mapel-by-kelas/${id}`
    );

    // Transform data dari response API
    const transformedData = res.data.map((item) => ({
      kd_mapel: item.Mapel.kd_mapel,
      nm_mapel: item.Mapel.nm_mapel,
    }));

    return transformedData;
  } catch (error) {
    console.error("Error fetching mapel by kelas:", error);
    throw error;
  }
};

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

export const fetchAllMapel = async () => {
  const res = await axios.get(`http://localhost:8080/lookup/mapel`);
  return res.data;
};
export const fetchDetailKelasMapel = async (kelasId, mapelId) => {
  const res = await axios.get(
    `http://localhost:8080/lookup/detail/${kelasId}/${mapelId}`
  );
  return res.data;
};

export async function fetchAllPPDB() {
  const response = await fetch("http://localhost:8080/siswappdb");
  if (!response.ok) {
    throw new Error("Gagal mengambil data PPDB dari server");
  }
  return await response.json();
}
//end of siswa

//tagihan
export const fetchAllTagihan = async () => {
  const res = await axios.get("http://localhost:8080/tagihan");
  return res.data;
};

export const tambahTagihan = async ({ jns_tagihan, nom_tagihan }) => {
  const res = await fetch("http://localhost:8080/tagihan/tambah", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      jns_tagihan,
      nom_tagihan,
    }),
  });

  if (!res.ok) {
    throw new Error("Gagal menambah tagihan.");
  }

  return await res.json();
};

export const editTagihan = async (id, data) => {
  const res = await fetch(`http://localhost:8080/tagihan/${id}/edit`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Gagal update tagihan.");
  return await res.json();
};

export const deleteTagihan = async (id) => {
  const res = await fetch(`http://localhost:8080/tagihan/${id}/delete`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Gagal hapus tagihan.");
  return await res.json();
};

// invoice
