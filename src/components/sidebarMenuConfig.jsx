// src/components/sidebar/sidebarMenuConfig.js
import {
  FaTachometerAlt,
  FaCalendarAlt,
  FaUniversity,
  FaSatelliteDish,
  FaUserTie,
  FaUsers,
  FaSignOutAlt,
  FaBook,
  FaMoneyBillWave,
  FaClipboardList,
  FaChartBar,
  FaLaptopCode,
  FaPenAlt,
} from "react-icons/fa";

export const menuConfig = {
  admin: [
    {
      label: "Dashboard",
      icon: <FaTachometerAlt className="mr-3" />,
      path: "/admin",
    },
    {
      label: "Kalender",
      icon: <FaCalendarAlt className="mr-3" />,
      path: "/admin/kalender",
    },
    {
      label: "Lembaga",
      icon: <FaUniversity className="mr-3" />,
      path: "/admin/lembaga",
    },
    {
      label: "Data Satelit",
      icon: <FaSatelliteDish className="mr-3" />,
      path: "/admin/data-satelit",
    },
    {
      label: "Pegawai",
      icon: <FaUserTie className="mr-3" />,
      path: "/admin/pegawai",
    },
    {
      label: "Kesiswaan",
      icon: <FaUsers className="mr-3" />,
      children: [
        {
          label: "PPDB",
          path: "/admin/siswa/ppdb",
        },
        {
          label: "Siswa Aktif",
          path: "/admin/siswa/aktif",
        },
        {
          label: "Siswa Alumni",
          path: "/admin/siswa/alumni",
        },
        {
          label: "Siswa Keluar",
          path: "/admin/siswa/keluar",
        },
      ],
    },
    {
      label: "E-Raport",
      icon: <FaClipboardList className="mr-3" />,
      path: "/admin/eraport",
    },
    {
      label: "Kisi-Kisi",
      icon: <FaBook className="mr-3" />,
      path: "/admin/kisi-kisi",
    },
    {
      label: "Keuangan",
      icon: <FaMoneyBillWave className="mr-3" />,
      children: [
        {
          label: "Tagihan",
          path: "/admin/keuangan/tagihan",
        },
        {
          label: "Invoice",
          path: "/admin/keuangan/invoice",
        },
        {
          label: "Kwitansi",
          path: "/admin/keuangan/kwitansi",
        },
      ],
    },
    {
      label: "Petty Cash",
      icon: <FaMoneyBillWave className="mr-3" />,
      children: [
        {
          label: "Serpong",
          path: "/admin/pettycash/serpong",
        },
        {
          label: "Bogor",
          path: "/admin/pettycash/bogor",
        },
      ],
    },
    {
      label: "Logout",
      icon: <FaSignOutAlt className="mr-3 text-red-500" />,
      path: "/admin/logout",
    },
  ],

  guru: [
    {
      label: "Dashboard",
      icon: <FaTachometerAlt className="mr-3" />,
      path: "/guru",
    },
    {
      label: "Course",
      icon: <FaBook className="mr-3" />,
      path: "/guru/course",
    },
    {
      label: "Nilai",
      icon: <FaChartBar className="mr-3" />,
      path: "/guru/nilai",
    },
    {
      label: "Kisi-Kisi",
      icon: <FaClipboardList className="mr-3" />,
      path: "/guru/kisi-kisi",
    },
    {
      label: "Test Online",
      icon: <FaLaptopCode className="mr-3" />,
      path: "/guru/test-online",
    },
    {
      label: "Ulangan",
      icon: <FaPenAlt className="mr-3" />,
      path: "/guru/ulangan",
    },
    {
      label: "Absensi",
      icon: <FaUsers className="mr-3" />,
      children: [
        { label: "Input Absensi", path: "/guru/absensi/input" },
        { label: "Rekap Absensi", path: "/guru/absensi/rekap" },
      ],
    },
    {
      label: "Logout",
      icon: <FaSignOutAlt className="mr-3 text-red-500" />,
      path: "/guru/logout",
    },
  ],
};
