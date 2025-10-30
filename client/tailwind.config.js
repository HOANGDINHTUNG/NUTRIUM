const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gold: {
          DEFAULT: "#D4AF37",
          deep: "#B88A1B",
          soft: "#E8C971",
        },
        ink: { DEFAULT: "#0B0B0C" },
        ivory: { DEFAULT: "#F7F3E8" },
        champagne: "#EFE6D4",
        graphite: "#1C1C1E",
        success: "#0EA76C",
        warning: "#F0B429",
        danger: "#B9384F",
        info: "#355CFF",
      },
      boxShadow: {
        luxury: "0 10px 30px rgba(0,0,0,.45)",
        ringGold: "0 0 0 3px rgba(212,175,55,.35)",
      },
      backgroundImage: {
        goldSheen:
          "linear-gradient(135deg,#D4AF37 0%,#F5D27A 42%,#B88A1B 100%)",
        auroraDark:
          "radial-gradient(800px 500px at 85% 10%,rgba(212,175,55,.18),transparent 60%),radial-gradient(700px 400px at 10% 95%,rgba(14,167,108,.12),transparent 60%),linear-gradient(180deg,rgba(11,11,12,.0),rgba(11,11,12,.65) 65%,rgba(11,11,12,.88))",
      },
      keyframes: {
        "title-slide": {
          "0%": { transform: "translateY(35%)", opacity: "0" },
          "60%": { opacity: "1" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "card-float": {
          "0%": { transform: "translateY(8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "title-slide": "title-slide 0.7s ease-out both",
        "card-float": "card-float 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};
