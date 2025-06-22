import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Breadcrumb from "../components/Breadcrumb";
import { useLocation } from "react-router-dom";

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const location = useLocation(); // ambil path saat ini

  return (
    <div className="flex flex-col min-h-screen">
      {/* //header */}
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        role="admin"
      />

      {/* //main-content-wrapper */}
      <div className="flex flex-1">
        {/* //sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} role="admin" />

        {/* //page-content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300">
          {/* 🧭 Breadcrumb */}
          <Breadcrumb path={location.pathname} />

          {/* Konten halaman */}
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
