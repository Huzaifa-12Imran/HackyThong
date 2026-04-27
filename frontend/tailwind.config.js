/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        "primary-dark": "#059669",
        "primary-bright": "#34d399",
        "accent-purple": "#6366f1",
        "accent-purple-bright": "#818cf8",
        "accent-cyan": "#06b6d4",
        "accent-cyan-bright": "#22d3ee",
        "accent-red": "#ef4444",
        "accent-amber": "#f59e0b",
        "bg-base": "#07080f",
        "bg-secondary": "#0d0f1c",
        "bg-card": "#111827",
        "bg-card-hover": "#161d2e",
        "bg-sidebar": "#0a0c18",
        "text-primary": "#f1f5f9",
        "text-secondary": "#94a3b8",
        "text-muted": "#475569",
        "border-dark": "#1e2a3b",
        "border-bright": "#2d3f55",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        pulse_glow: {
          "0%, 100%": { boxShadow: "0 0 8px 2px rgba(16,185,129,0.2)" },
          "50%": { boxShadow: "0 0 28px 8px rgba(16,185,129,0.45)" },
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
        "gradient-green-cyan":
          "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
        "gradient-purple-cyan":
          "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
      },
      boxShadow: {
        "glow-green": "0 0 20px rgba(16,185,129,0.3)",
        "glow-purple": "0 0 20px rgba(99,102,241,0.3)",
        "glow-cyan": "0 0 20px rgba(6,182,212,0.3)",
        "card-dark": "0 4px 24px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};