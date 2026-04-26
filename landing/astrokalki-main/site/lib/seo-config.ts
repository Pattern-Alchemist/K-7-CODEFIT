export const SEO_CONFIG = {
  // Site Identity
  site: {
    name: "AstroKalki",
    domain: "www.astrokalki.com",
    url: "https://www.astrokalki.com",
    language: "en",
    alternateLanguages: ["hi"],
  },

  // Entity-First Schema (E-E-A-T)
  entity: {
    name: "AstroKalki",
    type: "Organization",
    description:
      "AI-powered karmic insights with practical actions. Vedic astrology readings personalized to your cosmic blueprint.",
    founder: "Kaustubh Lokhande",
    foundingDate: "2024-01-01",
    locations: ["India", "US", "Global"],
    areaServed: ["IN", "US", "GB", "CA", "AU"],
  },

  // Authority & Trust Signals
  authority: {
    socialProfiles: [
      "https://www.instagram.com/astrokalki",
      "https://www.youtube.com/@astrokalki",
      "https://www.linkedin.com/company/astrokalki",
    ],
    certifications: ["Vedic Astrology", "Jyotish Practitioner"],
    yearsInBusiness: 1,
  },

  // Content Strategy (Answer Engine Optimization)
  answerEngine: {
    primaryTopics: ["sade sati", "vedic astrology", "karma balance", "birth chart", "planetary transits"],
    questionPatterns: [
      "What is [topic]",
      "How does [topic] affect me",
      "When will [topic] happen",
      "Why is [topic] important",
      "How to [action]",
    ],
    faqMinimum: 10,
    answerCardMinimum: 5,
  },

  // Core Web Vitals Targets
  vitals: {
    LCP: 2500, // Largest Contentful Paint
    INP: 200, // Interaction to Next Paint
    CLS: 0.1, // Cumulative Layout Shift
    FCP: 1800, // First Contentful Paint
    TTFB: 800, // Time to First Byte
  },

  // Technical SEO
  technical: {
    minPageLoadTime: 2000, // ms
    maxPageSize: 5 * 1024 * 1024, // 5MB
    imageOptimization: {
      formats: ["webp", "jpeg"],
      maxWidth: 1920,
      quality: 80,
    },
    compression: true,
    http2: true,
    caching: {
      static: "31536000", // 1 year
      dynamic: "3600", // 1 hour
      api: "60", // 1 minute
    },
  },

  // Content Quality Metrics
  content: {
    minWordCount: 300,
    maxWordCount: 5000,
    optimalReadabilityScore: 60, // Flesch Reading Ease
    headingHierarchy: true, // Must have proper H1->H2->H3
    externalLinks: true,
    internalLinks: true,
  },

  // Crawl & Indexing
  crawling: {
    sitemapXml: true,
    robotsTxt: true,
    indexNow: true,
    canonicalTags: true,
    metaRobots: "index, follow",
  },

  // Monitoring & Alerts
  monitoring: {
    checkFrequency: 3600000, // 1 hour
    alertThresholds: {
      lcp_poor: 4000,
      inp_poor: 500,
      cls_poor: 0.25,
      crawlErrors: 5,
      indexingIssues: 3,
    },
  },
}

export const SEO_CHECKLIST = {
  // On-Page Optimization (100 points)
  onPage: {
    title: { points: 20, description: "Optimized title tag (50-60 chars)" },
    metaDescription: { points: 15, description: "Compelling description (120-160 chars)" },
    h1Tag: { points: 15, description: "Single H1 with primary keyword" },
    headingHierarchy: { points: 10, description: "Proper H1→H2→H3 structure" },
    imageAltText: { points: 10, description: "All images have descriptive alt text" },
    internalLinks: { points: 10, description: "Contextual internal linking" },
    keywordUsage: { points: 10, description: "Natural keyword placement" },
  },

  // Technical SEO (100 points)
  technical: {
    schemaMarkup: { points: 20, description: "Structured data (JSON-LD)" },
    coreWebVitals: { points: 25, description: "LCP < 2.5s, INP < 200ms, CLS < 0.1" },
    mobileOptimization: { points: 20, description: "Responsive design, mobile-first" },
    siteSpeed: { points: 15, description: "< 3s load time on 4G" },
    sslCertificate: { points: 10, description: "HTTPS enabled" },
    robotsTxt: { points: 5, description: "Valid robots.txt present" },
    sitemapXml: { points: 5, description: "XML sitemap submitted" },
  },

  // Authority & Trust (100 points)
  authority: {
    eeat: { points: 30, description: "E-E-A-T signals evident" },
    backlinks: { points: 25, description: "Quality inbound links" },
    socialSignals: { points: 20, description: "Social media presence" },
    reviews: { points: 15, description: "User reviews & ratings" },
    freshContent: { points: 10, description: "Regular content updates" },
  },

  // User Experience (100 points)
  ux: {
    readability: { points: 25, description: "Clear formatting, easy to scan" },
    navigation: { points: 20, description: "Intuitive site structure" },
    cta: { points: 20, description: "Clear calls-to-action" },
    engagement: { points: 20, description: "Interactive elements" },
    accessibility: { points: 15, description: "WCAG 2.1 AA compliance" },
  },
}

export function calculateSEOScore(checks: Record<string, boolean>): number {
  let totalPoints = 0
  let earnedPoints = 0

  Object.values(SEO_CHECKLIST).forEach((category) => {
    Object.entries(category).forEach(([key, item]) => {
      totalPoints += item.points
      if (checks[key]) {
        earnedPoints += item.points
      }
    })
  })

  return Math.round((earnedPoints / totalPoints) * 100)
}
