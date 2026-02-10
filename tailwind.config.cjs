/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        // Light mode
        'contents-color': '#ffffff',
        'header-footer-color': '#f9fafb',
        'text-color': '#1f2937',
        'sub-title-color': '#374151',
        'brand-gray': '#6b7280',
        // Dark mode
        'dark-contents-color': '#111827',
        'dark-header-footer-color': '#1f2937',
        'dark-text-color': '#f3f4f6',
        'dark-sub-title-color': '#d1d5db',
        'dark-brand-gray': '#9ca3af',
      },
    },
  },
  content: ['./src/**/*.{html,js,svelte,ts}'],

  plugins: [
    require('@tailwindcss/typography'),
  ],
}
