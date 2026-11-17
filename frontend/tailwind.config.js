/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f9',
          100: '#e1e9f2',
          200: '#c3d3e6',
          300: '#94b3d3',
          400: '#5e8ebd',
          500: '#386fa7',
          600: '#2b5889',
          700: '#24476e',
          800: '#1e3b5c',
          900: '#0f1d2e',
          950: '#0a1320',
        },
        brand: {
          blue: '#1e40af',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-purple': '0 0 20px -3px rgba(124, 58, 237, 0.25)',
        'glow-blue': '0 0 20px -3px rgba(59, 130, 246, 0.25)',
        'card-soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
