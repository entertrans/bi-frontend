import Dashboard from "../pages/admin/Dashboard";
import Kalender from "../pages/admin/Kalender";
import Lembaga from "../pages/admin/Lembaga";
import DataSatelit from "../pages/admin/DataSatelit";
import Pegawai from "../pages/admin/Pegawai";
import SiswaAktif from "../pages/admin/SiswaAktif";
import SiswaKeluar from "../pages/admin/SiswaKeluar";
import Eraport from "../pages/admin/Eraport";
import KisiKisi from "../pages/admin/KisiKisi";
import Keuangan from "../pages/admin/Keuangan";
import Logout from "../pages/admin/Logout"; // nanti bisa di-handle dengan logic auth/logout

const adminRoutes = [
  { path: "/admin", element: <Dashboard /> },
  { path: "/admin/kalender", element: <Kalender /> },
  { path: "/admin/lembaga", element: <Lembaga /> },
  { path: "/admin/data-satelit", element: <DataSatelit /> },
  { path: "/admin/pegawai", element: <Pegawai /> },
  { path: "/admin/siswa/aktif", element: <SiswaAktif /> },
  { path: "/admin/siswa/keluar", element: <SiswaKeluar /> },
  { path: "/admin/eraport", element: <Eraport /> },
  { path: "/admin/kisi-kisi", element: <KisiKisi /> },
  { path: "/admin/keuangan", element: <Keuangan /> },
  { path: "/admin/logout", element: <Logout /> }, // bisa diarahkan ke halaman login atau handle redirect
];

export default adminRoutes;
