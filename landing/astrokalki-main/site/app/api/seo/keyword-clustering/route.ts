import { type NextRequest, NextResponse } from "next/server"
import { clusterKeywords, getKeywordClusters } from "@/lib/seo-service"

export async function POST(req: NextRequest) {
  try {
    const keywords = await req.json()

    if (!Array.isArray(keywords)) {
      return NextResponse.json({ error: "Expected array of keywords" }, { status: 400 })
    }

    const clusters = await clusterKeywords(keywords)

    return NextResponse.json({
      success: true,
      clusters_created: clusters.length,
      data: clusters,
    })
  } catch (error) {
    console.error("[Keyword Clustering API] Error:", error)
    return NextResponse.json({ error: "Failed to cluster keywords" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const clusters = await getKeywordClusters(30)

    return NextResponse.json({
      success: true,
      clusters: clusters,
    })
  } catch (error) {
    console.error("[Keyword Clustering API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch clusters" }, { status: 500 })
  }
}
