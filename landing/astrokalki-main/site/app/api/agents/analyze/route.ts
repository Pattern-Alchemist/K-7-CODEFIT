import { type NextRequest, NextResponse } from "next/server"
import { analyzeKarmicPattern } from "@/lib/agents/analysis-agent"
import { formatGuidanceResponse } from "@/lib/agents/response-formatter"

export async function POST(req: NextRequest) {
  try {
    const { userQuestion, userProfile, service } = await req.json()

    if (!userQuestion) {
      return NextResponse.json({ error: "User question required" }, { status: 400 })
    }

    const analysis = await analyzeKarmicPattern(userQuestion, userProfile || {})
    const formattedResponse = formatGuidanceResponse(analysis, service || "karma-level")

    return NextResponse.json({
      success: true,
      analysis,
      formattedResponse,
    })
  } catch (err) {
    console.error("[AnalyzeAgent] Error:", err)
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 })
  }
}
