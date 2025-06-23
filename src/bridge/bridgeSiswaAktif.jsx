import React, { useState, useEffect } from "react";
import { fetchAllSiswa } from "../api/siswaAPI";
import SiswaAktifTable from "../components/SiswaAktifTable";

const BridgeSiswaAktif = () => {
  const [dataSiswa, setDataSiswa] = useState([]);
  const [selectedKelas, setSelectedKelas] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAllSiswa()
      .then((data) => setDataSiswa(data))
      .catch((err) => console.error("Gagal ambil data siswa:", err));
  }, []);

  const filteredData = dataSiswa.filter((siswa) => {
    const kelasMatch = selectedKelas
      ? siswa.siswa_kelas_id.toString() === selectedKelas
      : true;
    const searchMatch =
      siswa.siswa_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.siswa_nis.includes(searchTerm);
    return kelasMatch && searchMatch;
  });

  return (
    <SiswaAktifTable
      data={filteredData}
      selectedKelas={selectedKelas}
      setSelectedKelas={setSelectedKelas}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      rawData={dataSiswa}
      setDataSiswa={setDataSiswa}
    />
  );
};

export default BridgeSiswaAktif;
