/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        current: 'currentColor',
        'dark-background': '#2E2836',
        gold: '#C29762',
      },
    },
  },
  plugins: [],
};
