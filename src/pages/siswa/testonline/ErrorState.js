import React from "react";

const ErrorState = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="text-red-500 text-6xl mb-4">⚠️</div>
        <p className="text-red-400 text-xl mb-2">Session tidak ditemukan</p>
        <p className="text-gray-400">Silakan hubungi pengawas ujian</p>
      </div>
    </div>
  );
};

export default ErrorState;
