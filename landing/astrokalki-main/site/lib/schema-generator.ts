export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AstroKalki",
  url: "https://www.astrokalki.com",
  logo: "https://www.astrokalki.com/logo.png",
  description: "Karma Balance in just 10 minutes. AI-powered karmic insights with practical actions.",
  sameAs: [
    "https://www.instagram.com/astrokalki",
    "https://www.youtube.com/@astrokalki",
    "https://www.linkedin.com/company/astrokalki",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "Customer Service",
    email: "hello@astrokalki.com",
    availableLanguage: ["en", "hi"],
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "IN",
  },
})

export const generatePersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Kaustubh Lokhande",
  url: "https://www.astrokalki.com/about/kaustubh",
  jobTitle: "Karmic Alchemist & Jyotish Practitioner",
  knowsAbout: [
    "Jyotish",
    "Vedic Astrology",
    "Nakshatra",
    "Sade Sati",
    "Rahu-Ketu Transit",
    "Muhurta",
    "Karmic Analysis",
  ],
  image: "https://www.astrokalki.com/kaustubh.jpg",
  sameAs: ["https://www.instagram.com/astrokalki", "https://www.youtube.com/@astrokalki"],
})

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AstroKalki",
  url: "https://www.astrokalki.com",
  description: "Karma Balance in just 10 minutes",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://www.astrokalki.com/search?q={search_term_string}",
    },
  },
})

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  })),
})

export const generateServiceSchema = (service: {
  name: string
  description: string
  price: string
  currency: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.description,
  provider: {
    "@type": "Organization",
    name: "AstroKalki",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: service.currency,
    price: service.price,
    availability: "https://schema.org/InStock",
  },
  areaServed: ["IN", "US", "GB", "CA", "AU"],
})

export const generateArticleSchema = (article: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
}) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: article.headline,
  description: article.description,
  image: article.image,
  datePublished: article.datePublished,
  dateModified: article.dateModified || article.datePublished,
  author: {
    "@type": "Person",
    name: article.author || "Kaustubh Lokhande",
  },
  publisher: {
    "@type": "Organization",
    name: "AstroKalki",
    logo: {
      "@type": "ImageObject",
      url: "https://www.astrokalki.com/logo.png",
    },
  },
})

export const generateFAQSchema = (
  faqs: Array<{
    question: string
    answer: string
  }>,
) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
})
