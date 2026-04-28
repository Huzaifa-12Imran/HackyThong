/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b5bdb",
        "primary-dark": "#3451c7",
        "primary-bright": "#4c6ef5",
        "accent-purple": "#3b5bdb",
        "accent-purple-bright": "#4c6ef5",
        "accent-cyan": "#0c8599",
        "accent-cyan-bright": "#1098ad",
        "accent-red": "#c92a2a",
        "accent-amber": "#e67700",
        "accent-green": "#2f9e44",
        "accent-green-bright": "#37b24d",
        "bg-base": "#f8f9fa",
        "bg-secondary": "#ffffff",
        "bg-card": "#ffffff",
        "bg-card-hover": "#f1f5f9",
        "bg-sidebar": "#ffffff",
        "text-primary": "#1a1b1e",
        "text-secondary": "#495057",
        "text-muted": "#868e96",
        "border-dark": "#dee2e6",
        "border-bright": "#ced4da",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        pulse_glow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        fadeInUp: {
          "0%": { opacity: 0, transform: "translateY(14px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)", opacity: 0 },
          "100%": { transform: "translateX(0)", opacity: 1 },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        barGrow: {
          "0%": { width: "0%" },
        },
        spin_slow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        pulse_glow: "pulse_glow 2s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.4s ease forwards",
        slideInRight: "slideInRight 0.38s cubic-bezier(0.16,1,0.3,1) forwards",
        blink: "blink 1s step-end infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 3s ease-in-out infinite",
        spin_slow: "spin_slow 2s linear infinite",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-green-cyan": "linear-gradient(135deg, #3b5bdb 0%, #4c6ef5 100%)",
        "gradient-purple-cyan": "linear-gradient(135deg, #3b5bdb 0%, #0c8599 100%)",
      },
      boxShadow: {
        "glow-green":  "0 0 0 3px rgba(47,158,68,0.15)",
        "glow-purple": "0 0 0 3px rgba(59,91,219,0.15)",
        "glow-cyan":   "0 0 0 3px rgba(12,133,153,0.15)",
        "glow-amber":  "0 0 0 3px rgba(230,119,0,0.15)",
        "card-dark":   "0 1px 4px rgba(0,0,0,0.06), 0 2px 12px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [],
};