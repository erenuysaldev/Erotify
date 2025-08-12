/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Spotify benzeri yeşil tonları
        spotify: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#1db954', // Ana Spotify yeşili
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        // Karanlık tema renkleri
        dark: {
          50: '#18181b',   // En koyu - arkaplan
          100: '#1e1e1e',  // Sidebar arkaplan
          200: '#121212',  // Ana arkaplan
          300: '#242424',  // Kartlar
          400: '#2a2a2a',  // Hover durumları
          500: '#404040',  // Sınırlar
          600: '#535353',  // İkincil metin
          700: '#b3b3b3',  // Ana metin
          800: '#ffffff',  // Beyaz metin
        },
        // Gri tonları (Spotify tarzı)
        gray: {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
