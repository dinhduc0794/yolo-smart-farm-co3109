/** @type {import('tailwindcss').Config} */

const colors = {
  themecolor1: '#B7E0FF',
  themecolor2: '#3A6D8C',
  themecolor3: '#2D5E82',
  themecolor4: '#001F3F',
};


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: colors,
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}