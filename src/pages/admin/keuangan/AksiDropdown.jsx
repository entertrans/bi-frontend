import { useState, useEffect, useRef } from "react";
import {
  HiPencil,
  HiTrash,
  HiPrinter,
  HiCurrencyDollar,
  HiEye,
  HiDotsVertical,
} from "react-icons/hi";
import { fetchInvoicePenerima } from "../../../api/siswaAPI";

const AksiDropdown = ({
  siswa,
  invoice,
  totalBayar,
  setSiswaCetak,
  handleCetakLangsung,
  setBayarSiswa,
  setShowPanel,
  handleEditPotongan,
  handleHapusPenerima,
  handleLihatInvoice,
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setOpen((prev) => !prev);
  const closeDropdown = () => setOpen(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleCetak = async () => {
    try {
      const siswaData = await fetchInvoicePenerima(siswa.nis);

      const gabungan = {
        ...siswaData,
        invoice_id: invoice.id_invoice,
        invoice_deskripsi: invoice.deskripsi,
        invoice_tgl: invoice.tgl_invoice,
        invoice_jatuh_tempo: invoice.tgl_jatuh_tempo,
        totalBayar: totalBayar, // Pastikan ini masuk
      };

      console.log("🧾 Gabungan siswaCetak:", gabungan); // ⬅️ CEK DI SINI

      setSiswaCetak(gabungan);

      setTimeout(() => {
        handleCetakLangsung();
      }, 100);
    } catch (error) {
      console.error("Gagal mengambil data invoice:", error);
    } finally {
      closeDropdown();
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={toggleDropdown}
        type="button"
        className="inline-flex items-center p-2 text-sm font-medium text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        title="Aksi"
      >
        <HiDotsVertical className="w-5 h-5" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 z-20 mt-2 w-44 origin-top-right bg-white divide-y divide-gray-100 rounded-lg shadow-sm dark:bg-gray-700 dark:divide-gray-600">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            <DropdownItem
              onClick={() => {
                handleEditPotongan(siswa);
                closeDropdown();
              }}
              icon={<HiPencil />}
            >
              Edit
            </DropdownItem>

            <DropdownItem onClick={handleCetak} icon={<HiPrinter />}>
              Cetak
            </DropdownItem>

            <DropdownItem
              onClick={() => {
                setBayarSiswa({
                  ...siswa, // tetap kirim data siswa juga
                  invoice_deskripsi: invoice.deskripsi, // hanya tambah deskripsi jika cuma ini yang kamu perlu
                });
                setShowPanel(true);
                closeDropdown();
              }}
              icon={<HiCurrencyDollar />}
            >
              Bayar
            </DropdownItem>

            <DropdownItem
              onClick={() => {
                handleLihatInvoice(siswa);
                closeDropdown();
              }}
              icon={<HiEye />}
            >
              Lihat
            </DropdownItem>
          </ul>

          {/* Divider lalu Delete */}
          <div className="py-2">
            <DropdownItem
              onClick={() => {
                handleHapusPenerima(siswa);
                closeDropdown();
              }}
              icon={<HiTrash />}
              textColor="text-red-500 dark:text-red-400"
              hoverDanger
            >
              Delete
            </DropdownItem>
          </div>
        </div>
      )}
    </div>
  );
};

const DropdownItem = ({
  icon,
  onClick,
  children,
  textColor = "text-gray-400 dark:text-gray-400",
  hoverDanger = false,
}) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center gap-2 w-full px-4 py-2 text-left ${
        hoverDanger
          ? "hover:bg-red-50 dark:hover:bg-red-600 dark:hover:text-white"
          : "hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
      } ${textColor}`}
    >
      {icon}
      {children}
    </button>
  </li>
);

export default AksiDropdown;
