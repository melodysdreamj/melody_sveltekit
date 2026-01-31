/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  content: ['./src/**/*.{html,js,svelte,ts}'],

  plugins: [
    require('@tailwindcss/typography'),
  ],
}
