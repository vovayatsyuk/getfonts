/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./fallback.html",
  ],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Cabinet Grotesk"', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}
