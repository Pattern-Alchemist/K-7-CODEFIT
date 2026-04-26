"use client"

import { useEffect, useState } from "react"
import { AlertCircle, TrendingUp, Activity } from "lucide-react"

interface MetricSummary {
  INP: number | null
  LCP: number | null
  CLS: number | null
  status: "good" | "warning" | "poor"
}

export function SEODashboard() {
  const [metrics, setMetrics] = useState<MetricSummary | null>(null)
  const [gscData, setGscData] = useState<any>(null)
  const [cruxData, setCruxData] = useState<any>(null)

  useEffect(() => {
    // Fetch Web Vitals
    fetch("/api/analytics/vitals")
      .then((r) => r.json())
      .then((data) => {
        if (data.metrics.length > 0) {
          const latest = data.metrics[data.metrics.length - 1]
          const status =
            (latest.value > 200 && latest.name === "INP") ||
            (latest.value > 2500 && latest.name === "LCP") ||
            (latest.value > 0.1 && latest.name === "CLS")
              ? "poor"
              : "good"
          setMetrics({ INP: null, LCP: null, CLS: null, status })
        }
      })
      .catch((e) => console.error("Vitals fetch failed:", e))

    // Fetch GSC data
    fetch("/api/seo/search-console?days=7")
      .then((r) => r.json())
      .then(setGscData)
      .catch((e) => console.error("GSC fetch failed:", e))

    // Fetch CrUX data
    fetch("/api/seo/crux")
      .then((r) => r.json())
      .then(setCruxData)
      .catch((e) => console.error("CrUX fetch failed:", e))
  }, [])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-cyan-300">SEO Performance Dashboard</h2>

      {/* Web Vitals Summary */}
      {metrics && (
        <div className="glass glow rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold">Core Web Vitals</h3>
          </div>
          <div className={`p-4 rounded-lg ${metrics.status === "poor" ? "bg-red-500/10" : "bg-green-500/10"}`}>
            <p className={metrics.status === "poor" ? "text-red-300" : "text-green-300"}>
              Status: <span className="font-semibold capitalize">{metrics.status}</span>
            </p>
          </div>
        </div>
      )}

      {/* GSC Opportunities */}
      {gscData && (
        <div className="glass glow rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold">Search Console Opportunities</h3>
          </div>
          <div className="space-y-2">
            {gscData.opportunities?.slice(0, 5).map((opp: any, i: number) => (
              <div key={i} className="p-3 bg-cyan-500/10 rounded-lg">
                <p className="font-medium text-cyan-200">{opp.query}</p>
                <p className="text-sm text-white/60">
                  {opp.impressions} impressions • Position {opp.position.toFixed(1)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CrUX Data */}
      {cruxData && (
        <div className="glass glow rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-cyan-300" />
            <h3 className="text-lg font-semibold">Field Data (28d)</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(cruxData.data).map(([metric, values]: any) => (
              <div key={metric} className="p-3 bg-teal-500/10 rounded-lg">
                <p className="text-xs text-white/60 uppercase">{metric}</p>
                <p className="text-lg font-bold text-teal-300">{(values.good * 100).toFixed(0)}% good</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
