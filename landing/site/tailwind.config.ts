import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ink: "#0D0B1E",
        tealGlow: "#56B3A8",
        cyanGlow: "#67e8f9",
        fuschiaGlow: "#e879f9",
        copperGlow: "#d97706",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(103,232,249,0.25), 0 10px 40px rgba(86,179,168,0.35), inset 0 0 80px rgba(103,232,249,0.08)",
      },
      fontFamily: {
        cinzel: ["Cinzel", "serif"],
        inter: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        twinkle: {
          "0%,100%": { opacity: ".25", transform: "translateY(0)" },
          "50%": { opacity: ".9", transform: "translateY(-3px)" },
        },
        eqbounce: {
          "0%,100%": { height: "6px" },
          "50%": { height: "24px" },
        },
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        eqbounce: "eqbounce 1.2s ease-in-out infinite",
      },
      backgroundImage: {
        auroraLayer:
          "radial-gradient(1200px_600px_at_10%_-10%,rgba(103,232,249,0.12),transparent_60%), radial-gradient(900px_600px_at_90%_-10%,rgba(232,121,249,0.10),transparent_60%), conic-gradient(from_180deg_at_50%_10%,rgba(86,179,168,0.15),rgba(13,11,30,0.0),rgba(232,121,249,0.12),rgba(13,11,30,0.0))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
