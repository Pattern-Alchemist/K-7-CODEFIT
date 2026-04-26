"use client"

import { useState, useEffect } from "react"
import { SEO_CHECKLIST, calculateSEOScore } from "@/lib/seo-config"
import { CheckCircle2, TrendingUp } from "lucide-react"

export default function SEOMonitoringPage() {
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  const [score, setScore] = useState(0)

  useEffect(() => {
    const newScore = calculateSEOScore(checks)
    setScore(newScore)
  }, [checks])

  const toggleCheck = (key: string) => {
    setChecks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400"
    if (score >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="text-white mb-8">
          <h1 className="font-cinzel text-4xl font-bold mb-2">SEO Audit Checklist</h1>
          <p className="text-white/60">Track your SEO optimization progress</p>
        </div>

        {/* Score Display */}
        <div className="glass rounded-xl p-8 mb-8 text-center">
          <div className={`text-6xl font-bold ${getScoreColor(score)}`}>{score}</div>
          <p className="text-white/70 mt-2">SEO Health Score (0-400 points possible)</p>
          <div className="w-full bg-white/10 rounded-full h-3 mt-4 overflow-hidden">
            <div
              className={`h-full transition-all ${
                score >= 300 ? "bg-green-500" : score >= 200 ? "bg-yellow-500" : "bg-red-500"
              }`}
              style={{ width: `${(score / 400) * 100}%` }}
            />
          </div>
        </div>

        {/* Checklist Categories */}
        {Object.entries(SEO_CHECKLIST).map(([category, items]) => (
          <div key={category} className="glass rounded-xl p-6 mb-6">
            <h2 className="font-cinzel text-xl font-semibold text-white mb-4 capitalize">{category} SEO</h2>
            <div className="space-y-3">
              {Object.entries(items).map(([key, item]: [string, any]) => (
                <label
                  key={key}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition"
                >
                  <input
                    type="checkbox"
                    checked={checks[key] || false}
                    onChange={() => toggleCheck(key)}
                    className="mt-1 w-5 h-5 accent-cyan-500"
                  />
                  <div className="flex-1">
                    <div className="text-white font-medium">{item.description}</div>
                    <div className="text-sm text-white/50">+{item.points} points</div>
                  </div>
                  {checks[key] && <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />}
                </label>
              ))}
            </div>
          </div>
        ))}

        {/* Recommendations */}
        <div className="glass rounded-xl p-6 border border-blue-500/20">
          <div className="flex items-start gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
            <h3 className="text-lg font-semibold text-white">Next Steps</h3>
          </div>
          <ul className="space-y-2 text-sm text-white/70">
            <li>• Focus on Core Web Vitals - they have the highest ranking impact</li>
            <li>• Create comprehensive answer cards for top search queries</li>
            <li>• Build authoritative backlinks from industry-relevant sites</li>
            <li>• Regularly audit and update content for freshness signals</li>
            <li>• Monitor Search Console for crawl errors and index coverage issues</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
