import React from "react";

const DaftarSoalModal = ({
  soal,
  currentIndex,
  getStatusSoal,
  onClose,
  onSelectSoal,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white">Daftar Soal</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {soal.map((_, index) => {
            const status = getStatusSoal(index);
            const bgColor =
              status === "belum-dijawab"
                ? "bg-red-600"
                : status === "ragu-ragu"
                ? "bg-yellow-500"
                : "bg-green-600";

            return (
              <button
                key={index}
                onClick={() => onSelectSoal(index)}
                className={`w-10 h-10 rounded flex items-center justify-center text-white font-semibold text-sm transition-transform hover:scale-110 ${
                  currentIndex === index ? "ring-2 ring-blue-400" : ""
                } ${bgColor}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-white">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-600 rounded mr-2"></div>
            <span>Sudah Dijawab</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded mr-2"></div>
            <span>Ragu-Ragu</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-600 rounded mr-2"></div>
            <span>Belum Dijawab</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DaftarSoalModal;
