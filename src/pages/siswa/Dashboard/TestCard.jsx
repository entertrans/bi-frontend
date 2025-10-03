import React from "react";
import { HiPlay, HiClock, HiBookOpen, HiUser } from "react-icons/hi";
import { cardStyles, testTypeConfig } from "../../../utils/CardStyles";

const TestCard = ({ test, onKerjakan }) => {
  const config = testTypeConfig[test.type_test] || testTypeConfig.default;
  const style = cardStyles[config.color];

  return (
    <div className={`${cardStyles.base} ${style.container}`}>
      {/* Status Badge */}
      <div className="mb-4">
        <span className={`px-3 py-1.5 text-xs rounded-full font-semibold ${style.badge}`}>
          {config.icon} {config.type}
        </span>
      </div>

      {/* Test Info */}
      <div className="flex-1 mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-3 line-clamp-2">
          {test.judul}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <HiBookOpen className="w-4 h-4 mr-2 text-blue-500" />
            <span className="truncate">{test.mapel}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <HiUser className="w-4 h-4 mr-2 text-green-500" />
            <span className="truncate">{test.guru}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <HiClock className="w-4 h-4 mr-2 text-purple-500" />
            <span>{test.durasi_menit} menit • {test.jumlah_soal_tampil} soal</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={() => onKerjakan(test.test_id, test.judul, test.durasi_menit)}
          className={`w-full ${style.button} px-4 py-2.5 rounded-lg font-semibold transition-colors flex items-center justify-center`}
        >
          <HiPlay className="w-5 h-5 mr-2" />
          Kerjakan Sekarang
        </button>
      </div>
    </div>
  );
};

export default TestCard;