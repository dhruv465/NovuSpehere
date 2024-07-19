/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        primary: '#7159E2',
        secondary: '#25BDD3',
        danger: '#FF0000'
      }
    },
  },
  plugins: [],
}

