import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { menuConfig } from "./sidebarMenuConfig";
import { useAuth } from "../contexts/AuthContext";

const Sidebar = ({ isCollapsed, role = "admin" }) => {
  const { logout } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const menus = menuConfig[role] || [];

  const toggleSubmenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const isChildActive = (children) => {
    return children.some((child) => location.pathname === child.path);
  };

  return (
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-sm overflow-y-auto transition-all duration-300`}
    >
      <nav className="p-4">
        <ul className="space-y-1">
          {menus.map((menu) => {
            // Handle logout menu
            if (menu.label === "Logout") {
              return (
                <li key={menu.key}>
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full p-2 rounded transition text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    {menu.icon}
                    {!isCollapsed && <span>{menu.label}</span>}
                  </button>
                </li>
              );
            }

            // Handle menu dengan children
            if (menu.children) {
              const isOpen = openMenus[menu.key] || false;
              const hasActiveChild = isChildActive(menu.children);

              return (
                <li key={menu.key}>
                  <button
                    onClick={() => toggleSubmenu(menu.key)}
                    className={`w-full flex items-center justify-between p-2 rounded transition ${
                      hasActiveChild || isOpen
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    <span className="flex items-center">
                      {menu.icon}
                      {!isCollapsed && <span>{menu.label}</span>}
                    </span>
                    {!isCollapsed &&
                      (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
                  </button>

                  {!isCollapsed && isOpen && (
                    <ul className="mt-1 space-y-1">
                      {menu.children.map((child) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <li key={child.key}>
                            <Link
                              to={child.path}
                              className={`flex items-center pl-10 p-2 rounded transition ${
                                isChildActive
                                  ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            }

            // Handle menu biasa
            return (
              <li key={menu.key}>
                <Link
                  to={menu.path}
                  className={`flex items-center p-2 rounded transition ${
                    isActivePath(menu.path)
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {menu.icon}
                  {!isCollapsed && <span>{menu.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
