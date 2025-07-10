import React, { useEffect, useState } from "react";
import {
  fetchAllSiswa,
  fetchAllkelas,
  keluarkanSiswa,
  toggleKelasOnline,
  toggleKelasOffline,
} from "../../api/siswaAPI";
import SiswaDetailPanel from "../../pages/admin/siswa/SiswaDetailPanel"; // sesuaikan path-nya
import { showAlert } from "../../utils/toast";
import Swal from "sweetalert2";

const SiswaAktifTable = () => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [kelasOptions, setKelasOptions] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const siswaPerPage = 10;
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const handleClosePanel = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedSiswa(null), 300);
  };

  // Pindahkan ke luar useEffect
  const fetchData = async () => {
    try {
      const [siswaData, kelasData] = await Promise.all([
        fetchAllSiswa(),
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
  };

  // Tetap pakai useEffect seperti ini
  useEffect(() => {
    fetchData();
  }, []);

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

  const handleToggleOnline = async (nis, currentOC) => {
    const newOC = currentOC === 1 ? 0 : 1;

    const result = await Swal.fire({
      title:
        newOC === 1 ? "Aktifkan Kelas Online?" : "Nonaktifkan Kelas Online?",
      text:
        newOC === 1
          ? "Siswa akan dimasukkan ke program online. Lanjutkan?"
          : "Siswa akan dikeluarkan dari program online. Lanjutkan?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: newOC === 1 ? "Ya, aktifkan!" : "Ya, nonaktifkan!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`http://localhost:8080/siswa/${nis}/online`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: newOC }),
      });

      showAlert("Status kelas online diperbarui.", "success");
      fetchData(); // reload data
    } catch (error) {
      console.error("Gagal mengubah status kelas online:", error);
      showAlert("Gagal mengubah status kelas online.", "error");
    }
  };

  const handleKeluarkan = async (nis) => {
    const result = await Swal.fire({
      title: "Keluarkan Siswa?",
      text: "Apakah kamu yakin ingin mengeluarkan siswa ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, keluarkan!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await keluarkanSiswa(nis);
      showAlert("Siswa berhasil dikeluarkan.", "success");
      fetchData(); // refresh data siswa
    } catch (error) {
      console.error("Gagal mengeluarkan siswa:", error);
      showAlert("Gagal mengeluarkan siswa.", "error");
    }
  };

  const handleToggleOffline = async (nis, currentKC) => {
    const newKC = currentKC === 1 ? 0 : 1;

    const result = await Swal.fire({
      title:
        newKC === 1 ? "Aktifkan Kelas Offline?" : "Nonaktifkan Kelas Offline?",
      text:
        newKC === 1
          ? "Siswa akan dimasukkan ke program offline. Lanjutkan?"
          : "Siswa akan dikeluarkan dari program offline. Lanjutkan?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: newKC === 1 ? "Ya, aktifkan!" : "Ya, nonaktifkan!",
      cancelButtonText: "Batal",
      buttonsStyling: false,
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (!result.isConfirmed) return;

    try {
      await fetch(`http://localhost:8080/siswa/${nis}/offline`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: newKC }),
      });

      showAlert("Status kelas offline diperbarui.", "success");
      fetchData(); // reload data
    } catch (error) {
      console.error("Gagal mengubah status kelas offline:", error);
      showAlert("Gagal mengubah status kelas offline.", "error");
    }
  };

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
      <div className="flex flex-wrap md:flex-nowrap gap-4 items-center justify-between mb-4">
        <div className="flex flex-wrap gap-2">
          <select
            value={selectedKelas}
            onChange={(e) => {
              setSelectedKelas(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            {kelasOptions.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={selectedProgram}
            onChange={(e) => {
              setSelectedProgram(e.target.value);
              setCurrentPage(1);
            }}
            className="p-2 border rounded dark:bg-gray-700 dark:text-white"
          >
            <option value="">Semua Program</option>
            <option value="online">Kelas Online</option>
            <option value="offline">Kelas Offline</option>
          </select>
        </div>

        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari siswa..."
          className="p-2 border rounded w-full md:w-72 dark:bg-gray-700 dark:text-white"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left tracking-wider">Siswa</th>
              <th className="px-6 py-3 text-left">NISN</th>
              <th className="px-6 py-3 w-32 text-left">Kelas</th>
              <th className="px-6 py-3 text-left">Telp</th>
              <th className="px-6 py-3 w-32 text-left">Cabang</th>
              <th className="px-6 py-3 text-left">Program</th>
              <th className="px-6 py-3 w-32 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.map((siswa) => (
              <tr key={siswa.siswa_id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-4">
                    {(() => {
                      const profilePicture =
                        Array.isArray(siswa.lampiran) &&
                        siswa.lampiran.find(
                          (l) => l.dokumen_jenis === "profil-picture"
                        )?.url;

                      return (
                        <img
                          src={
                            profilePicture ||
                            `https://placehold.co/40x40?text=AA&font=roboto`
                          }
                          alt={siswa.siswa_nama}
                          className="w-10 h-10 rounded-full border object-cover"
                        />
                      );
                    })()}

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
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                    {siswa.Satelit?.satelit_nama}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col items-start space-y-1">
                    {siswa.oc === 1 && (
                      <span className="bg-blue-600 text-white px-3 py-1 text-xs rounded shadow">
                        Kelas Online
                      </span>
                    )}
                    {siswa.kc === 1 && (
                      <span className="bg-red-600 text-white px-3 py-1 text-xs rounded shadow">
                        Kelas Offline
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-center space-y-1">
                  <div className="flex flex-wrap justify-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedSiswa(siswa);
                        setIsDetailOpen(true);
                      }}
                      className="px-2 w-32 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Lihat
                    </button>

                    <button
                      onClick={() => handleKeluarkan(siswa.siswa_nis)}
                      className="px-2 w-32 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700"
                    >
                      Keluarkan
                    </button>
                    <button className="px-2 w-32 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700">
                      Absensi
                    </button>
                    <button
                      onClick={() =>
                        handleToggleOnline(siswa.siswa_nis, siswa.oc)
                      }
                      className={`px-2 py-1 w-32 text-xs rounded transition ${
                        siswa.oc === 1
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Online
                    </button>

                    <button
                      onClick={() =>
                        handleToggleOffline(siswa.siswa_nis, siswa.kc)
                      }
                      className={`px-2 py-1 w-32 text-xs rounded ${
                        siswa.kc === 1
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      Offline
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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

      {/* Off-Canvas Panel */}
      <SiswaDetailPanel
        siswa={selectedSiswa}
        isOpen={isDetailOpen}
        onClose={handleClosePanel}
      />
    </div>
  );
};

export default SiswaAktifTable;
