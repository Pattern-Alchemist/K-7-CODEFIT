"use client"

import { Zap, Map, Heart, Volume2, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function ServiceCards() {
  const router = useRouter()
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleServiceClick = async (serviceId: string, serviceName: string, amount: number, currency: string) => {
    setLoadingId(serviceId)

    try {
      // Navigate to booking section with service details
      const bookingSection = document.getElementById("booking")
      if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: "smooth" })
      }

      // Set service data in sessionStorage for the booking form to pick up
      sessionStorage.setItem(
        "selectedService",
        JSON.stringify({
          id: serviceId,
          name: serviceName,
          amount,
          currency,
          timestamp: new Date().toISOString(),
        }),
      )
    } catch (error) {
      console.error("[v0] Service selection error:", error)
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <section className="relative mt-16 sm:mt-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-cinzel title-tight text-3xl font-semibold sm:text-4xl mb-2">Premium Cosmic Tools</h2>
        <p className="mb-8 text-white/70">Transform patterns instantly. Budget-friendly guidance at scale.</p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Relationship Repair Plan */}
          <div className="glass glow rounded-2xl p-6 border border-white/10 hover:border-cyan-300/40 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white">7-Day Repair Plan</h3>
                <p className="text-xs text-white/60 mt-1">Relationship Repair Plan</p>
              </div>
              <Heart className="h-5 w-5 text-fuchsia-400" strokeWidth={1.5} />
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg py-3 px-4 text-center mb-4">
              <div className="text-2xl font-bold text-black">₹99 / $9</div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Exact words to say for the next 7 days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>What NOT to tolerate</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Boundary script for late-night drama</span>
              </li>
            </ul>

            <button
              onClick={() => handleServiceClick("repair-7day", "7-Day Repair Plan", 99, "INR")}
              disabled={loadingId === "repair-7day"}
              className="btn w-full justify-center text-sm font-medium group-hover:shadow-lg group-hover:shadow-fuchsia-500/20 disabled:opacity-50"
            >
              {loadingId === "repair-7day" ? "Loading..." : "Fix My Relationship"}
              {loadingId !== "repair-7day" && <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />}
            </button>
          </div>

          {/* Card 2: Karma Firewall */}
          <div className="glass glow rounded-2xl p-6 border border-white/10 hover:border-cyan-300/40 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white">Karma Firewall</h3>
                <p className="text-xs text-white/60 mt-1">Do Not Text</p>
              </div>
              <Zap className="h-5 w-5 text-yellow-400" strokeWidth={1.5} />
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg py-3 px-4 text-center mb-4">
              <div className="text-2xl font-bold text-black">₹99 / $9</div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Your emotional danger hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>"Never send this" warning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Money-protection script</span>
              </li>
            </ul>

            <button
              onClick={() => handleServiceClick("protect-tonight", "Karma Firewall", 99, "INR")}
              disabled={loadingId === "protect-tonight"}
              className="btn w-full justify-center text-sm font-medium group-hover:shadow-lg group-hover:shadow-yellow-500/20 disabled:opacity-50"
            >
              {loadingId === "protect-tonight" ? "Loading..." : "Protect Me Tonight"}
              {loadingId !== "protect-tonight" && <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />}
            </button>
          </div>

          {/* Card 3: Karmic Map PDF */}
          <div className="glass glow rounded-2xl p-6 border border-white/10 hover:border-cyan-300/40 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white">Karmic Map PDF</h3>
                <p className="text-xs text-white/60 mt-1">Why This Keeps Happening</p>
              </div>
              <Map className="h-5 w-5 text-teal-400" strokeWidth={1.5} />
            </div>

            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 rounded-lg py-3 px-4 text-center mb-4">
              <div className="text-2xl font-bold text-black">₹99 / $9</div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Your repeating wound</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>Your money leak pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 mt-1">•</span>
                <span>30-day ritual assignment</span>
              </li>
            </ul>

            <button
              onClick={() => handleServiceClick("karmic-map", "Karmic Map PDF", 99, "INR")}
              disabled={loadingId === "karmic-map"}
              className="btn w-full justify-center text-sm font-medium group-hover:shadow-lg group-hover:shadow-teal-500/20 disabled:opacity-50"
            >
              {loadingId === "karmic-map" ? "Loading..." : "Decode Me"}
              {loadingId !== "karmic-map" && <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />}
            </button>
          </div>

          {/* Card 4: Personal Audio Note */}
          <div className="glass glow rounded-2xl p-6 border border-white/10 hover:border-fuchsia-300/40 transition-all group lg:col-span-1 md:col-span-2">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-cinzel text-xl font-semibold text-white">Audio Voice Note</h3>
                <p className="text-xs text-white/60 mt-1">From K-9 Personally</p>
              </div>
              <Volume2 className="h-5 w-5 text-fuchsia-400" strokeWidth={1.5} />
            </div>

            <div className="bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-lg py-3 px-4 text-center mb-4">
              <div className="text-2xl font-bold text-white">₹499 / $19</div>
            </div>

            <ul className="space-y-2 mb-6 text-sm text-white/80">
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 mt-1">•</span>
                <span>I say your name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 mt-1">•</span>
                <span>I tell you the one rule for next 48h</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-fuchsia-400 mt-1">•</span>
                <span>You replay it when you're weak</span>
              </li>
            </ul>

            <button
              onClick={() => handleServiceClick("voice-note", "Audio Voice Note", 499, "INR")}
              disabled={loadingId === "voice-note"}
              className="btn w-full justify-center text-sm font-medium bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 group-hover:shadow-lg group-hover:shadow-fuchsia-500/20 disabled:opacity-50"
            >
              {loadingId === "voice-note" ? "Loading..." : "Send Me My Voice"}
              {loadingId !== "voice-note" && <ArrowRight className="h-4 w-4 ml-2" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a href="#services" className="text-cyan-300 hover:text-cyan-200 text-sm font-medium transition-colors">
            See All Services →
          </a>
        </div>
      </div>
    </section>
  )
}
