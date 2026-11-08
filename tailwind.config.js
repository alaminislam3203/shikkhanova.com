/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme derived directly from logo.png:
        brand: {
          50: '#F0F5FF',
          100: '#E0EBFF',
          200: '#C2D9FF',
          300: '#94BCFF',
          400: '#5494FF',
          500: '#1D63D8',
          600: '#0C4CB8',
          700: '#003893', // Exact 'Shikkha' Royal Navy Blue
          800: '#082C6D',
          900: '#041A42',
          950: '#020D24',
        },
        nova: {
          50: '#FFF8F0',
          100: '#FFEDD9',
          200: '#FEDAB2',
          300: '#FDBB7B',
          400: '#FA963A',
          500: '#FF7300', // Exact 'Nova' Warm Energy Orange
          600: '#EA580C',
          700: '#C2410C',
          800: '#9A3412',
          900: '#7C2D12',
          950: '#431407',
        },
        slogan: {
          50: '#FFF1F4',
          100: '#FFE4E8',
          500: '#F43F5E',
          600: '#E11D48', // Exact "শিখবো, জিতবো" Slogan Crimson Red
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },
        bkash: '#E2136E',
        nagad: '#F7941D',
      },
      fontFamily: {
        sans: ['"Hind Siliguri"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brand': '0 10px 30px -5px rgba(0, 56, 147, 0.25)',
        'nova': '0 10px 30px -5px rgba(255, 115, 0, 0.25)',
        'premium': '0 20px 40px -15px rgba(0, 56, 147, 0.12), 0 0 1px 1px rgba(0, 56, 147, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
