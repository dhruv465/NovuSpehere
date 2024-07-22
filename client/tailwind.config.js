/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-sans': ['"Noto Sans"', 'sans-serif'],
      },
      colors: {
        primary: '#007AFF',
        secondary: '#F2F2F7',
        tertiary: '#E6E5EB',
        header:'#F9F9F9',
        danger: '#FF0000'
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
      }
      
    },
  },
  plugins: [],
}
