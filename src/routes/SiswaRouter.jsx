// src/routes/siswaRoutes.js
import SiswaDashboard from "../pages/siswa/Dashboard";
import Course from "../pages/siswa/Course";
import Testonline from "../pages/siswa/testonline/TestonlineDashboard";
import Tugas from "../pages/siswa/tugas/Tugas";
// Import lainnya...

const siswaRoutes = [
  { path: "/siswa", element: <SiswaDashboard /> },
  { path: "/siswa/course", element: <Course /> },
  { path: "/siswa/test", element: <Testonline /> },
  { path: "/siswa/tugas", element: <Tugas /> },
  // Tambahkan route lainnya sesuai menuItems
];

export default siswaRoutes;