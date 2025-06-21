import React from "react";

const SiswaProfileCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
      <div className="max-w-5xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* 👤 Avatar + Info */}
        <div className="flex items-center space-x-4">
          <img
            src="https://i.pravatar.cc/100?u=default"
            alt="Avatar"
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Aaron Amaziah Ferly Polii
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Kelas X IPA
            </p>
          </div>
        </div>

        {/* 🏫 Logo */}
        <img
          src="https://bi.anakpanah.site/assets/images/mylogo.png"
          alt="Logo Sekolah"
          className="h-16 hidden md:block"
        />
      </div>
    </div>
  );
};

export default SiswaProfileCard;
