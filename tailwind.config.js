/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        darkblue: {
          DEFAULT: '#1E3A8A',
          light: '#3B5998',
          dark: '#162447',
        },
      },
    },
  },
  plugins: [],
}

