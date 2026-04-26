import { type NextRequest, NextResponse } from "next/server"

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
}

const performanceHistory: PerformanceMetric[] = []

export async function POST(request: NextRequest) {
  try {
    const metric = (await request.json()) as PerformanceMetric

    performanceHistory.push(metric)

    // Keep only last 10000 entries per metric
    const grouped = new Map<string, PerformanceMetric[]>()
    performanceHistory.forEach((m) => {
      if (!grouped.has(m.name)) grouped.set(m.name, [])
      grouped.get(m.name)?.push(m)
    })

    // Trim each metric group
    performanceHistory.length = 0
    grouped.forEach((entries) => {
      if (entries.length > 1000) {
        performanceHistory.push(...entries.slice(entries.length - 1000))
      } else {
        performanceHistory.push(...entries)
      }
    })

    // Calculate compliance status
    const avgByMetric = new Map<string, number>()
    grouped.forEach((entries, name) => {
      const avg = entries.reduce((sum, m) => sum + m.value, 0) / entries.length
      avgByMetric.set(name, avg)
    })

    const thresholds = { LCP: 2500, INP: 200, CLS: 0.1 }
    const issues = Array.from(avgByMetric.entries())
      .filter(([name, avg]) => {
        const threshold = thresholds[name as keyof typeof thresholds]
        return threshold && avg > threshold
      })
      .map(([name, avg]) => `${name}: ${avg.toFixed(1)} (threshold: ${thresholds[name as keyof typeof thresholds]})`)

    return NextResponse.json({
      success: true,
      metricsStored: performanceHistory.length,
      compliance: issues.length === 0,
      issues,
    })
  } catch (error) {
    console.error("Performance metrics error:", error)
    return NextResponse.json({ error: "Failed to store performance metrics" }, { status: 500 })
  }
}

export async function GET() {
  const grouped = new Map<string, PerformanceMetric[]>()
  performanceHistory.forEach((m) => {
    if (!grouped.has(m.name)) grouped.set(m.name, [])
    grouped.get(m.name)?.push(m)
  })

  const stats = new Map<string, { avg: number; min: number; max: number; count: number }>()
  grouped.forEach((entries, name) => {
    const values = entries.map((e) => e.value)
    stats.set(name, {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length,
    })
  })

  return NextResponse.json({
    stats: Object.fromEntries(stats),
    totalRecords: performanceHistory.length,
  })
}
