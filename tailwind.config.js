/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      colors: {
        'glade-green': {
          '50': '#f5f8f5',
          '100': '#e8f0e8',
          '200': '#d1e1d1',
          '300': '#acc9ac',
          '400': '#82a880',
          '500': '#588157',
          '600': '#4a7049',
          '700': '#3c593c',
          '800': '#334833',
          '900': '#2b3c2b',
          '950': '#141f15',
        }
    },
    
  },
  plugins: [],
}}