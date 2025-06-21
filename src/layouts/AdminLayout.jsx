import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const AdminLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false); // 👉 collapse state

  return (
    <div className="flex flex-col min-h-screen">
      {/* //header */}
      <Header
        isSidebarCollapsed={isSidebarCollapsed}
        toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* //main-content-wrapper */}
      <div className="flex flex-1">
        {/* //sidebar */}
        <Sidebar isCollapsed={isSidebarCollapsed} />

        {/* //page-content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 p-6 transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
