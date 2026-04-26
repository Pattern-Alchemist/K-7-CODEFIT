import { type NextRequest, NextResponse } from "next/server"
import { mapSemanticEntities } from "@/lib/seo-service"

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content required" }, { status: 400 })
    }

    const entities = await mapSemanticEntities(content)

    return NextResponse.json({
      success: true,
      entities_extracted: entities.length,
      data: entities,
    })
  } catch (error) {
    console.error("[Semantic Entities API] Error:", error)
    return NextResponse.json({ error: "Failed to extract entities" }, { status: 500 })
  }
}
