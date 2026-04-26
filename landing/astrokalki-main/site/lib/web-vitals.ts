interface VitalMetric {
  name: string
  delta: number
  value: number
  id: string
  entries: PerformanceEntryList
}

interface CoreWebVitals {
  INP: number | null
  LCP: number | null
  CLS: number | null
  FCP: number | null
  TTFB: number | null
}

// Thresholds from Google (75th percentile = "Good")
export const VITAL_THRESHOLDS = {
  INP: 200, // ms - Interaction to Next Paint
  LCP: 2500, // ms - Largest Contentful Paint
  CLS: 0.1, // unitless - Cumulative Layout Shift
  FCP: 1800, // ms - First Contentful Paint
  TTFB: 800, // ms - Time to First Byte
}

export function sendVitalMetric(metric: VitalMetric) {
  // Send to analytics endpoint
  if (navigator?.sendBeacon) {
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      delta: metric.delta,
      id: metric.id,
      timestamp: Date.now(),
    })
    navigator.sendBeacon("/api/analytics/vitals", body)
  } else {
    fetch("/api/analytics/vitals", {
      method: "POST",
      body: JSON.stringify({
        name: metric.name,
        value: metric.value,
        delta: metric.delta,
        id: metric.id,
        timestamp: Date.now(),
      }),
      keepalive: true,
    }).catch(() => {
      // Silently fail to not impact user experience
    })
  }
}

export function getCoreWebVitals(): CoreWebVitals {
  const vitals: CoreWebVitals = {
    INP: null,
    LCP: null,
    CLS: null,
    FCP: null,
    TTFB: null,
  }

  if (typeof window === "undefined") {
    return vitals
  }

  // INP (Interaction to Next Paint)
  if ("PerformanceObserver" in window) {
    try {
      const inpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as any
          vitals.INP = lastEntry.processingDuration
        }
      })
      inpObserver.observe({ entryTypes: ["event"] })
    } catch (e) {
      // INP not supported
    }
  }

  // LCP (Largest Contentful Paint)
  if ("PerformanceObserver" in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        if (entries.length > 0) {
          const lastEntry = entries[entries.length - 1] as any
          vitals.LCP = lastEntry.renderTime || lastEntry.loadTime
        }
      })
      lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] })
    } catch (e) {
      // LCP not supported
    }
  }

  // CLS (Cumulative Layout Shift)
  if ("PerformanceObserver" in window) {
    try {
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        let totalCLS = 0
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            totalCLS += entry.value
          }
        })
        vitals.CLS = totalCLS
      })
      clsObserver.observe({ type: "layout-shift", buffered: true })
    } catch (e) {
      // CLS not supported
    }
  }

  // FCP & TTFB from Navigation Timing
  const navTiming = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming
  if (navTiming) {
    const paintEntries = performance.getEntriesByType("paint")
    const fcpEntry = paintEntries.find((e) => e.name === "first-contentful-paint")
    if (fcpEntry) {
      vitals.FCP = fcpEntry.startTime
    }
    vitals.TTFB = navTiming.responseStart - navTiming.fetchStart
  }

  return vitals
}

export function checkVitalCompliance(vitals: CoreWebVitals): { compliant: boolean; issues: string[] } {
  const issues: string[] = []

  if (vitals.INP && vitals.INP > VITAL_THRESHOLDS.INP) {
    issues.push(`INP (${vitals.INP}ms) exceeds threshold (${VITAL_THRESHOLDS.INP}ms)`)
  }
  if (vitals.LCP && vitals.LCP > VITAL_THRESHOLDS.LCP) {
    issues.push(`LCP (${vitals.LCP}ms) exceeds threshold (${VITAL_THRESHOLDS.LCP}ms)`)
  }
  if (vitals.CLS && vitals.CLS > VITAL_THRESHOLDS.CLS) {
    issues.push(`CLS (${vitals.CLS}) exceeds threshold (${VITAL_THRESHOLDS.CLS})`)
  }

  return {
    compliant: issues.length === 0,
    issues,
  }
}
