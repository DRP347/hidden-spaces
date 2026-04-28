import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: "#F7F1E6",
        coconut: "#FFFDF7",
        sand: "#E2D2B8",
        ink: "#16202A",
        charcoal: "#25313D",
        mist: "#6E7B86",
        seaglass: "#6FA6A1",
        teal: "#247B75",
        clay: "#B96F4A",
        ochre: "#C79A52",
        olive: "#8FA382",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["Geist", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass:
          "0 24px 80px rgba(0, 0, 0, 0.38), inset 0 1px 0 rgba(255, 255, 255, 0.13)",
        "glass-soft":
          "0 16px 45px rgba(0, 0, 0, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
    },
  },
  plugins: [],
};

export default config;
