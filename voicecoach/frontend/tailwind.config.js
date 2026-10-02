/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          900: '#1e1b4b',
        },
      },
      boxShadow: {
        soft: '0 20px 45px -20px rgba(79,70,229,0.35)',
      },
    },
  },
  plugins: [],
}
