import { type NextRequest, NextResponse } from "next/server"

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: string
}

export async function POST(req: NextRequest) {
  try {
    const { metrics } = await req.json()

    // Log metrics (in production, send to monitoring service)
    console.log("[Performance Metrics]", {
      count: metrics?.length || 0,
      timestamp: new Date().toISOString(),
      metrics: metrics?.slice(0, 5), // Log first 5 for debugging
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[Performance Metrics] Error:", err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
