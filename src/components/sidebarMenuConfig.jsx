// src/components/sidebar/sidebarMenuConfig.js
import {
  HiHome,
  HiCalendar,
  HiAcademicCap,
  HiCloud,
  HiUser,
  HiUserGroup,
  HiBookOpen,
  HiChartBar,
  HiComputerDesktop,
  HiArchiveBox,
  HiArrowPath,
  HiCurrencyDollar,
  HiClipboardDocumentList,
  HiTableCells,
  HiPencil,
  HiArrowLeftOnRectangle,
  HiPower,
} from "react-icons/hi2";

export const menuConfig = {
  admin: [
    {
      label: "Dashboard",
      icon: <HiHome className="mr-3" />,
      path: "/admin",
      key: "admin-dashboard",
    },
    {
      label: "Kalender",
      icon: <HiCalendar className="mr-3" />,
      path: "/admin/kalender",
      key: "admin-kalender",
    },
    {
      label: "Lembaga",
      icon: <HiAcademicCap className="mr-3" />,
      path: "/admin/lembaga",
      key: "admin-lembaga",
    },
    {
      label: "Data Satelit",
      icon: <HiCloud className="mr-3" />,
      path: "/admin/data-satelit",
      key: "admin-data-satelit",
    },
    {
      label: "Pegawai",
      icon: <HiUser className="mr-3" />,
      path: "/admin/pegawai",
      key: "admin-pegawai",
    },
    {
      label: "Kesiswaan",
      icon: <HiUserGroup className="mr-3" />,
      key: "admin-kesiswaan",
      children: [
        {
          label: "PPDB",
          path: "/admin/siswa/ppdb",
          key: "admin-ppdb",
        },
        {
          label: "Siswa Aktif",
          path: "/admin/siswa/aktif",
          key: "admin-siswa-aktif",
        },
        {
          label: "Siswa Alumni",
          path: "/admin/siswa/alumni",
          key: "admin-siswa-alumni",
        },
        {
          label: "Siswa Keluar",
          path: "/admin/siswa/keluar",
          key: "admin-siswa-keluar",
        },
      ],
    },
    {
      label: "E-Raport",
      icon: <HiClipboardDocumentList className="mr-3" />,
      path: "/admin/eraport",
      key: "admin-eraport",
    },
    {
      label: "Kisi-Kisi",
      icon: <HiTableCells className="mr-3" />,
      path: "/admin/kisi-kisi",
      key: "admin-kisi-kisi",
    },
    {
      label: "Keuangan",
      icon: <HiCurrencyDollar className="mr-3" />,
      key: "admin-keuangan",
      children: [
        {
          label: "Tagihan",
          path: "/admin/keuangan/tagihan",
          key: "admin-tagihan",
        },
        {
          label: "Invoice",
          path: "/admin/keuangan/invoice",
          key: "admin-invoice",
        },
        {
          label: "Kwitansi",
          path: "/admin/keuangan/kwitansi",
          key: "admin-kwitansi",
        },
      ],
    },
    {
      label: "Petty Cash",
      icon: <HiCurrencyDollar className="mr-3" />,
      key: "admin-pettycash",
      children: [
        {
          label: "Serpong",
          path: "/admin/pettycash/serpong",
          key: "admin-pettycash-serpong",
        },
        {
          label: "Bogor",
          path: "/admin/pettycash/bogor",
          key: "admin-pettycash-bogor",
        },
      ],
    },
    {
      label: "Logout",
      icon: <HiArrowLeftOnRectangle className="mr-3 text-red-500" />,
      path: "/logout",
      key: "admin-logout",
    },
  ],

  guru: [
    {
      label: "Dashboard",
      icon: <HiHome className="mr-3" />,
      path: "/guru",
      key: "guru-dashboard",
    },
    {
      label: "Course",
      icon: <HiBookOpen className="mr-3" />,
      path: "/guru/course",
      key: "guru-course",
    },
    {
      label: "Kelas Online",
      icon: <HiComputerDesktop className="mr-3" />,
      path: "/guru/online",
      key: "guru-kelas-online",
    },
    {
      label: "Absensi",
      icon: <HiClipboardDocumentList className="mr-3" />,
      key: "absensi",
      children: [
        {
          label: "Kelas Online",
          path: "#",
          key: "guru-absensi-online",
        },
        {
          label: "Kelas Ofline",
          path: "#",
          key: "guru-absensi-ofline",
        },
      ],
    },
    {
      label: "Nilai",
      icon: <HiChartBar className="mr-3" />,
      path: "/guru/nilai",
      key: "guru-nilai",
    },
    {
      label: "Kisi-Kisi",
      icon: <HiTableCells className="mr-3" />,
      path: "/guru/kisi-kisi",
      key: "guru-kisi-kisi",
    },
    {
      label: "Bank Soal",
      icon: <HiArchiveBox className="mr-3" />,
      key: "guru-bank-soal",
      children: [
        {
          label: "Aktif",
          path: "/guru/banksoal/rekap",
          key: "guru-banksoal-aktif",
        },
        {
          label: "Trash",
          path: "/guru/banksoal/trash",
          key: "guru-banksoal-trash",
        },
      ],
    },
    {
      label: "Test Online",
      icon: <HiPencil className="mr-3" />,
      key: "guru-test-online",
      children: [
        {
          label: "Ulangan Bulanan",
          path: "/guru/test-online/UB",
          key: "guru-test-ub",
        },
        {
          label: "Test Review",
          path: "/guru/test-online/TR",
          key: "guru-test-review",
        },
        {
          label: "Tugas",
          path: "/guru/test-online/tugas",
          key: "guru-tugas",
        },
        {
          label: "Daftar Siswa",
          path: "/guru/siswa",
          key: "guru-siswa",
        },
      ],
    },
    {
      label: "Roll Back TO",
      icon: <HiArrowPath className="mr-3" />,
      key: "rb-test-online",
      children: [
        {
          label: "Daftar Siswa",
          path: "/guru/rb/siswa",
          key: "rb-siswa",
        },
        {
          label: "Reset Data",
          path: "/guru/rb/resetdata",
          key: "rb-data",
        },
      ],
    },
    {
      label: "Logout",
      icon: <HiArrowLeftOnRectangle className="mr-3 text-red-500" />,
      path: "/logout",
      key: "guru-logout",
    },
  ],
};