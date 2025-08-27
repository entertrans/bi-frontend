// src/components/siswa/TopbarMenu.jsx
import React, { useRef } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  { name: "Beranda", path: "/siswa", icon: "🏠" },
  { name: "Kalender", path: "/siswa/kalender", icon: "📅" },
  { name: "Course", path: "/siswa/course", icon: "📘" },
  { name: "Kisi-Kisi", path: "/siswa/kisi-kisi", icon: "📄" },
  { name: "Keuangan", path: "/siswa/keuangan", icon: "💰" },
  { name: "Nilai", path: "/siswa/nilai", icon: "📊" },
  { name: "Absensi", path: "/siswa/absensi", icon: "✅" },
  { name: "Test Online", path: "/siswa/test", icon: "🧑‍💻" },
  { name: "Kuis", path: "/siswa/kuis", icon: "❓" },
  { name: "Tugas", path: "/siswa/tugas", icon: "📝" },
];

const TopbarMenu = () => {
  const scrollRef = useRef(null);
  const location = useLocation(); // Untuk mengetahui route aktif

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-sm">
      <div className="max-w-5xl mx-auto flex items-center px-4 relative">
        {/* ⬅️ Scroll Left */}
        <button
          onClick={scrollLeft}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 p-2"
        >
          <FaChevronLeft />
        </button>

        {/* 👉 Scrollable Menu Items */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto hide-scrollbar space-x-4 py-2 px-2"
        >
          {menuItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`min-w-max px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex items-center ${
                  isActive
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="mr-1">{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* ➡️ Scroll Right */}
        <button
          onClick={scrollRight}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 p-2"
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TopbarMenu;