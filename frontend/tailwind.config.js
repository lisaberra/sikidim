/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pudra:   { 50: '#FFF5F6', 100: '#FFEAED', 200: '#FFD5DB', 300: '#F7C5CC', 400: '#E89EA7', 500: '#D4727F', 600: '#B8505D' },
        bebe:    { 50: '#F4F6FC', 100: '#E8EEFA', 200: '#D0DEF5', 300: '#C7CEEA', 400: '#9BAEE0', 500: '#628DC9', 600: '#3E68A8' },
        kahve:   { 50: '#FAF6F4', 100: '#F0E6E0', 200: '#E0CCC4', 300: '#D7CCC8', 400: '#8D6E63', 500: '#6D4C41', 600: '#5D4037' },
        suyesil: { 50: '#F0FBF6', 100: '#DFFAED', 200: '#C0F0D8', 300: '#B5EAD7', 400: '#72D4A8', 500: '#56B998', 600: '#3A9D7C' },
        cream:   '#FAF7F2',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 4px 20px -4px rgba(141,110,99,0.08)',
        'card': '0 8px 30px -6px rgba(141,110,99,0.12)',
        'glow': '0 0 24px -4px rgba(181,234,215,0.4)',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease-out forwards',
        'slide-up': 'slideUp 0.4s cubic-bezier(.4,0,.2,1) forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(.4,0,.2,1) forwards',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp:   { '0%': { opacity: 0, transform: 'translateY(12px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
        slideInRight: { '0%': { opacity: 0, transform: 'translateX(100%)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
