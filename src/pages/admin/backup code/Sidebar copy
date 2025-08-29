import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = ({ isCollapsed }) => {
  const location = useLocation();
  const [openSiswa, setOpenSiswa] = useState(false); // //submenu-siswa toggle

  return (
    // //sidebar-wrapper
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-sm overflow-y-auto transition-all duration-300`}
    >
      <nav className="p-4">
        <ul className="space-y-1">
          {/* //admin-route */}
          <li>
            <Link
              to="/admin/dashboard"
              className={`flex items-center p-2 rounded transition ${
                location.pathname === "/admin/dashboard"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <FaTachometerAlt className="mr-3" />
              {!isCollapsed && <span>Dashboard</span>}
            </Link>
          </li>

          {/* //admin-route */}
          <li>
            <Link
              to="/admin/users"
              className={`flex items-center p-2 rounded transition ${
                location.pathname === "/admin/users"
                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <FaUsers className="mr-3" />
              {!isCollapsed && <span>User List</span>}
            </Link>
          </li>

          {/* //submenu-siswa */}
          <li>
            <button
              onClick={() => setOpenSiswa(!openSiswa)}
              className="w-full flex items-center justify-between p-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition"
            >
              <span className="flex items-center">
                <FaUsers className="mr-3" />
                {!isCollapsed && <span>Siswa</span>}
              </span>
              {openSiswa ? <FaChevronDown /> : <FaChevronRight />}
            </button>

            {!isCollapsed && openSiswa && (
              <ul className="mt-1 space-y-1">
                <li>
                  <Link
                    to="/admin/siswa/aktif"
                    className={`flex items-center pl-10 p-2 rounded transition ${
                      location.pathname === "/admin/siswa/aktif"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {!isCollapsed && <span>Siswa Aktif</span>}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/siswa/keluar"
                    className={`flex items-center pl-10 p-2 rounded transition ${
                      location.pathname === "/admin/siswa/keluar"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {!isCollapsed && <span>Siswa Keluar</span>}
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
