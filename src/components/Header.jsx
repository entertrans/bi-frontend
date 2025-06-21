import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FaBarsStaggered } from "react-icons/fa6";

const Header = ({ isSidebarCollapsed, toggleSidebar }) => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <header className="w-full h-16 px-6 flex justify-between items-center bg-white dark:bg-gray-800 dark:text-white border-b dark:border-gray-700 shadow z-10 sticky top-0">
      <div className="flex items-center space-x-4">
        {/* 🟩 Toggle Sidebar */}
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-blue-500 dark:hover:text-blue-400 transition"
        >
          {isSidebarCollapsed ? <FaBars /> : <FaBarsStaggered />}
        </button>

        {/* Judul */}
        <h1 className="text-xl font-semibold text-blue-600 dark:text-blue-300">
          Admin Panel
        </h1>
      </div>

      {/* Right Side */}
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          {isDark ? <FaSun /> : <FaMoon />}
        </button>

        {/* Notification */}
        <button className="relative">
          <FaBell className="text-xl" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <FaUserCircle className="text-2xl" />
          <span className="text-sm font-medium">Admin</span>
        </div>

        {/* //header-extra */}
      </div>
    </header>
  );
};

export default Header;
