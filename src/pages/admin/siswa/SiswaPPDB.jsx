import React, { useEffect, useState } from "react";
import { fetchAllPPDB } from "../../../api/siswaAPI";
import { useNavigate, Link } from "react-router-dom";

const SiswaPPDB = () => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // <-- dipindah ke sini
  const siswaPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    async function getData() {
      try {
        const siswa = await fetchAllPPDB();
        setDataSiswa(siswa);
      } catch (err) {
        console.error("Gagal mengambil data PPDB:", err);
      }
    }
    getData();
  }, []);

  const handleLanjutkan = (nis) => {
    navigate(`/admin/siswa/lanjutkan-ppdb/${nis}`);
  };

  const handleBatalkan = (nis) => {
    const konfirmasi = window.confirm(
      "Apakah kamu yakin ingin membatalkan siswa ini?"
    );
    if (konfirmasi) {
      console.log("Siswa dengan NIS", nis, "dibatalkan.");
      // Tambahkan logika update status/hapus di sini
    }
  };

  const filteredData = dataSiswa.filter(
    (siswa) =>
      siswa.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.siswa_nis.includes(searchTerm)
  );

  const totalPages = Math.ceil(filteredData.length / siswaPerPage); // <-- dipindah ke sini

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * siswaPerPage,
    currentPage * siswaPerPage
  );

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2 mb-4">
        <input
          type="text"
          placeholder="Cari nama atau NIS..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
        />
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
              paginatedData.map((siswa) => (
                <tr key={siswa.siswa_nis}>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={
                          siswa.siswa_photo
                            ? `https://placehold.co/40x40?text=AA&font=roboto`
                            : `https://placehold.co/40x40?text=AA&font=roboto`
                        }
                        alt={siswa.siswa_nama}
                        className="w-10 h-10 rounded-full border object-cover"
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
                      {siswa.Satelit.satelit_nama}
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
      <div className="flex justify-center mt-4 gap-2 flex-wrap text-sm">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => paginate(pageNum)}
            className={`px-3 py-1 rounded ${
              pageNum === currentPage
                ? "bg-blue-600 text-white"
                : "bg-gray-200 dark:bg-gray-600 dark:text-white"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SiswaPPDB;
