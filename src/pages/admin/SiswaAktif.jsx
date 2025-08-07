import React, { useEffect, useState, useRef } from "react";
import {
  fetchAllSiswa,
  fetchAllkelas,
  keluarkanSiswa,
  toggleKelasOnline,
  toggleKelasOffline,
} from "../../api/siswaAPI";
import SiswaDetailPanel from "../../pages/admin/siswa/SiswaDetailPanel"; // sesuaikan path-nya
import KeuanganSlidePanel from "../../pages/admin/siswa/KeuanganSlidePanel";

import {
  HiDotsVertical,
  HiEye, // lihat
  HiCalendar, // absensi
  HiWifi, // online
  HiBan, // offline
  HiTrash, // keluarkan
  HiDocumentReport,
} from "react-icons/hi";
import { showAlert } from "../../utils/toast";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
const MySwal = withReactContent(Swal);
const SiswaAktifTable = () => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
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

  //drodown handle
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdownId(null);
      }
    }

    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);

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

  const handleKeluarkan = async (nis, nama) => {
    const { isConfirmed, value: tanggalKeluar } = await Swal.fire({
      title: `Keluarkan ${nama}?`,
      text: "Masukkan tanggal siswa keluar:",
      input: "date",
      inputValue: new Date().toISOString().split("T")[0], // default: hari ini
      showCancelButton: true,
      confirmButtonText: "Keluarkan",
      cancelButtonText: "Batal",
      showLoaderOnConfirm: true,
      preConfirm: async (tanggal) => {
        if (!tanggal) {
          Swal.showValidationMessage("Tanggal wajib diisi.");
          return false;
        }

        try {
          await keluarkanSiswa(nis, tanggal); // kirim ke API
        } catch (err) {
          Swal.showValidationMessage("Gagal mengeluarkan siswa.");
          console.error(err);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
      customClass: {
        actions: "flex justify-center",
        confirmButton:
          "bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 mr-2 rounded",
        cancelButton:
          "bg-gray-400 hover:bg-gray-500 text-white font-semibold px-4 py-2 ml-2 rounded",
      },
    });

    if (isConfirmed) {
      showAlert("Siswa berhasil dikeluarkan.", "success");
      fetchData(); // Refresh data
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

  const [slidePanel, setSlidePanel] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

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
                <td className="px-4 py-3 text-center relative">
                  <div className="inline-block text-left">
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === siswa.siswa_id
                            ? null
                            : siswa.siswa_id
                        )
                      }
                      className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <HiDotsVertical className="h-5 w-5" />
                    </button>

                    {openDropdownId === siswa.siswa_id && (
                      <div
                        ref={dropdownRef}
                        className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                      >
                        <div className="py-1 text-sm text-gray-700 dark:text-white">
                          {/* Lihat */}
                          <button
                            onClick={() => {
                              setSelectedSiswa(siswa);
                              setIsDetailOpen(true);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <HiEye className="w-4 h-4 text-gray-500" />
                            Lihat
                          </button>

                          {/* Keuangan */}
                          <button
                            onClick={() => {
                              setSelectedSiswa(siswa); // user mana yang diklik
                              setSlidePanel("keuangan"); // buka panel keuangan
                              setOpenDropdownId(null); // tutup dropdown
                            }}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <HiDocumentReport className="w-4 h-4 text-gray-500" />
                            Keuangan
                          </button>

                          {/* Online */}
                          <button
                            onClick={() => {
                              handleToggleOnline(siswa.siswa_nis, siswa.oc);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <HiWifi className="w-4 h-4 text-gray-500" />
                            {siswa.oc === 1
                              ? "Nonaktifkan Online"
                              : "Aktifkan Online"}
                          </button>

                          {/* Offline */}
                          <button
                            onClick={() => {
                              handleToggleOffline(siswa.siswa_nis, siswa.kc);
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                          >
                            <HiBan className="w-4 h-4 text-gray-500" />
                            {siswa.kc === 1
                              ? "Nonaktifkan Offline"
                              : "Aktifkan Offline"}
                          </button>

                          {/* Divider */}
                          <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>

                          {/* Keluarkan */}
                          <button
                            onClick={() => {
                              handleKeluarkan(
                                siswa.siswa_nis,
                                siswa.siswa_nama
                              );
                              setOpenDropdownId(null);
                            }}
                            className="flex items-center gap-2 px-4 py-2 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-gray-700"
                          >
                            <HiTrash className="w-4 h-4 text-red-600" />
                            Keluarkan
                          </button>
                        </div>
                      </div>
                    )}
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

      {/* keuanganpanel */}
      {slidePanel === "keuangan" && (
        <KeuanganSlidePanel
          siswa={selectedSiswa}
          onClose={() => setSlidePanel(null)}
        />
      )}
    </div>
  );
};

export default SiswaAktifTable;
