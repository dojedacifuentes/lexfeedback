/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          50:  '#eef3fa',
          100: '#d6e3f2',
          200: '#b0c9e8',
          300: '#7da9d8',
          400: '#4d87c4',
          500: '#2d6aad',
          600: '#1e3a5f',
          700: '#17314f',
          800: '#122640',
          900: '#0d1c30',
        },
        graphite: {
          50:  '#f6f7f9',
          100: '#eceef2',
          200: '#d4d8e0',
          300: '#b0b8c6',
          400: '#8591a4',
          500: '#626f82',
          600: '#4d5a6b',
          700: '#3d4857',
          800: '#2e3743',
          900: '#1e2530',
        },
        burgundy: {
          50:  '#fdf2f4',
          100: '#fce4e9',
          200: '#f9c5ce',
          300: '#f498aa',
          400: '#ec6278',
          500: '#df3350',
          600: '#8b1a2f',
          700: '#721628',
          800: '#5a1020',
          900: '#3f0b17',
        },
        ivory: '#f8f7f4',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.07), 0 4px 12px 0 rgba(0,0,0,0.05)',
        'card-hover': '0 4px 12px 0 rgba(0,0,0,0.1), 0 8px 24px 0 rgba(0,0,0,0.07)',
      },
    },
  },
  plugins: [],
}
