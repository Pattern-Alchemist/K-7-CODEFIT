interface MetricData {
  name: string
  value: number
  unit: string
  tags?: Record<string, string>
}

export function recordMetric(metric: MetricData) {
  // Send to Vercel Analytics
  if (typeof window !== "undefined" && window.va) {
    window.va.track(metric.name, {
      value: metric.value,
      unit: metric.unit,
      ...metric.tags,
    })
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Metric] ${metric.name}: ${metric.value} ${metric.unit}`, metric.tags)
  }
}

export function measurePerformance(operation: string, fn: () => Promise<any>) {
  return async () => {
    const start = performance.now()
    try {
      const result = await fn()
      const duration = performance.now() - start
      recordMetric({
        name: `operation_${operation}`,
        value: duration,
        unit: "ms",
      })
      return result
    } catch (err) {
      const duration = performance.now() - start
      recordMetric({
        name: `operation_${operation}_error`,
        value: duration,
        unit: "ms",
        tags: { error: String(err) },
      })
      throw err
    }
  }
}

export class WebVitalsMonitor {
  static trackCLS() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if ("hadRecentInput" in entry && !entry.hadRecentInput) {
            recordMetric({
              name: "cls",
              value: (entry as any).value,
              unit: "score",
            })
          }
        }
      })
      observer.observe({ entryTypes: ["layout-shift"] })
    }
  }

  static trackLCP() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        const lastEntry = entries[entries.length - 1]
        recordMetric({
          name: "lcp",
          value: lastEntry.renderTime || lastEntry.loadTime,
          unit: "ms",
        })
      })
      observer.observe({ entryTypes: ["largest-contentful-paint"] })
    }
  }

  static trackFID() {
    if ("PerformanceObserver" in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          recordMetric({
            name: "fid",
            value: (entry as any).processingDuration,
            unit: "ms",
          })
        })
      })
      observer.observe({ entryTypes: ["first-input"] })
    }
  }

  static initAll() {
    this.trackCLS()
    this.trackLCP()
    this.trackFID()
  }
}
