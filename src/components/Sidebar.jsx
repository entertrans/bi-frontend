import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { menuConfig } from "./sidebarMenuConfig";

// //sidebar-menu-config

const Sidebar = ({ isCollapsed, role = "admin" }) => {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({}); // submenu toggle by label
  const menus = menuConfig[role] || [];

  const toggleSubmenu = (label) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    // //sidebar-wrapper
    <aside
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } h-[calc(100vh-4rem)] sticky top-16 bg-white dark:bg-gray-900 border-r dark:border-gray-700 shadow-sm overflow-y-auto transition-all duration-300`}
    >
      <nav className="p-4">
        <ul className="space-y-1">
          {menus.map((menu, idx) => {
            const isActive = menu.path && location.pathname === menu.path;

            // //submenu-render
            if (menu.children) {
              const isOpen = openMenus[menu.label] || false;
              return (
                <li key={idx}>
                  {/* //sidebar-submenu-toggle */}
                  <button
                    onClick={() => toggleSubmenu(menu.label)}
                    className={`w-full flex items-center justify-between p-2 rounded transition ${
                      isOpen
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

                  {/* //sidebar-subitems */}
                  {!isCollapsed && isOpen && (
                    <ul className="mt-1 space-y-1">
                      {menu.children.map((child, cidx) => {
                        const isChildActive = location.pathname === child.path;
                        return (
                          <li key={cidx}>
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

            // //sidebar-item
            return (
              <li key={idx}>
                <Link
                  to={menu.path}
                  className={`flex items-center p-2 rounded transition ${
                    isActive
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
