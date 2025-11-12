/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', 'sans-serif'], // Lato
        serif: ['var(--font-serif)', 'serif'], // DM Serif Display
        display: ['var(--font-serif)', 'serif'], // DM Serif Display (alias)
      },
      fontWeight: {
        normal: '400',
        bold: '700',
        black: '900', // Lato Black for "BOLD" text
      },
      colors: {
        // Brand colors from branding guide
        'bold-black': '#1A1A1A',
        'deep-earth-brown': '#3D2817',
        'fresh-sprout-green': '#7CB342',
        'meadow-green': '#A8D08D',
        'cream': '#F5F1E8',
        'honey-gold': '#E8C547',
        'sky-blue': '#5B9BD5',
        // Legacy orange support (keeping for backwards compatibility)
        'farm-orange': {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#fbbf24',
          400: '#f59e0b',
          500: '#d97706',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#78350f',
        },
      },
      backgroundImage: {
        'gradient-growth': 'linear-gradient(135deg, #7CB342 0%, #A8D08D 100%)',
        'gradient-earth-to-light': 'linear-gradient(135deg, #3D2817 0%, #F5F1E8 100%)',
        'gradient-golden-hour': 'linear-gradient(135deg, #E8C547 0%, #F5F1E8 100%)',
        'gradient-atmospheric': 'linear-gradient(135deg, #5B9BD5 0%, #A8D08D 50%, #E8C547 100%)',
        'gradient-seasonal': 'linear-gradient(135deg, #7CB342 0%, #E8C547 50%, #5B9BD5 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
