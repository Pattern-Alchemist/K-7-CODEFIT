import { type NextRequest, NextResponse } from "next/server"
import { analyzeContentGaps } from "@/lib/seo-service"

export async function POST(req: NextRequest) {
  try {
    const gscData = await req.json()

    if (!Array.isArray(gscData)) {
      return NextResponse.json({ error: "Expected array of GSC data" }, { status: 400 })
    }

    const gaps = await analyzeContentGaps(gscData)

    return NextResponse.json({
      success: true,
      gaps_identified: gaps.length,
      data: gaps,
    })
  } catch (error) {
    console.error("[Content Gap API] Error:", error)
    return NextResponse.json({ error: "Failed to analyze content gaps" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { getContentGaps } = await import("@/lib/seo-service")
    const gaps = await getContentGaps(20)

    return NextResponse.json({
      success: true,
      gaps: gaps,
    })
  } catch (error) {
    console.error("[Content Gap API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch content gaps" }, { status: 500 })
  }
}
