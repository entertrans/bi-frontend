// src/utils/CardStyles.js
export const cardStyles = {
  // Base card style
  base: "rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 flex flex-col justify-between border-l-4",
  
  // Color variants
  blue: {
    container: "bg-blue-50 dark:bg-blue-900/20 border-blue-500",
    badge: "bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200",
    icon: "🔵",
    button: "bg-blue-600 hover:bg-blue-700 text-white"
  },
  green: {
    container: "bg-green-50 dark:bg-green-900/20 border-green-500",
    badge: "bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200",
    icon: "🟢",
    button: "bg-green-600 hover:bg-green-700 text-white"
  },
  orange: {
    container: "bg-orange-50 dark:bg-orange-900/20 border-orange-500",
    badge: "bg-orange-100 dark:bg-orange-800 text-orange-800 dark:text-orange-200",
    icon: "🟠",
    button: "bg-orange-600 hover:bg-orange-700 text-white"
  },
  purple: {
    container: "bg-purple-50 dark:bg-purple-900/20 border-purple-500",
    badge: "bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200",
    icon: "🟣",
    button: "bg-purple-600 hover:bg-purple-700 text-white"
  },
  red: {
    container: "bg-red-50 dark:bg-red-900/20 border-red-500",
    badge: "bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200",
    icon: "🔴",
    button: "bg-red-600 hover:bg-red-700 text-white"
  },
  gray: {
    container: "bg-gray-50 dark:bg-gray-900 border-gray-400",
    badge: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
    icon: "⚪",
    button: "bg-gray-600 hover:bg-gray-700 text-white"
  }
};

// Test type mapping
export const testTypeConfig = {
  tr: {
    color: "orange",
    icon: "📚",
    type: "Test Review"
  },
  tugas: {
    color: "blue", 
    icon: "📝",
    type: "Tugas"
  },
  default: {
    color: "purple",
    icon: "📄",
    type: "Test"
  }
};

// Status mapping untuk kelas online
export const statusConfig = {
  sedang: {
    color: "green",
    icon: "🟢",
    text: "Sedang Berlangsung"
  },
  belum: {
    color: "blue",
    icon: "⏰", 
    text: "Belum Dimulai"
  },
  selesai: {
    color: "gray",
    icon: "✅",
    text: "Selesai"
  }
};

// Filter button styles
export const filterButtonStyles = {
  base: "px-4 py-2 rounded-lg font-medium transition-colors",
  active: {
    semua: "bg-indigo-600 text-white",
    sedang: "bg-green-600 text-white",
    belum: "bg-blue-600 text-white", 
    selesai: "bg-gray-600 text-white"
  },
  inactive: "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
};