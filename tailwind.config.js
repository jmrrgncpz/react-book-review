module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#282C34',
        secondary: '#61dafb',
        success: '#2B8C1E',
        warning: '#B5A603',
        danger: '#931C16'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
