import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff4ed",
          100: "#ffe4d4",
          200: "#ffc9a8",
          500: "#f26522",
          600: "#e04f0f",
          700: "#c7440d",
          800: "#9e3610"
        },
        ink: "#1a1a2e",
        muted: "#5c6b7a",
        surface: "#f5f6f8"
      },
      boxShadow: {
        soft: "0 4px 20px rgba(26, 26, 46, 0.08)",
        card: "0 2px 12px rgba(26, 26, 46, 0.06)"
      },
      backgroundImage: {
        hero: "linear-gradient(135deg, #fff4ed 0%, #ffffff 45%, #f0f7ff 100%)"
      }
    }
  },
  plugins: []
};

export default config;
