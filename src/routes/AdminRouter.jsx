import Dashboard from "../pages/admin/Dashboard";
import Kalender from "../pages/admin/Kalender";
import Lembaga from "../pages/admin/Lembaga";
import DataSatelit from "../pages/admin/DataSatelit";
import Pegawai from "../pages/admin/Pegawai";
import SiswaAktif from "../pages/admin/SiswaAktif";
import SiswaAlumni from "../pages/admin/SiswaAlumni";
import EditSiswa from "../pages/admin/siswa/EditSiswa";
import SiswaPPDB from "../pages/admin/siswa/SiswaPPDB";
import LanjutkanPPDB from "../pages/admin/siswa/LanjutkanPPDB";
import TambahSiswaAwal from "../pages/admin/siswa/TambahSiswaAwal";
import TambahSiswa from "../pages/admin/siswa/TambahSiswa";
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
  { path: "/admin/siswa/ppdb", element: <SiswaPPDB /> },
  { path: "/admin/siswa/tambah", element: <TambahSiswaAwal /> },
  { path: "/admin/siswa/lanjutkan-ppdb/:nis", element: <LanjutkanPPDB /> },
  { path: "/admin/siswa/aktif", element: <SiswaAktif /> },
  {
    path: "/admin/siswa/edit/:nis",
    element: <EditSiswa />,
  },
  {
    path: "/admin/siswa/lanjutkan-siswa",
    element: <TambahSiswa />,
  },
  { path: "/admin/siswa/alumni", element: <SiswaAlumni /> },
  { path: "/admin/siswa/keluar", element: <SiswaKeluar /> },
  { path: "/admin/eraport", element: <Eraport /> },
  { path: "/admin/kisi-kisi", element: <KisiKisi /> },
  { path: "/admin/keuangan", element: <Keuangan /> },
  { path: "/admin/logout", element: <Logout /> }, // bisa diarahkan ke halaman login atau handle redirect
];

export default adminRoutes;
