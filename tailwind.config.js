/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          light: '#FCFBF7',
          DEFAULT: '#F9F6EE',
          dark: '#EFECE1',
        },
        gold: {
          light: '#F3ECE0',
          DEFAULT: '#D4AF37',
          dark: '#8C6D3E',
          accent: '#C5A880',
        },
        charcoal: {
          light: '#4A4846',
          DEFAULT: '#2C2A29',
          dark: '#1A1817',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        cursive: ['Great Vibes', 'cursive'],
        sans: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
