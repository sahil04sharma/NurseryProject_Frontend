/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // update paths to your files
  ],
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',  // 1440px
        '9xl': '120rem', // 1920px
        '10xl': '160rem', // 2560px
      },
    },
  },
  plugins: [],
};
