import SiswaDashboard from "../pages/siswa/Dashboard";
import Course from "../pages/siswa/Course";
import Tugas from "../pages/siswa/tugas/Tugas";
import ListUjian from "../pages/siswa/testonline/ListUjian";
import CBTUjian from "../pages/siswa/testonline/CBTUjian"; // import CBTUjian

const siswaRoutes = [
  { path: "/siswa", element: <SiswaDashboard /> },
  { path: "/siswa/course", element: <Course /> },
  { path: "/siswa/test", element: <ListUjian /> },
  { path: "/siswa/tugas", element: <Tugas /> },
  { path: "/siswa/ujian/:sessionId", element: <CBTUjian /> }, // ✅ tambahin ini
];

export default siswaRoutes;
