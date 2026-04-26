import { type NextRequest, NextResponse } from "next/server"

interface CrUXMetric {
  INP: { good: number; needsImprovement: number; poor: number }
  LCP: { good: number; needsImprovement: number; poor: number }
  CLS: { good: number; needsImprovement: number; poor: number }
}

export async function GET(request: NextRequest) {
  try {
    const url = request.nextUrl.searchParams.get("url") || "https://www.astrokalki.com"

    // TODO: Call CrUX API: https://crux.run/
    // Mock field data (75th percentile)
    const mockData: CrUXMetric = {
      INP: { good: 0.78, needsImprovement: 0.15, poor: 0.07 },
      LCP: { good: 0.85, needsImprovement: 0.12, poor: 0.03 },
      CLS: { good: 0.92, needsImprovement: 0.06, poor: 0.02 },
    }

    return NextResponse.json({
      url,
      data: mockData,
      dataType: "field",
      collectionPeriod: "last_28_days",
    })
  } catch (error) {
    console.error("CrUX fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch CrUX data" }, { status: 500 })
  }
}
