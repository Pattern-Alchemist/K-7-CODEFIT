// Export commonly used UI utilities
export const UI_COLORS = {
  primary: "#20b2aa", // teal
  secondary: "#d4af37", // gold
  accent: "#48dfd8", // teal-light
  background: "#0f0f23", // ink
  foreground: "#f8f6f1", // cream
} as const

export const UI_SPACING = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const

// Badge component utility
export const BadgeVariants = {
  default: "bg-teal/12 border border-teal/25 text-teal-light",
  secondary: "bg-gold/12 border border-gold/25 text-gold-light",
  destructive: "bg-red/12 border border-red/25 text-red-light",
} as const

// Button variants
export const ButtonVariants = {
  primary: "bg-gradient-to-r from-teal to-teal-light text-ink font-semibold",
  secondary: "bg-gradient-to-r from-gold/12 to-gold/8 border border-gold/30 text-cream",
  ghost: "bg-transparent border border-cream/12 text-cream hover:bg-cream/6",
} as const
