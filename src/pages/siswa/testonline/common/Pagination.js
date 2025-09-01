import React from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <HiChevronLeft className="text-xl" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg border ${
              currentPage === page
                ? "bg-purple-600 text-white border-purple-600"
                : "border-gray-300 hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          <HiChevronRight className="text-xl" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;
