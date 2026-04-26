/**
 * Accessibility utilities and helpers
 * WCAG 2.1 Level AA compliance
 */

import type React from "react" // Import React to use JSX

/**
 * Generate unique ID for form labels and inputs
 */
export function generateId(prefix = "id"): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Calculate color contrast ratio (WCAG)
 * Returns contrast ratio between 1:1 and 21:1
 */
export function getContrastRatio(rgb1: [number, number, number], rgb2: [number, number, number]): number {
  const getLuminance = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb.map((x) => {
      x = x / 255
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
    })
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const l1 = getLuminance(rgb1)
  const l2 = getLuminance(rgb2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if color contrast meets WCAG AA standards
 * AA requires 4.5:1 for normal text, 3:1 for large text
 * AAA requires 7:1 for normal text, 4.5:1 for large text
 */
export function meetsContrastStandard(
  foreground: [number, number, number],
  background: [number, number, number],
  level: "AA" | "AAA" = "AA",
  isLargeText = false,
): boolean {
  const ratio = getContrastRatio(foreground, background)
  const threshold = level === "AA" ? (isLargeText ? 3 : 4.5) : isLargeText ? 4.5 : 7
  return ratio >= threshold
}

/**
 * ARIA label generator for common patterns
 */
export const ariaLabels = {
  close: "Close dialog",
  menu: "Open navigation menu",
  search: "Search",
  previous: "Previous",
  next: "Next",
  loading: "Loading",
  error: "Error",
  success: "Success",
  expandable: "Toggle expanded content",
}

/**
 * Keyboard event utilities
 */
export const KeyboardKeys = {
  ENTER: "Enter",
  ESCAPE: "Escape",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  TAB: "Tab",
  SPACE: " ",
} as const

/**
 * Check if key was pressed (for keyboard navigation)
 */
export function isKeyPressed(event: KeyboardEvent, key: (typeof KeyboardKeys)[keyof typeof KeyboardKeys]): boolean {
  return event.key === key
}

/**
 * Prevent default and stop propagation for keyboard events
 */
export function handleKeyboardEvent(
  event: React.KeyboardEvent,
  callback: () => void,
  allowedKeys: string[] = [],
): void {
  if (allowedKeys.includes(event.key)) {
    event.preventDefault()
    event.stopPropagation()
    callback()
  }
}

/**
 * Get accessible focus styles
 */
export function getA11yFocusStyles(): string {
  return "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
}

/**
 * Generate skip to main content link
 */
export function renderSkipLink(): JSX.Element {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground"
    >
      Skip to main content
    </a>
  )
}

/**
 * Accessible announcement for screen readers
 */
export const ScreenReaderAnnouncement = {
  live: "polite",
  atomic: true,
} as const

/**
 * Generate proper heading hierarchy
 */
export function validateHeadingHierarchy(headings: string[]): boolean {
  let previousLevel = 0
  for (const heading of headings) {
    const level = Number.parseInt(heading.replace(/\D/g, ""))
    // Headings should not skip levels (e.g., h1 to h3)
    if (level - previousLevel > 1) return false
    previousLevel = level
  }
  return true
}
