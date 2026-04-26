"use client"

import { AnswerCard } from "@/components/answer-card"
import { SchemaRenderer } from "@/components/schema-renderer"
import { generateBreadcrumbSchema, generateArticleSchema, generateFAQSchema } from "@/lib/schema-generator"

export default function SEOContentPage() {
  const schemas = [
    generateBreadcrumbSchema([
      { name: "Home", url: "https://www.astrokalki.com" },
      { name: "Astrology Guide", url: "https://www.astrokalki.com/seo-content" },
    ]),
    generateArticleSchema({
      headline: "Complete Guide to Sade Sati: Saturn's 7.5-Year Transformation",
      description: "Understanding Sade Sati transit, its phases, and practical remedies for karmic maturity.",
      image: "https://www.astrokalki.com/images/sade-sati.jpg",
      datePublished: "2025-01-01",
      author: "Kaustubh Lokhande",
    }),
    generateFAQSchema([
      {
        question: "What is Sade Sati?",
        answer:
          "Sade Sati is a 7.5-year Saturn transit that brings maturity-focused life lessons and significant life transitions.",
      },
      {
        question: "How does Sade Sati affect me?",
        answer:
          "Effects depend on your natal chart position and Saturn strength. Generally brings challenges that accelerate spiritual growth.",
      },
    ]),
  ]

  return (
    <main className="min-h-screen bg-ink text-white pt-32 pb-20">
      <SchemaRenderer schemas={schemas} />

      <div className="mx-auto max-w-4xl px-4 space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4">
          <h1 className="font-cinzel text-5xl font-bold text-cyan-300">Vedic Astrology Guide</h1>
          <p className="text-xl text-cyan-200">Clear answers to your deepest cosmic questions</p>
        </section>

        {/* Answer Cards */}
        <div className="space-y-8">
          {/* Sade Sati Card */}
          <AnswerCard
            question="What is Sade Sati and how does it affect my life?"
            shortAnswer="Sade Sati is a 7.5-year Saturn transit around your Moon sign that catalyzes maturity and spiritual growth through meaningful life lessons."
            fullContent={
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-200 mb-2">The Three Phases</h3>
                  <ul className="space-y-3 text-white/80">
                    <li>
                      <strong className="text-cyan-300">Phase 1 (2.5 yrs):</strong> Reflection & withdrawal. Internal
                      restructuring begins.
                    </li>
                    <li>
                      <strong className="text-cyan-300">Phase 2 (2.5 yrs):</strong> Challenge & transformation. Peak
                      intensity of external changes.
                    </li>
                    <li>
                      <strong className="text-cyan-300">Phase 3 (2.5 yrs):</strong> Integration & wisdom. Emergence into
                      new clarity.
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cyan-200 mb-2">Practical Approach</h3>
                  <p className="text-white/80">
                    Rather than fear Sade Sati, see it as your personal coaching program from the universe. It
                    accelerates self-awareness and aligns you with your true dharma.
                  </p>
                </div>
              </div>
            }
            sources={[
              { title: "Vedic Astrology Classical Texts", url: "https://www.ancient-vedic-sources.com" },
              { title: "Saturn Transits Analysis", url: "https://www.astrology-research.org" },
            ]}
            tags={["Sade Sati", "Saturn Transit", "Vedic Astrology", "Transformation"]}
          />

          {/* Rahu-Ketu Card */}
          <AnswerCard
            question="What do Rahu and Ketu transits mean for my future?"
            shortAnswer="Rahu represents expansion and material drive, while Ketu signifies spiritual release. Their 18-year cycle brings alternating focus on worldly success and inner growth."
            fullContent={
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-cyan-200 mb-2">Rahu Transit (9 years)</h3>
                  <p className="text-white/80 mb-2">
                    Amplifies your desires and outer ambitions. Growth periods, but requires conscious direction or can
                    lead to restlessness.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-cyan-200 mb-2">Ketu Transit (9 years)</h3>
                  <p className="text-white/80">
                    Turns focus inward. Detachment, spiritual inclination, and releasing what no longer serves. Often
                    feels like quiet dissolution before rebirth.
                  </p>
                </div>
              </div>
            }
            sources={[{ title: "Rahu-Ketu Dasha Analysis" }]}
            tags={["Rahu", "Ketu", "Nodes", "Transit Cycles"]}
          />

          {/* Muhurta Card */}
          <AnswerCard
            question="How does Muhurta (auspicious timing) work?"
            shortAnswer="Muhurta is the practice of selecting auspicious planetary moments to initiate important life events—maximizing cosmic support for your intentions."
            fullContent={
              <div className="space-y-4">
                <p className="text-white/80">
                  Ancient Vedic science teaches that planetary positions influence the vibrational quality of any
                  moment. By timing major actions (marriage, business launch, travel) to favorable planetary positions,
                  you align personal energy with cosmic currents.
                </p>
                <div className="bg-teal-500/10 rounded-lg p-4 text-white/80">
                  <p>
                    <strong className="text-teal-300">Example:</strong> Avoiding hours when malefic planets rule, or
                    choosing when Jupiter (expansion) is strong for starting a venture.
                  </p>
                </div>
              </div>
            }
            tags={["Muhurta", "Auspicious Timing", "Planetary Influence"]}
          />
        </div>
      </div>
    </main>
  )
}
