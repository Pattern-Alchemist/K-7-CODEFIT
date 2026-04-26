import type React from "react"
import type { Metadata } from "next"
import { Cinzel, Inter } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import SiteHeader from "@/components/SiteHeader"
import { SchemaRenderer } from "@/components/schema-renderer"
import { generateOrganizationSchema, generatePersonSchema, generateWebsiteSchema } from "@/lib/schema-generator"
import { WebVitalsMonitor } from "@/components/web-vitals-monitor"

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.astrokalki.com"),
  title: "AstroKalki — Karma Balance in 10 Minutes",
  description:
    "AI-powered karmic insights with practical actions. Vedic astrology readings personalized to your cosmic blueprint.",
  keywords: "astrology, vedic astrology, karma, jyotish, birth chart, transit, sade sati, nakshatra",
  authors: [{ name: "Kaustubh Lokhande" }],
  creator: "Kaustubh Lokhande",
  publisher: "AstroKalki",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.astrokalki.com",
    siteName: "AstroKalki",
    title: "AstroKalki — Karma Balance in 10 Minutes",
    description:
      "AI-powered karmic insights with practical actions. Vedic astrology readings personalized to your cosmic blueprint.",
    images: [
      {
        url: "https://www.astrokalki.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AstroKalki - Karma Balance",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AstroKalki — Karma Balance",
    description: "AI-powered karmic insights with practical actions",
    creator: "@astrokalki",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const globalSchemas = [generateOrganizationSchema(), generatePersonSchema(), generateWebsiteSchema()]

  return (
    <html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
      <head>
        <link rel="canonical" href="https://www.astrokalki.com" />
        <meta name="IndexNow-Verification" content="your-indexnow-key" />
      </head>
      <body className="min-h-screen bg-black font-inter text-white antialiased">
        <WebVitalsMonitor />
        <SchemaRenderer schemas={globalSchemas} />
        <SiteHeader />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
