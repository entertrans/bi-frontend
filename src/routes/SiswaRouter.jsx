import ListTugas from "../pages/siswa/tugas/ListTugas";
import ListUjian from "../pages/siswa/testonline/ListUjian";
import TestReview from "../pages/siswa/testreview/TestReview";
import KisiKisi from "../pages/siswa/kisikisi/DetailKisiKisi";
import DetailKeuangan from "../pages/siswa/keuangan/InvoiceHistory";
import InvoiceDetail from "../pages/siswa/keuangan/InvoiceDetail";
import OnlineClassDashboard from "../pages/siswa/kelasonline/OnlineClassDashboard";
import OnlineLibrary from "../pages/siswa/Modul/OnlineLibrary";
import Dashboard from "../pages/siswa/Dashboard/mainDashboard";
import DaftarKelasMapel from "../pages/siswa/kelasonline/DaftarKelasMapel";
import DetailKelas from "../pages/siswa/kelasonline/DetailKelas";

const siswaRoutes = [
  { path: "/siswa", element: <Dashboard /> },
  { path: "/siswa/online", element: <OnlineClassDashboard /> },
  { path: "/siswa/online/kelas/:mapel", element: <DaftarKelasMapel /> },
  { path: "/siswa/online/kelas/:mapel/:id", element: <DetailKelas  /> },
  { path: "/siswa/test", element: <ListUjian /> },
  { path: "/siswa/tugas", element: <ListTugas /> },
  { path: "/siswa/review", element: <TestReview /> },
  { path: "/siswa/kisi-kisi", element: <KisiKisi /> },
  { path: "/siswa/keuangan", element: <DetailKeuangan /> },
  { path: "/siswa/modul", element: <OnlineLibrary /> },
  { path: "/siswa/invoice/detail/:nis", element: <InvoiceDetail /> },
  // <path="/siswa/invoice/detail/:nis" element={<InvoiceDetail />} />
];

export default siswaRoutes;
