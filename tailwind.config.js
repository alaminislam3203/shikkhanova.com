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
        // UCC Group (uccgroup.com.bd) Inspired Academic Navy & Signature Crimson Red Theme:
        brand: {
          50: '#F0F4FA',
          100: '#DCE6F5',
          200: '#BDD0EB',
          300: '#8FAEDF',
          400: '#5B87CE',
          500: '#2E62B8',
          600: '#1B4996',
          700: '#0F2C59', // UCC Academic Deep Navy Blue
          800: '#0A1E3C',
          900: '#061428',
          950: '#030B17',
        },
        nova: {
          50: '#FEF2F3',
          100: '#FDE3E6',
          200: '#FBCBD1',
          300: '#F7A1AC',
          400: '#F06A7C',
          500: '#D32F2F', // UCC Signature Crimson Red
          600: '#C8102E', // UCC Primary Corporate Red
          700: '#A50D26',
          800: '#880E22',
          900: '#721020',
          950: '#40040D',
        },
        slogan: {
          50: '#FEF2F3',
          100: '#FDE3E6',
          500: '#E11D48',
          600: '#C8102E', // UCC Crimson Red
          700: '#A50D26',
          800: '#880E22',
          900: '#721020',
          950: '#40040D',
        },
        bkash: '#E2136E',
        nagad: '#F7941D',
      },
      fontFamily: {
        sans: [
          'var(--font-exo2)',
          'var(--font-hind-siliguri)',
          'system-ui',
          'sans-serif',
        ],
        bn: [
          'var(--font-hind-siliguri)',
          'sans-serif',
        ],
        en: [
          'var(--font-exo2)',
          'sans-serif',
        ],
        mono: [
          'var(--font-exo2)',
          'monospace',
        ],
      },
      boxShadow: {
        'brand': '0 10px 28px -6px rgba(15, 44, 89, 0.25)',
        'nova': '0 10px 28px -6px rgba(200, 16, 46, 0.28)',
        'premium': '0 18px 38px -12px rgba(10, 30, 60, 0.12), 0 0 1px 1px rgba(10, 30, 60, 0.06)',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
