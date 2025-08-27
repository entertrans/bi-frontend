// src/app/AppRouter.js
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import GuruLayout from "../layouts/GuruLayout";
import SiswaLayout from "../layouts/SiswaLayout";

// 👉 Langsung impor dari file masing-masing
import adminRoutes from "../routes/AdminRouter";
import guruRoutes from "../routes/GuruRouter";
import siswaRoutes from "../routes/SiswaRouter";

const AppRouter = () => {
  return (
    <Routes>
      {/* 👉 ADMIN ROUTES */}
      {adminRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<AdminLayout>{route.element}</AdminLayout>}
        />
      ))}

      {/* 👉 GURU ROUTES */}
      {guruRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<GuruLayout>{route.element}</GuruLayout>}
        />
      ))}

      {/* 👉 SISWA ROUTES */}
      {siswaRoutes.map((route, idx) => (
        <Route
          key={idx}
          path={route.path}
          element={<SiswaLayout>{route.element}</SiswaLayout>}
        />
      ))}

      {/* 👉 404 Page */}
      <Route path="*" element={<div className="p-10">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
