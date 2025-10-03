// Fungsi untuk warna baris bergantian
export const getRowColor = (index) => {
  const colors = [
    "bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20",
    "bg-purple-50 dark:bg-purple-900/10 hover:bg-purple-100 dark:hover:bg-purple-900/20",
    "bg-green-50 dark:bg-green-900/10 hover:bg-green-100 dark:hover:bg-green-900/20",
    "bg-orange-50 dark:bg-orange-900/10 hover:bg-orange-100 dark:hover:bg-orange-900/20"
  ];
  return colors[index % colors.length];
};

// Fungsi untuk mendapatkan pagination numbers
export const getPaginationNumbers = (currentPage, totalPages, maxVisiblePages = 5) => {
  const pages = [];

  if (totalPages <= maxVisiblePages + 2) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

    if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
      endPage = maxVisiblePages + 1;
    }

    if (currentPage >= totalPages - Math.floor(maxVisiblePages / 2)) {
      startPage = totalPages - maxVisiblePages;
    }

    if (startPage > 2) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      if (i > 1 && i < totalPages) {
        pages.push(i);
      }
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);
  }

  return pages;
};