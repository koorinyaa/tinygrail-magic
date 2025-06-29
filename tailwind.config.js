/** @type {import('tailwindcss').Config} */
const {heroui} = require("@heroui/react");
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};
