/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
      },
      screens: {
        xmd: "850px",
        xlg: "1150px",
        xxl: "1450px",
      },
      animation: {
        "intro-fadein": "introFadeIn 200ms ease-in",
        "intro-fadeout": "introFadeOut 200ms ease-out",
        "card-fadein": "cardFadeIn 200ms ease-in",
        "card-fadeout": "cardFadeOut 200ms ease-out",
      },
      keyframes: {
        introFadeIn: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        introFadeOut: {
          "0%": { opacity: "1", transform: "translateY(0)" },
          "100%": { opacity: "0", transform: "translateY(16px)" },
        },
        cardFadeIn: {
          "0%": { opacity: "0", transform: "translateY(-16px) scale(0.95)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        cardFadeOut: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-16px) scale(0.95)" },
        },
      },
    },
  },
  plugins: [],
};
