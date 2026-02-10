/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7fa',
          100: '#e8edf2',
          200: '#d1dbe5',
          300: '#a8b8ca',
          400: '#7a8fa8',
          500: '#5a6f8a',
          600: '#475872',
          700: '#3c4859',
          800: '#343d4a',
          900: '#2e353f',
        },
        accent: {
          50: '#f0f9f4',
          100: '#dcf2e5',
          200: '#bce5cd',
          300: '#8fd1ad',
          400: '#5ab588',
          500: '#369a6a',
          600: '#277d55',
          700: '#216447',
          800: '#1d503a',
          900: '#194231',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-sm': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'soft-lg': '0 10px 30px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
}
