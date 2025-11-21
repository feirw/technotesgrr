/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
    fontFamily: {
        arcade: ['ArcadeClassic', 'monospace'], // Χρησιμοποιήστε το 'ArcadeClassic'
      },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  darkMode: 'class',
};
