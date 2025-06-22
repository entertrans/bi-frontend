import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// const filteredData = []; // <-- Kosongin array-nya
const filteredData = [
  {
    siswa_id: 1,
    siswa_nama: "Aditya Narayan",
    siswa_nis: "2017151",
    siswa_nisn: "9988776655",
    siswa_jenkel: "L",
    siswa_photo: "https://i.pravatar.cc/100?u=siswa1",
    siswa_kelas_id: "10-IPA",
    siswa_no_telp: "08123456789",
    satelit: "BSD",
  },
  {
    siswa_id: 2,
    siswa_nama: "Siti Rahma",
    siswa_nis: "2017152",
    siswa_nisn: "9988776656",
    siswa_jenkel: "P",
    siswa_photo: "https://i.pravatar.cc/100?u=siswa2",
    siswa_kelas_id: "10-IPS",
    siswa_no_telp: "08123451234",
    satelit: "Serpong",
  },
];

const SiswaPPDB = () => {
  const navigate = useNavigate();

  const handleLanjutkan = (nis) => {
    navigate(`/admin/siswa/lanjutkan-ppdb/${nis}`);
  };

  const handleBatalkan = (nis) => {
    const konfirmasi = window.confirm(
      "Apakah kamu yakin ingin membatalkan siswa ini?"
    );
    if (konfirmasi) {
      console.log("Siswa dengan NIS", nis, "dibatalkan.");
      // Tambahkan logika API delete atau update status
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex justify-end mb-4 gap-2">
        <Link
          to="/admin/siswa/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded shadow"
        >
          Tambah Siswa
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left">Siswa</th>
              <th className="px-6 py-3 text-left">NISN</th>
              <th className="px-6 py-3 text-left">Jenis Kelamin</th>
              <th className="px-6 py-3 text-left">Cabang</th>
              <th className="px-6 py-3 text-left">Status</th>
              <th className="px-6 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredData.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-8 text-gray-500 dark:text-gray-300"
                >
                  Belum ada siswa yang terdaftar di tahap PPDB.
                </td>
              </tr>
            ) : (
              filteredData.map((siswa) => (
                <tr key={siswa.siswa_nis}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={siswa.siswa_photo}
                        alt={siswa.siswa_nama}
                        className="w-10 h-10 rounded-full border"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {siswa.siswa_nama}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {siswa.siswa_nis}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{siswa.siswa_nisn}</td>
                  <td className="px-6 py-4">
                    {siswa.siswa_jenkel === "L" ? "Laki-laki" : "Perempuan"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400 mr-2"></div>
                      {siswa.satelit}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-yellow-600 font-medium">
                    Pending
                  </td>
                  <td className="px-6 py-4 text-center space-x-2">
                    <button
                      onClick={() => handleLanjutkan(siswa.siswa_nis)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 text-xs rounded shadow"
                    >
                      Lanjutkan
                    </button>
                    <button
                      onClick={() => handleBatalkan(siswa.siswa_nis)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded shadow"
                    >
                      Batalkan
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SiswaPPDB;
