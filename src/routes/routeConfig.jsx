// src/routes/routeConfig.js
import Dashboard from "../pages/admin/Dashboard";
import UserList from "../pages/admin/UserList";
import GuruDashboard from "../pages/guru/Dashboard";

// 👉 ADMIN ROUTES
export const adminRoutes = [
  {
    path: "/admin",
    element: <Dashboard />,
  },
  {
    path: "/admin/users",
    element: <UserList />,
  },
];

// 👉 GURU ROUTES
export const guruRoutes = [
  {
    path: "/guru",
    element: <GuruDashboard />,
  },
];
