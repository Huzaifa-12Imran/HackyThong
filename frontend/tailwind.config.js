/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#006c49",
        "primary-light": "#4edea3",
        "accent-green": "#00ff88",
        "accent-cyan": "#00d4ff",
        "accent-red": "#ff4466",
        "accent-amber": "#ffaa00",
        "bg-primary": "#0a0a0f",
        "bg-card": "#111118",
        border: "#222233",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 8px 2px #00d4ff44" },
          "50%": { boxShadow: "0 0 24px 6px #00d4ff88" },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        barGrow: {
          "0%": { width: "0%" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
      },
      animation: {
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.4s ease forwards",
        slideInRight: "slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        blink: "blink 1s step-end infinite",
      },
    },
  },
  plugins: [],
};