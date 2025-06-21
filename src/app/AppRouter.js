// src/app/AppRouter.js
import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import UserList from "../pages/admin/UserList"; // kalau sudah dibuat
import AdminLayout from "../layouts/AdminLayout";

const AppRouter = () => {
  return (
    <Routes>
      {/* // ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          <AdminLayout>
            <Dashboard />
          </AdminLayout>
        }
      />
      <Route
        path="/admin/users"
        element={
          <AdminLayout>
            <UserList />
          </AdminLayout>
        }
      />
    </Routes>
  );
};

export default AppRouter;
