/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'kirby': {
          '50': '#fbf8fc',
          '100': '#f5eff8',
          '200': '#ede2f2',
          '300': '#decbe7',
          '400': '#c19fd1',
          '500': '#b288c4',
          '600': '#9c6db0',
          '700': '#865898',
          '800': '#704c7d',
          '900': '#5b3e65',
          '950': '#3e2447',
        },

      }
    },
  },
  plugins: [],
}

