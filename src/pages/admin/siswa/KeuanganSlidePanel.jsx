// components/slidepanels/KeuanganSlidePanel.jsx
import React from "react";

const KeuanganSlidePanel = ({ onClose, user }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 z-40"
        onClick={onClose}
      />

      {/* Slide Panel */}
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg z-50 transition-transform transform translate-x-0">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Keuangan Siswa</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ✕
          </button>
        </div>
        <div className="p-4 overflow-y-auto h-full">
          {/* Konten dummy */}
          <p className="mb-4">Nama: {user?.name}</p>
          <div className="space-y-4">
            <div className="border rounded p-3">
              <p className="font-semibold">Invoice #001</p>
              <p>Tagihan: Rp 500.000</p>
              <p>Status: <span className="text-green-600 font-semibold">Lunas</span></p>
            </div>
            <div className="border rounded p-3">
              <p className="font-semibold">Invoice #002</p>
              <p>Tagihan: Rp 700.000</p>
              <p>Status: <span className="text-yellow-600 font-semibold">Belum Lunas</span></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default KeuanganSlidePanel;
