/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xmd: "850px",
        xlg: "1150px",
        xxl: "1450px",
      },
    },
  },
  plugins: [],
};
