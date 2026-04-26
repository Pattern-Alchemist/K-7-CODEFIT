export function orgJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: process.env.NEXT_PUBLIC_BRAND_NAME || "AstroKalki",
    url: process.env.NEXT_PUBLIC_SITE_URL,
    logo: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.jpg`,
  }
}

/**
 * Generate meta description with optimal length (150-160 chars)
 */
export function generateMetaDescription(text: string): string {
  const maxLength = 160
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + "..."
}

/**
 * Generate SEO-friendly slug from text
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

/**
 * Check if content meets SEO standards
 */
export interface SEOAuditResult {
  title: { valid: boolean; message: string }
  description: { valid: boolean; message: string }
  headings: { valid: boolean; message: string }
  images: { valid: boolean; message: string }
  score: number
}

export function auditPageSEO(
  title: string,
  description: string,
  hasH1: boolean,
  imagesWithAlt: number,
  totalImages: number,
): SEOAuditResult {
  const audit: SEOAuditResult = {
    title: { valid: false, message: "" },
    description: { valid: false, message: "" },
    headings: { valid: false, message: "" },
    images: { valid: false, message: "" },
    score: 0,
  }

  let score = 0

  // Title check (50-60 chars optimal)
  if (title.length >= 30 && title.length <= 60) {
    audit.title = { valid: true, message: "Title length optimal" }
    score += 25
  } else if (title.length > 0) {
    audit.title = { valid: false, message: `Title is ${title.length} chars (optimal: 30-60)` }
    score += 10
  }

  // Description check (150-160 chars optimal)
  if (description.length >= 120 && description.length <= 160) {
    audit.description = { valid: true, message: "Description length optimal" }
    score += 25
  } else if (description.length > 0) {
    audit.description = { valid: false, message: `Description is ${description.length} chars (optimal: 120-160)` }
    score += 10
  }

  // Heading check
  if (hasH1) {
    audit.headings = { valid: true, message: "H1 tag present" }
    score += 25
  } else {
    audit.headings = { valid: false, message: "Missing H1 tag" }
  }

  // Image alt text check
  const altRatio = totalImages > 0 ? imagesWithAlt / totalImages : 1
  if (altRatio >= 0.9) {
    audit.images = { valid: true, message: `${imagesWithAlt}/${totalImages} images have alt text` }
    score += 25
  } else {
    audit.images = { valid: false, message: `${imagesWithAlt}/${totalImages} images have alt text (target: 90%+)` }
    score += imagesWithAlt * 10
  }

  audit.score = Math.min(100, score)
  return audit
}

/**
 * Recommended keywords for page
 */
export const KEYWORD_CLUSTERS = {
  astrology: ["vedic astrology", "birth chart", "horoscope", "zodiac", "planetary transit"],
  karma: ["karma balance", "karmic debt", "karmic lessons", "karmic cycle", "dharma"],
  saturn: ["sade sati", "saturn return", "saturn transit", "saturn dasha", "shani"],
  relationship: ["compatibility", "relationship astrology", "love astrology", "soulmate", "twin flame"],
  services: ["astrology reading", "consultation", "chart analysis", "personalized reading", "tarot"],
}

/**
 * Generate keywords for a page based on topic
 */
export function getRecommendedKeywords(topic: keyof typeof KEYWORD_CLUSTERS): string[] {
  return KEYWORD_CLUSTERS[topic] || []
}

/**
 * Calculate readability score (Flesch Reading Ease simplified)
 */
export function calculateReadabilityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).length
  const words = text.split(/\s+/).length
  const syllables = (text.match(/[aeiou]/gi) || []).length

  if (sentences === 0 || words === 0) return 0

  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words)
  return Math.max(0, Math.min(100, score))
}

/**
 * Extract structured data for AI indexing
 */
export function extractStructuredData(html: string) {
  const jsonLdRegex = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  const matches = [...html.matchAll(jsonLdRegex)]
  return matches.map((m) => {
    try {
      return JSON.parse(m[1])
    } catch {
      return null
    }
  })
}

/**
 * SEO-friendly canonicalization
 */
export function getCanonicalUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.astrokalki.com"
  const cleanPath = path.replace(/\/$/, "") || "/"
  return `${baseUrl}${cleanPath}`
}
