/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    './src/**/*.{html,ts}',
    './libs/**/*.{html,ts}', // ← THIS must be here
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
