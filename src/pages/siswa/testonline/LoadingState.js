import React from "react";

const LoadingState = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-white text-lg">Memuat soal ujian...</p>
        <p className="text-gray-400 text-sm mt-2">Harap tunggu sebentar</p>
      </div>
    </div>
  );
};

export default LoadingState;
