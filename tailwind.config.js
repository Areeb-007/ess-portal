/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        tmc: {
          50:  '#f2f9ec',
          100: '#e0f1d0',
          200: '#c3e4a4',
          300: '#9dd16e',
          400: '#7dbd42',
          500: '#6ab04c',
          600: '#4d8a2e',
          700: '#3c6d23',
          800: '#305620',
          900: '#294821',
        },
        sidebar: '#1a2744',
      },
    },
  },
  plugins: [],
}
