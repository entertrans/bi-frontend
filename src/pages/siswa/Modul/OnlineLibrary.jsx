import React, { useState } from "react";
import {
  HiX,
  HiSearch,
  HiAcademicCap,
  HiLibrary,
  HiBookOpen,
  HiArrowLeft,
  HiArrowRight,
  HiDownload
} from "react-icons/hi";


// Mock data - Buku Paket (Modul) berdasarkan kelas
const mockModul = [
  {
    id: 1,
    title: "Matematika Kelas 3",
    type: "modul",
    category: "Matematika",
    kelas: "Kelas 3",
    cover: "https://picsum.photos/200/300?random=1",
    pages: 20,
    author: "Tim Pengajar Matematika",
    description: "Modul pembelajaran matematika untuk kelas 3 SD",
    pdf: "https://drive.google.com/file/d/1c0kNG2o4eh3sHLFOVZY0ALVs_jjGyI2E/preview",
  },
  {
    id: 2,
    title: "IPA Kelas 4",
    type: "modul",
    category: "Ilmu Pengetahuan Alam",
    kelas: "Kelas 4",
    cover: "https://picsum.photos/200/300?random=4",
    pages: 18,
    author: "Tim Pengajar IPA",
    description: "Modul pembelajaran IPA untuk kelas 4 SD",
    pdf: "https://drive.google.com/file/d/1c0kNG2o4eh3sHLFOVZY0ALVs_jjGyI2E/preview",
  },
];

// Mock data - Perpustakaan Umum (bebas untuk semua)
const mockLibrary = [
  {
    id: 3,
    title: "Novel Si Anak Badai",
    type: "novel",
    category: "Fiksi",
    kelas: "Semua Kelas",
    cover: "https://picsum.photos/200/300?random=2",
    pages: 30,
    author: "Tere Liye",
    description: "Kisah petualangan seorang anak yang penuh semangat",
    pdf: "https://drive.google.com/file/d/1c0kNG2o4eh3sHLFOVZY0ALVs_jjGyI2E/preview",
  },
  {
    id: 4,
    title: "Ensiklopedia Hewan",
    type: "pengetahuan",
    category: "Ilmu Pengetahuan",
    kelas: "Semua Kelas",
    cover: "https://picsum.photos/200/300?random=3",
    pages: 22,
    author: "Tim Penulis Ilmiah",
    description: "Ensiklopedia lengkap tentang dunia hewan",
    pdf: "https://drive.google.com/file/d/1c0kNG2o4eh3sHLFOVZY0ALVs_jjGyI2E/preview",
  },
];

const BookCard = ({ book, onOpen }) => (
  <div className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col h-full cursor-pointer">
    <div className="relative mb-4 overflow-hidden rounded-lg">
      <img
        src={book.cover}
        alt={book.title}
        className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
        {book.pages} hlm
      </div>
      <div className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
        {book.kelas}
      </div>
    </div>

    <div className="flex-1 mb-4">
      <span className="text-xs font-medium text-blue-600 dark:text-blue-400 mb-2 block">
        {book.category}
      </span>
      <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
        {book.title}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        oleh {book.author}
      </p>
    </div>

    <button
      onClick={() => onOpen(book)}
      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2.5 rounded-lg font-medium transition-all duration-300 transform group-hover:scale-105 flex items-center justify-center"
    >
      <HiBookOpen className="w-4 h-4 mr-2" />
      Baca Sekarang
    </button>
  </div>
);

const PDFViewer = ({ book, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl w-full max-w-6xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 bg-gray-800 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-white font-semibold">{book.title}</h2>
              <p className="text-gray-400 text-sm">{book.author}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={book.pdf.replace('/preview', '/view')}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
              title="Buka di tab baru"
            >
              <HiDownload className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-gray-800 p-4">
          <div className="bg-white h-full rounded-lg overflow-hidden">
            <iframe
              src={book.pdf}
              className="w-full h-full border-none"
              title={book.title}
              loading="lazy"
              allow="autoplay"
            />
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-gray-800 rounded-b-xl">
          <p className="text-gray-400 text-sm text-center">
            Gunakan tombol panah pada viewer untuk navigasi halaman
          </p>
        </div>
      </div>
    </div>
  );
};

const OnlineLibrary = () => {
  const [tab, setTab] = useState("modul");
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userKelas] = useState("Kelas 5"); // Simulasi user kelas

  const filteredModul = mockModul.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLibrary = mockLibrary.filter(
    (book) =>
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentBooks = tab === "modul" ? filteredModul : filteredLibrary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            📚 Perpustakaan Digital
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Temukan buku paket untuk {userKelas} dan berbagai bacaan menarik
            dari perpustakaan umum sekolah
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari judul buku, penulis, atau kategori..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-0 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 p-1 rounded-xl shadow-lg inline-flex">
            <button
              onClick={() => setTab("modul")}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                tab === "modul"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <HiAcademicCap className="w-5 h-5 mr-2" />
              Buku Paket {userKelas}
            </button>
            <button
              onClick={() => setTab("library")}
              className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                tab === "library"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              <HiLibrary className="w-5 h-5 mr-2" />
              Perpustakaan Umum
            </button>
          </div>
        </div>

        {/* Content Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            {tab === "modul" ? `Buku Paket ${userKelas}` : "Koleksi Perpustakaan"}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 ml-2">
              ({currentBooks.length} buku)
            </span>
          </h2>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Hapus pencarian
            </button>
          )}
        </div>

        {/* Books Grid */}
        {currentBooks.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <HiSearch className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
              {searchQuery ? "Buku tidak ditemukan" : "Belum ada buku"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {searchQuery
                ? "Coba kata kunci lain atau lihat koleksi lainnya"
                : tab === "modul"
                ? `Buku paket untuk ${userKelas} akan segera tersedia`
                : "Koleksi perpustakaan sedang diperbarui"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {currentBooks.map((book) => (
              <BookCard key={book.id} book={book} onOpen={setSelectedBook} />
            ))}
          </div>
        )}

        {/* PDF Viewer Modal */}
        {selectedBook && (
          <PDFViewer
            book={selectedBook}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </div>
  );
};

export default OnlineLibrary;