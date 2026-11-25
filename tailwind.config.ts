import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        coal: "#333333",
        cream: "#F7F7F5",
        sand: "#B69A72",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Arial", "sans-serif"],
      },
      letterSpacing: {
        brand: "0.28em",
        wide2: "0.18em",
      },
      maxWidth: {
        site: "1440px",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.7s ease-out both",
        fadeIn: "fadeIn 0.6s ease-out both",
        slideIn: "slideIn 0.35s cubic-bezier(0.22,1,0.36,1) both",
        marquee: "marquee 26s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
