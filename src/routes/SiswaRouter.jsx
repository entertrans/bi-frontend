import SiswaDashboard from "../pages/siswa/Dashboard";
import Course from "../pages/siswa/Course";
import ListTugas from "../pages/siswa/tugas/ListTugas";
import ListUjian from "../pages/siswa/testonline/ListUjian";
import TestReview from "../pages/siswa/testreview/TestReview";
import KisiKisi from "../pages/siswa/kisikisi/DetailKisiKisi";

const siswaRoutes = [
  { path: "/siswa", element: <SiswaDashboard /> },
  { path: "/siswa/course", element: <Course /> },
  { path: "/siswa/test", element: <ListUjian /> },
  { path: "/siswa/tugas", element: <ListTugas /> },
  { path: "/siswa/review", element: <TestReview /> },
  { path: "/siswa/kisi-kisi", element: <KisiKisi /> },
];

export default siswaRoutes;
