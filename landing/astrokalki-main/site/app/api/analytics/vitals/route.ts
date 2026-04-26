import { type NextRequest, NextResponse } from "next/server"

interface VitalEntry {
  name: string
  value: number
  delta: number
  id: string
  timestamp: number
}

// In-memory store (replace with database in production)
const vitalMetrics: VitalEntry[] = []

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as VitalEntry

    // Add to metrics store
    vitalMetrics.push(data)

    // Keep only last 1000 entries
    if (vitalMetrics.length > 1000) {
      vitalMetrics.shift()
    }

    // Alert on poor metrics
    if (
      (data.name === "INP" && data.value > 200) ||
      (data.name === "LCP" && data.value > 2500) ||
      (data.name === "CLS" && data.value > 0.1)
    ) {
      console.warn(`[SEO Alert] Poor ${data.name}: ${data.value}`)
      // TODO: Send to monitoring service (Sentry, DataDog, etc.)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Vitals collection error:", error)
    return NextResponse.json({ error: "Failed to collect vitals" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    metrics: vitalMetrics,
    count: vitalMetrics.length,
  })
}
