import { type NextRequest, NextResponse } from "next/server"

interface GSCQuery {
  query: string
  clicks: number
  impressions: number
  ctr: number
  position: number
}

// Mock GSC data endpoint
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = Number.parseInt(searchParams.get("days") || "7")

    // TODO: Replace with actual Google Search Console API call
    // Using googleapis library already in dependencies
    const mockData: GSCQuery[] = [
      {
        query: "sade sati",
        clicks: 142,
        impressions: 3200,
        ctr: 4.4,
        position: 8.2,
      },
      {
        query: "vedic astrology reading",
        clicks: 87,
        impressions: 1950,
        ctr: 4.5,
        position: 12.1,
      },
      {
        query: "karma balance astrology",
        clicks: 23,
        impressions: 850,
        ctr: 2.7,
        position: 18.5,
      },
    ]

    // Identify low-CTR, high-impression opportunities
    const opportunities = mockData
      .filter((q) => q.impressions > 500 && q.ctr < 5)
      .sort((a, b) => b.impressions - a.impressions)

    return NextResponse.json({
      topQueries: mockData,
      opportunities,
      dateRange: {
        start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
        end: new Date(),
      },
    })
  } catch (error) {
    console.error("GSC fetch error:", error)
    return NextResponse.json({ error: "Failed to fetch GSC data" }, { status: 500 })
  }
}
