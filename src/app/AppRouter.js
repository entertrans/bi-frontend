// src/app/AppRouter.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import GuruLayout from "../layouts/GuruLayout";
import SiswaLayout from "../layouts/SiswaLayout";
import Login from "../pages/Login";
import adminRoutes from "../routes/AdminRouter";
import guruRoutes from "../routes/GuruRouter";
import siswaRoutes from "../routes/SiswaRouter";
import CBTUjian from "../pages/siswa/testonline/CBTUjian";
import { useAuth } from "../contexts/AuthContext";
import CBTTugas from "../pages/siswa/testonline/CBTTugas";

function LogoutPage() {
  const { logout } = useAuth();

  React.useEffect(() => {
    logout();
    window.location.href = "/login"; // redirect
  }, [logout]);

  return <p>Logging out...</p>;
}

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Logout routes */}
      <Route path="/logout" element={<LogoutPage />} />
      <Route path="/admin/logout" element={<LogoutPage />} />
      <Route path="/guru/logout" element={<LogoutPage />} />
      <Route path="/siswa/logout" element={<LogoutPage />} />
      <Route path="/siswa/ujian/:sessionId" element={<CBTUjian />} />
      <Route path="/siswa/tugas/:sessionId" element={<CBTTugas />} />
       {/* { path: "/siswa/ujian/:sessionId", element: <CBTUjian /> }, // ✅ tambahin ini */}

      {/* Admin Routes */}
      {adminRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<AdminLayout>{route.element}</AdminLayout>}
        />
      ))}

      {/* Guru Routes */}
      {guruRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<GuruLayout>{route.element}</GuruLayout>}
        />
      ))}

      {/* Siswa Routes */}
      {siswaRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<SiswaLayout>{route.element}</SiswaLayout>}
        />
      ))}

      {/* 404 */}
      <Route path="*" element={<div className="p-10">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
