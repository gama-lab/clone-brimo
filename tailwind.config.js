/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bri: {
          blue: {
            DEFAULT: '#00529C',
            dark: '#003B73',
            light: '#0A73CE',
            vibrant: '#0066CC',
            sky: '#EBF4FC',
          },
          orange: {
            DEFAULT: '#F58220',
            hover: '#E06F10',
            light: '#FFF4E8',
          },
          dark: '#1E293B',
          gray: {
            50: '#F8FAFC',
            100: '#F1F5F9',
            200: '#E2E8F0',
            400: '#94A3B8',
            600: '#475569',
          }
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(0, 82, 156, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'floating': '0 10px 25px -5px rgba(0, 82, 156, 0.25)',
      }
    },
  },
  plugins: [],
}
