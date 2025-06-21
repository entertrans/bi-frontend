/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <== PENTING!
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite-react/**/*.js", // kalau pakai flowbite-react
    // kalau pakai flowbite biasa
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [
    require("flowbite/plugin"), // <- ini penting!
  ],
};
