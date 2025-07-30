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
import Tagihan from "../pages/admin/keuangan/Tagihan";
import Invoice from "../pages/admin/keuangan/InvoiceTemp";
import PenerimaInvoice from "../pages/admin/keuangan/PenerimaInvoice";
import Kwitansi from "../pages/admin/keuangan/Kwitansi";
import KwitansiDetail from "../pages/admin/keuangan/KwitansiDetail";
import PettyCashSerpongPage from "../pages/admin/pettycash/PettyCashSerpongPage";
import PettyCashBogorPage from "../pages/admin/pettycash/PettyCashBogorPage";
import PettyCashTransaksiPage from "../pages/admin/pettycash/PettyCashTransaksiPage";

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
  { path: "/admin/keuangan/tagihan", element: <Tagihan /> },
  { path: "/admin/keuangan/invoice", element: <Invoice /> },
  { path: "/admin/invoice/:id/penerima", element: <PenerimaInvoice /> },
  { path: "/admin/keuangan/kwitansi", element: <Kwitansi /> },
  { path: "/admin/keuangan/kwitansi/:id_invoice", element: <KwitansiDetail /> },
  { path: "/admin/pettycash/serpong", element: <PettyCashSerpongPage /> },
  { path: "/admin/pettycash/bogor", element: <PettyCashBogorPage /> },
  {
    path: "/pettycash/serpong/:id/transaksi",
    element: <PettyCashTransaksiPage />,
  },
  {
    path: "/pettycash/bogor/:id/transaksi",
    element: <PettyCashTransaksiPage />,
  },
  // path="/pettycash/serpong/:id/transaksi" element={<PettyCashTransaksiPage />

  { path: "/admin/logout", element: <Logout /> }, // bisa diarahkan ke halaman login atau handle redirect
];

export default adminRoutes;
