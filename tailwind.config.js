/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sandstone: {
          50:  '#fdf6ee',
          100: '#f9e9d5',
          200: '#f2d0a8',
          300: '#e9b276',
          400: '#df9045',
          500: '#d97427',
          600: '#ca5c1d',
          700: '#a8441a',
          800: '#87371c',
          900: '#6e2f19',
        },
        desert: {
          900: '#1a1209',
          800: '#2c1f0d',
          700: '#3d2c12',
          600: '#533c1a',
          500: '#6e5023',
        },
        jordan: {
          black: '#000000',
          white: '#FFFFFF',
          red:   '#CE1126',
          green: '#007A3D',
          star:  '#FFFFFF',
        },
      },
      fontFamily: {
        serif:      ['Georgia', 'Cambria', '"Times New Roman"', 'Times', 'serif'],
        sans:       ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display:    ['"Playfair Display"', 'Georgia', 'serif'],
        cinematic:  ['"Cormorant Garamond"', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 1s ease-out forwards',
        'fade-in':    'fadeIn 1.2s ease-out forwards',
        shimmer:      'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
