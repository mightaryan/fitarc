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
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          950: '#451a03',
        },
        obsidian: {
          950: '#07080b',
          900: '#0c0d12',
          850: '#11131a',
          800: '#161922',
          700: '#1e222e',
          600: '#272c3b',
        }
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        serif: ['Cinzel', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 35px -5px rgba(245, 158, 11, 0.35)',
        'gold-glow-lg': '0 0 60px -10px rgba(245, 158, 11, 0.45)',
        'gold-glow-sm': '0 0 15px -2px rgba(245, 158, 11, 0.25)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.08)',
        'gold-card': '0 10px 30px -10px rgba(0, 0, 0, 0.8), 0 0 1px 1px rgba(245, 158, 11, 0.2)',
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(circle at 50% 0%, rgba(245, 158, 11, 0.15), transparent 70%)',
        'radial-ambient': 'radial-gradient(circle at 80% 20%, rgba(217, 119, 6, 0.1), transparent 50%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.08), transparent 50%)',
        'gold-gradient': 'linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #b45309 100%)',
      },
    },
  },
  plugins: [],
}
