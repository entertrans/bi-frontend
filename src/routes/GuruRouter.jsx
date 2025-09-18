import Home from "../pages/guru/Home";
import Course from "../pages/guru/Course";
import KisiKisi from "../pages/guru/kisikisi/GuruKisiKisi";
import TestOnline from "../pages/guru/testonline/TestOnline";
import Ulangan from "../pages/guru/Ulangan";
import Logout from "../pages/guru/Logout";
import BankSoalRekap from "../pages/guru/banksoal/BankSoalRekap";
import BankSoalTrash from "../pages/guru/banksoal/BankSoalTrash";
import DetailBankSoal from "../pages/guru/banksoal/DetailBankSoal";
import UlanganBulanan from "../pages/guru/testonline/ub/UlanganBulanan";
import TestReview from "../pages/guru/testonline/tr/TestReview";
import TugasList from "../pages/guru/testonline/tugas/TugasList";
import Penilaian from "../pages/guru/testonline/penilaian/Penilaian";
import DaftarSiswa from "../pages/guru/testonline/daftarsiswa/DaftarSiswa";
import JawabanPage from "../pages/guru/testonline/daftarsiswa/JawabanPage";
import DetailJawabanPage from "../pages/guru/testonline/daftarsiswa/DetailJawabanPage";
import RekapNilai from "../pages/guru/nilai/RekapNilai";
import DetailTest from "../pages/guru/nilai/DetailTest";
import DetailPesertaTest from "../pages/guru/nilai/DetailPesertaTest";

export const guruRoutes = [
  { path: "/guru", element: <Home /> },
  { path: "/guru/course", element: <Course /> },
  { path: "/guru/nilai", element: <RekapNilai /> },
  { path: "/guru/kisi-kisi", element: <KisiKisi /> },
  { path: "/guru/test-online", element: <TestOnline /> },
  { path: "/guru/banksoal/trash", element: <BankSoalTrash /> },
  { path: "/guru/banksoal/rekap", element: <BankSoalRekap /> },
  {
    path: "/guru/banksoal/detail/:kelas/:mapel",
    element: <DetailBankSoal />,
  },
  // { path: "/guru/bank-soal-aktif", element: <BankSoal /> },
  { path: "/guru/siswa", element: <DaftarSiswa /> },
  { path: "/guru/test-online/UB", element: <UlanganBulanan /> },
  { path: "/guru/test-online/TR", element: <TestReview /> },
  { path: "/guru/test-online/tugas", element: <TugasList /> },
  { path: "/guru/test-online/penilaian", element: <Penilaian /> },
  { path: "/guru/jawaban/siswa/:siswa_nis", element: <JawabanPage /> },
  {
    path: "/guru/jawaban/siswa/detail/:session_id",
    element: <DetailJawabanPage />,
  },
  { path: "/guru/ulangan", element: <Ulangan /> },
  { path: "/guru/nilai/:type/:kelas_id/:mapel_id", element: <DetailTest /> },
  { path: "/guru/nilai/:type/peserta/:test_id/:kelas_id", element: <DetailPesertaTest /> },
//   <Route path="/guru/nilai/:type/:kelas_id/:mapel_id" element={<DetailTest />} />
// <Route path="/guru/nilai/:type/peserta/:test_id/:kelas_id" element={<DetailPesertaTest />} />
  { path: "/guru/logout", element: <Logout /> },
];

export default guruRoutes;
