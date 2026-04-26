import { type NextRequest, NextResponse } from "next/server"
import { suggestInternalLinks, getInternalLinkingSuggestions } from "@/lib/seo-service"

export async function POST(req: NextRequest) {
  try {
    const { pageUrl, pageContent } = await req.json()

    if (!pageUrl || !pageContent) {
      return NextResponse.json({ error: "pageUrl and pageContent required" }, { status: 400 })
    }

    const suggestions = await suggestInternalLinks(pageUrl, pageContent)

    return NextResponse.json({
      success: true,
      suggestions: suggestions,
    })
  } catch (error) {
    console.error("[Internal Linking API] Error:", error)
    return NextResponse.json({ error: "Failed to generate linking suggestions" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const suggestions = await getInternalLinkingSuggestions(25)

    return NextResponse.json({
      success: true,
      suggestions: suggestions,
    })
  } catch (error) {
    console.error("[Internal Linking API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
