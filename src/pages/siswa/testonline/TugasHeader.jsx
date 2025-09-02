import React from "react";
import { removeHTMLTags } from "../../../../utils/format";
import CountdownTimer from "./CountdownTimer";

const HeaderUjianTest = ({
  judul,
  waktuSisaMenit,
  onCountdownComplete,
  onShowDaftarSoal,
}) => {
  return (
    <div className="flex justify-between items-center bg-gray-800 p-4 shadow-md border-b border-gray-700 sticky top-0 z-40">
      <div>
        <h1 className="text-xl font-bold text-white">
          {removeHTMLTags(judul || "Test Online")}
        </h1>
        <p className="text-sm text-gray-300 mt-1">
          Test - Sisa Waktu Pengerjaan
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <CountdownTimer
          waktuSisaMenit={waktuSisaMenit}
          onComplete={onCountdownComplete}
        />
        <button
          onClick={onShowDaftarSoal}
          className="bg-blue-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>📑</span>
          <span>Daftar Soal</span>
        </button>
      </div>
    </div>
  );
};

export default HeaderUjianTest;