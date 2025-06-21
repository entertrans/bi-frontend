// src/app/AppRouter.js
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import GuruLayout from "../layouts/GuruLayout";
import { adminRoutes, guruRoutes } from "../routes/routeConfig";

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

      {/* 👉 404 Page */}
      <Route path="*" element={<div className="p-10">404 Not Found</div>} />
    </Routes>
  );
};

export default AppRouter;
