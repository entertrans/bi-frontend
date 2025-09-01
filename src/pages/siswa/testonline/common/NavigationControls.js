import React from "react";

const NavigationControls = ({
  currentIndex,
  totalSoal,
  onPrev,
  onNext,
  onSubmit,
  getStatusSoal,
}) => {
  const status = getStatusSoal(currentIndex);
  const statusText = {
    "belum-dijawab": "⚠ Belum dijawab",
    "ragu-ragu": "⚠ Ragu-ragu",
    "sudah-dijawab": "✓ Sudah dijawab",
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700 sticky bottom-0 z-40">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <button
          className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          onClick={onPrev}
          disabled={currentIndex === 0}
        >
          <span>⬅</span>
          <span>Sebelumnya</span>
        </button>

        <div className="text-center">
          <div className="text-sm text-gray-400">
            Soal {currentIndex + 1} dari {totalSoal}
          </div>
          <div className="text-xs text-gray-500 mt-1">{statusText[status]}</div>
        </div>

        {currentIndex === totalSoal - 1 ? (
          <button
            className="bg-green-600 px-8 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center space-x-2"
            onClick={onSubmit}
          >
            <span>✅</span>
            <span>Kumpulkan</span>
          </button>
        ) : (
          <button
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            onClick={onNext}
          >
            <span>Selanjutnya</span>
            <span>➡</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default NavigationControls;
