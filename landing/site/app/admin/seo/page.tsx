"use client"

import { useState } from "react"
import { SEODashboard } from "@/components/seo-dashboard"
import { VitalsDisplay } from "@/components/web-vitals-monitor"
import { RefreshCw, Send } from "lucide-react"

export default function SEOAdminPage() {
  const [indexnowUrls, setIndexnowUrls] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleIndexNowSubmit = async () => {
    if (!indexnowUrls.trim()) return

    setIsSubmitting(true)
    setMessage("")

    try {
      const urls = indexnowUrls
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0)

      const response = await fetch("/api/seo/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`✓ Successfully submitted ${data.submitted} URLs to IndexNow`)
        setIndexnowUrls("")
      } else {
        setMessage(`✗ Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("✗ Failed to submit to IndexNow")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-white">
          <h1 className="font-cinzel text-4xl font-bold mb-2">SEO Control Panel</h1>
          <p className="text-white/60">Monitor performance, manage indexing, and optimize search visibility</p>
        </div>

        {/* Quick Vitals */}
        <div className="glass rounded-xl p-6">
          <h2 className="font-cinzel text-xl font-semibold text-white mb-4">Real-Time Web Vitals</h2>
          <VitalsDisplay />
        </div>

        {/* IndexNow Submission */}
        <div className="glass rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw className="h-5 w-5 text-cyan-300" />
            <h2 className="font-cinzel text-xl font-semibold text-white">Instant Indexing (IndexNow)</h2>
          </div>

          <div className="space-y-3">
            <textarea
              value={indexnowUrls}
              onChange={(e) => setIndexnowUrls(e.target.value)}
              placeholder="Paste URLs to index (one per line)&#10;https://www.astrokalki.com&#10;https://www.astrokalki.com/seo-content"
              className="w-full h-32 glass rounded-lg p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            />

            <button
              onClick={handleIndexNowSubmit}
              disabled={isSubmitting || !indexnowUrls.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-cyan-500 text-black font-semibold rounded-lg hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Send className="h-4 w-4" />
              {isSubmitting ? "Submitting..." : "Submit to IndexNow"}
            </button>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  message.startsWith("✓") ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"
                }`}
              >
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Full SEO Dashboard */}
        <SEODashboard />
      </div>
    </div>
  )
}
