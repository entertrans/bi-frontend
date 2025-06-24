import React, { useEffect, useState } from "react";
import { fetchAllSiswaKeluar, fetchAllkelas } from "../../api/siswaAPI";
import { FaTrash, FaUndo } from "react-icons/fa";

const SiswaKeluarTable = () => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [kelasOptions, setKelasOptions] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const siswaPerPage = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const [siswaData, kelasData] = await Promise.all([
          fetchAllSiswaKeluar(),
          fetchAllkelas(),
        ]);

        setDataSiswa(siswaData);

        const options = [
          { id: "", label: "Semua Kelas" },
          ...kelasData.aktif.map((kelas) => ({
            id: kelas.kelas_id.toString(),
            label: kelas.kelas_nama,
          })),
        ];
        setKelasOptions(options);
      } catch (err) {
        console.error("Gagal ambil data:", err);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedKelas, selectedProgram, searchTerm]);

  const handleHapusPermanen = (nis) => {
    if (window.confirm("Yakin ingin menghapus data ini secara permanen?")) {
      console.log("Hapus permanen siswa NIS:", nis);
    }
  };

  const handleAktifkanKembali = (nis) => {
    if (window.confirm("Aktifkan kembali siswa ini?")) {
      console.log("Aktifkan kembali siswa NIS:", nis);
    }
  };

  const filteredData = dataSiswa
    .filter((siswa) => {
      const kelasMatch = selectedKelas
        ? siswa.siswa_kelas_id?.toString() === selectedKelas
        : true;
      const programMatch =
        selectedProgram === "online"
          ? siswa.oc === 1
          : selectedProgram === "offline"
          ? siswa.kc === 1
          : true;
      const searchMatch =
        siswa.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        siswa.siswa_nis.includes(searchTerm);
      return kelasMatch && searchMatch && programMatch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField] || "";
      const bValue = b[sortField] || "";
      return sortOrder === "asc"
        ? aValue.toString().localeCompare(bValue.toString())
        : bValue.toString().localeCompare(aValue.toString());
    });

  const totalPages = Math.ceil(filteredData.length / siswaPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * siswaPerPage,
    currentPage * siswaPerPage
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getPaginationButtons = () => {
    const range = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
    } else {
      if (currentPage <= 4) {
        range.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        range.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        range.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
    return range;
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 shadow rounded-lg">
      {/* Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
        <select
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          {kelasOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari siswa..."
          className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left w-40 whitespace-normal break-words">
                Nama
              </th>

              <th className="px-6 w-20  py-3 text-left">NISN</th>
              <th className="px-6 w-20 py-3 text-left">Kelas</th>
              <th className="px-6 w-32 py-3 text-left">Telp</th>
              <th className="px-6 w-32 py-3 text-left">Cabang</th>
              <th className="px-6 w-32 py-3 text-left">Tgl Keluar</th>
              <th className="w-10 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((siswa) => (
              <tr key={siswa.siswa_id}>
                <td className="px-6 py-4 w-32 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    <img
                      src={
                        siswa.siswa_photo
                          ? `https://placehold.co/40x40?text=AA&font=roboto`
                          : `https://placehold.co/40x40?text=AA&font=roboto`
                      }
                      alt={siswa.siswa_nama}
                      className=" h-10 rounded-full border object-cover"
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
                  {siswa.kelas?.kelas_nama?.replace(/^Kelas\s*/i, "") || "-"}
                </td>
                <td className="px-6 py-4">{siswa.siswa_no_telp}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                    {siswa.Satelit?.satelit_nama || "-"}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {siswa.tgl_keluar &&
                    new Date(siswa.tgl_keluar).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                </td>
                <td className="text-center space-x-2 text-gray-500 dark:text-gray-300">
                  <FaTrash
                    title="Hapus Permanen"
                    className="inline-block cursor-pointer hover:text-red-600"
                    onClick={() => handleHapusPermanen(siswa.siswa_nis)}
                  />
                  <FaUndo
                    title="Aktifkan Kembali"
                    className="inline-block cursor-pointer hover:text-green-600"
                    onClick={() => handleAktifkanKembali(siswa.siswa_nis)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 gap-2 flex-wrap text-sm">
        {getPaginationButtons().map((num, index) =>
          num === "..." ? (
            <span key={index} className="px-3 py-1 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => paginate(num)}
              className={`px-3 py-1 rounded ${
                num === currentPage
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-600 dark:text-white"
              }`}
            >
              {num}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SiswaKeluarTable;
