import React, { useState, useRef, useEffect } from "react";
import { RiMessage3Line } from "react-icons/ri";
import { HiBellAlert, HiMoon, HiSun } from "react-icons/hi2";
import { VscTasklist } from "react-icons/vsc";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SiswaHeader = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const dropdownRef = useRef();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // 👉 LOG USER DATA UNTUK DEBUGGING
  useEffect(() => {
    // if (user && user.siswa) {
    //   console.log("Siswa data:", user.siswa);
    //   console.log("Available keys in siswa object:", Object.keys(user.siswa));
    // }
  }, [user]);

  // 👉 Handle klik luar untuk tutup dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 👉 Load theme dari localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    }
  }, []);

  // 👉 Toggle theme light ↔ dark
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // 👉 Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
    setDropdownOpen(false);
  };

  return (
    <header className="w-full h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 shadow">
      <div className="max-w-5xl mx-auto px-4 h-full flex items-center justify-between">
        {/* ⬅️ Icon-icon */}
        <div className="flex items-center gap-6 text-xl text-gray-700 dark:text-white relative">
          {/* 🔔 Messages */}
          <div className="relative">
            <RiMessage3Line className="cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              10
            </span>
          </div>

          {/* 🔔 Alerts */}
          <div className="relative">
            <HiBellAlert className="cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              8
            </span>
          </div>

          {/* 📋 Tasks */}
          <div className="relative">
            <VscTasklist className="cursor-pointer" />
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
              7
            </span>
          </div>
        </div>

        {/* ➡️ Bagian kanan */}
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {/* 🌞/🌙 Toggle */}
          <button
            onClick={toggleTheme}
            className="text-xl text-gray-700 dark:text-white"
          >
            {theme === "light" ? <HiMoon /> : <HiSun />}
          </button>

          {/* Username + Avatar - KHUSUS SISWA SAJA */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="text-sm text-gray-800 dark:text-white">
              {user?.siswa?.siswa_nama || user?.username || "Siswa"}
            </span>
            <img
              src={
                user?.siswa?.siswa_jenkel === 'P' 
                  ? "https://i.pravatar.cc/100?u=siswi" 
                  : "https://i.pravatar.cc/100?u=siswa"
              }
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-700 rounded shadow-lg z-10 py-2 border dark:border-gray-600">
              
              {/* Info Siswa */}
              <div className="px-4 py-2 border-b dark:border-gray-600">
                <p className="text-sm font-medium text-gray-800 dark:text-white">
                  {user?.siswa?.siswa_nama || user?.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  NIS: {user?.siswa?.siswa_nis || "-"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Kelas: {user?.siswa?.kelas?.kelas_nama || "-"}
                </p>
              </div>
              
              {/* Menu Items */}
              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => {
                  navigate("/siswa/profile");
                  setDropdownOpen(false);
                }}
              >
                Profil
              </button>

              <button
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => {
                  navigate("/siswa/settings");
                  setDropdownOpen(false);
                }}
              >
                Pengaturan
              </button>

              <div className="border-t dark:border-gray-600 my-1"></div>

              <button
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiswaHeader;