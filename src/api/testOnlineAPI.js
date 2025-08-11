import axios from "./axios"; // ini mengarah ke file konfigurasi di atas
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
  const res = await axios.get(`http://localhost:8080/guru/banksoal`);
  return res.data;
};
