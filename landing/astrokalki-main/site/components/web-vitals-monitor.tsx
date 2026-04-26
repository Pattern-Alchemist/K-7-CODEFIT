"use client"

import { useEffect } from "react"
import { getCoreWebVitals, sendVitalMetric, checkVitalCompliance, VITAL_THRESHOLDS } from "@/lib/web-vitals"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export function WebVitalsMonitor() {
  useEffect(() => {
    if (typeof window === "undefined") return

    // Track Core Web Vitals on page load
    const trackVitals = () => {
      const vitals = getCoreWebVitals()
      const { compliant, issues } = checkVitalCompliance(vitals)

      // Log to console in development
      if (process.env.NODE_ENV === "development") {
        console.log("[Web Vitals]", vitals)
        if (!compliant) {
          console.warn("[Web Vitals Issues]", issues)
        }
      }

      // Send metrics to server
      Object.entries(vitals).forEach(([name, value]) => {
        if (value !== null) {
          sendVitalMetric({
            name,
            value,
            delta: 0,
            id: `${name}-${Date.now()}`,
            entries: performance.getEntries(),
          })
        }
      })
    }

    // Delay tracking until page is fully loaded
    if (document.readyState === "complete") {
      trackVitals()
    } else {
      window.addEventListener("load", trackVitals)
      return () => window.removeEventListener("load", trackVitals)
    }
  }, [])

  return null
}

interface VitalDisplayProps {
  value: number | null
  threshold: number
  unit: string
  label: string
}

function VitalDisplay({ value, threshold, unit, label }: VitalDisplayProps) {
  if (value === null) return null

  const isGood = value <= threshold
  const Icon = isGood ? CheckCircle2 : AlertCircle

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5">
      <Icon className={`h-4 w-4 ${isGood ? "text-green-400" : "text-red-400"}`} />
      <div className="text-sm">
        <span className="text-white/70">{label}: </span>
        <span className={isGood ? "text-green-400" : "text-red-400"}>
          {value.toFixed(1)}
          {unit}
        </span>
        <span className="text-white/50 text-xs"> (threshold: {threshold})</span>
      </div>
    </div>
  )
}

export function VitalsDisplay() {
  const vitals = getCoreWebVitals()

  return (
    <div className="space-y-1">
      <VitalDisplay value={vitals.LCP} threshold={VITAL_THRESHOLDS.LCP} unit="ms" label="LCP" />
      <VitalDisplay value={vitals.INP} threshold={VITAL_THRESHOLDS.INP} unit="ms" label="INP" />
      <VitalDisplay value={vitals.CLS} threshold={VITAL_THRESHOLDS.CLS} unit="" label="CLS" />
    </div>
  )
}
