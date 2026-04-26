# Accessibility Guidelines - WCAG 2.1 Level AA Compliance

## Overview

AstroKalki is committed to providing an accessible user experience for all users, including those with disabilities. This document outlines our accessibility standards and best practices.

## WCAG 2.1 Compliance

We aim for **WCAG 2.1 Level AA** compliance across all interfaces:

- **Level A**: Basic accessibility
- **Level AA**: Enhanced accessibility (our target)
- **Level AAA**: Advanced accessibility (applied where feasible)

## Perceivable

### Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text (18pt+)
- Minimum 3:1 contrast ratio for UI components

Use the `meetsContrastStandard()` utility to validate colors:

\`\`\`typescript
import { meetsContrastStandard } from "@/lib/accessibility"

const foreground = [248, 246, 241] // cream
const background = [15, 15, 35] // ink
meetsContrastStandard(foreground, background, "AA") // true
\`\`\`

### Alternative Text
- All images must have meaningful `alt` attributes
- Decorative images use empty alt: `alt=""`
- Images with text must include the text in the alt

Example:
\`\`\`tsx
// Good
<img src="cosmic-chart.png" alt="Birth chart with planetary positions" />

// Bad
<img src="cosmic-chart.png" alt="image" />
\`\`\`

### Text Sizing
- Minimum 12px font size for body text
- Ensure text remains readable at 200% zoom
- Use relative units (rem, em) not fixed pixels

## Operable

### Keyboard Navigation
All functionality must be keyboard accessible:
- Tab through interactive elements
- Enter/Space to activate buttons
- Arrow keys for carousels and menus
- Escape to close dialogs

\`\`\`tsx
import { KeyboardKeys, handleKeyboardEvent } from "@/lib/accessibility"

function MyComponent() {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    handleKeyboardEvent(e, () => {
      // Action
    }, [KeyboardKeys.ENTER, KeyboardKeys.SPACE])
  }

  return <div onKeyDown={handleKeyDown} />
}
\`\`\`

### Focus Management
- Visible focus indicator on all interactive elements
- Focus order follows logical flow
- No focus traps (users can tab out of all elements)

### Skip Links
Add a skip link to allow users to jump to main content:

\`\`\`tsx
import { renderSkipLink } from "@/lib/accessibility"

export default function Layout() {
  return (
    <>
      {renderSkipLink()}
      <header>Navigation</header>
      <main id="main-content">Content</main>
    </>
  )
}
\`\`\`

## Understandable

### Clear Language
- Use simple, clear language
- Define abbreviations and jargon
- Use short paragraphs and lists
- Write descriptive link text (avoid "click here")

### Consistent Navigation
- Navigation menus are consistent across pages
- Component functionality is predictable
- Error messages are clear and suggest solutions

### Form Labels
All form inputs must have associated labels:

\`\`\`tsx
import { AccessibleFormField } from "@/components/accessible-form-field"

<AccessibleFormField
  label="Birth Date"
  description="Enter your date of birth (MM/DD/YYYY)"
  error={errors.birthDate}
  required
>
  <input type="date" />
</AccessibleFormField>
\`\`\`

## Robust

### Semantic HTML
Use proper semantic elements:

\`\`\`tsx
// Good
<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

// Bad
<div>
  <div>
    <div>Title</div>
    <div>Content</div>
  </div>
</div>
\`\`\`

### ARIA Attributes
Use ARIA when semantic HTML is insufficient:

\`\`\`tsx
// Form validation
<input aria-invalid={hasError} aria-describedby="error-message" />
<p id="error-message" role="alert">{error}</p>

// Loading state
<button aria-busy={isLoading} aria-label="Loading...">
  {isLoading ? "Loading..." : "Submit"}
</button>

// Expandable content
<button aria-expanded={isOpen} aria-controls="content">
  More Details
</button>
<div id="content" hidden={!isOpen}>Content</div>
\`\`\`

### Screen Reader Support
Test with screen readers:
- **NVDA** (Windows, free)
- **JAWS** (Windows, paid)
- **VoiceOver** (macOS/iOS, built-in)
- **TalkBack** (Android, built-in)

Announcements for dynamic content:
\`\`\`tsx
import { ScreenReaderAnnouncement } from "@/lib/accessibility"

<div {...ScreenReaderAnnouncement}>
  Form submitted successfully
</div>
\`\`\`

## Components

### Accessible Form Field
Use the `AccessibleFormField` component for all form inputs:

\`\`\`tsx
<AccessibleFormField
  label="Email"
  description="We'll never share your email"
  error={errors.email}
  required
>
  <input type="email" placeholder="your@email.com" />
</AccessibleFormField>
\`\`\`

### Accessible Button
Use the `AccessibleButton` component for all buttons:

\`\`\`tsx
<AccessibleButton variant="primary" isLoading={loading}>
  Submit Reading
</AccessibleButton>
\`\`\`

## Testing

### Automated Testing
Use tools to check accessibility:

\`\`\`bash
# Axe DevTools (Browser extension)
# Lighthouse (Chrome DevTools)
# Pa11y (CLI tool)
\`\`\`

### Manual Testing
1. Navigate using only keyboard
2. Zoom to 200% and check readability
3. Use a screen reader to navigate content
4. Check color contrast with a tool
5. Validate heading hierarchy
6. Test focus management

### Accessibility Checklist
- [ ] All images have alt text
- [ ] Color contrast meets 4.5:1 ratio
- [ ] All forms have labels
- [ ] Keyboard navigation works
- [ ] Focus indicators are visible
- [ ] Semantic HTML is used
- [ ] ARIA attributes are correct
- [ ] No focus traps exist
- [ ] Error messages are clear
- [ ] Text is readable at 200% zoom

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM](https://webaim.org/)
- [Inclusive Components](https://inclusive-components.design/)
- [The A11Y Project](https://www.a11yproject.com/)
- [Deque Systems](https://www.deque.com/resources/)
\`\`\`
