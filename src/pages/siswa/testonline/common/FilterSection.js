import React from "react";
import { HiFilter } from "react-icons/hi";

const FilterSection = ({
  selectedMapel,
  setSelectedMapel,
  mapelOptions,
  judul,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 className="text-2xl font-bold text-purple-600 mb-4 md:mb-0">
        {judul}
      </h1>

      <div className="flex items-center gap-3">
        <HiFilter className="text-gray-600 text-xl" />
        <select
          value={selectedMapel}
          onChange={(e) => setSelectedMapel(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Semua Mata Pelajaran</option>
          {mapelOptions.map((mapel) => (
            <option key={mapel.kd_mapel} value={mapel.kd_mapel}>
              {mapel.nm_mapel}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterSection;
