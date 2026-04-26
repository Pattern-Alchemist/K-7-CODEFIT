"use client"

import type React from "react"
import type { ReactNode } from "react"
import { getA11yFocusStyles } from "@/lib/accessibility"

interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  isLoading?: boolean
  loadingText?: string
  variant?: "primary" | "secondary" | "ghost"
}

/**
 * Accessible button component with proper ARIA attributes
 */
export function AccessibleButton({
  children,
  isLoading = false,
  loadingText = "Loading",
  variant = "primary",
  disabled,
  className = "",
  ...props
}: AccessibleButtonProps) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all duration-200"
  const variantClasses = {
    primary: "btn btn-primary",
    secondary: "btn btn-secondary",
    ghost: "btn btn-ghost",
  }

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${getA11yFocusStyles()} ${className} ${
        isLoading || disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
      aria-busy={isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  )
}
