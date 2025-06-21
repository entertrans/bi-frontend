import React from "react";
import TopbarMenu from "../components/siswa/TopbarMenu";
import SiswaHeader from "../components/siswa/SiswaHeader";
import SiswaProfileCard from "../components/siswa/SiswaProfileCard";

const SiswaLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Avatar / Header */}
      {/* ...bisa ditambahkan nanti... */}
      <SiswaHeader />
      <SiswaProfileCard />
      {/* Menu Navigasi Tengah */}

      <TopbarMenu />

      {/* Konten Halaman */}
      <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900">{children}</main>
    </div>
  );
};

export default SiswaLayout;
