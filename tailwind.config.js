//sales_router_frontend/tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      colors: {
        brand: {
          primary: "#2563EB",
          secondary: "#1E40AF",
          soft: "#E8F0FF",     // azul suave premium
          dark: "#123A82",
          light: "#E8F0FF",
        },
        neutral: {
          bg: "#F5F7FA",
          soft: "#EDF0F4",
          border: "#E2E6EE",
        },
        gray: {
          10: "#F8FAFC",
          20: "#F1F5F9",
          30: "#E2E8F0",
          40: "#CBD5E1",
          50: "#94A3B8",
          60: "#64748B",
        },
      },

      borderRadius: {
        xl: "14px",
        "2xl": "18px",
      },
      spacing: {
        layout: "2rem",
      },
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};


