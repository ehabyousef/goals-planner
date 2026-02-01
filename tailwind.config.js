/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
    './libs/**/*.{html,ts}', // ← THIS must be here
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
