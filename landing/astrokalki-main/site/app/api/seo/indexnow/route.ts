import { type NextRequest, NextResponse } from "next/server"

const INDEXNOW_URL = "https://api.indexnow.org/indexnow"
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "your-indexnow-key"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.astrokalki.com"

interface IndexNowPayload {
  host: string
  key: string
  keyLocation: string
  urlList: string[]
}

export async function POST(request: NextRequest) {
  try {
    const { urls } = (await request.json()) as { urls: string[] }

    if (!urls || urls.length === 0) {
      return NextResponse.json({ error: "urls array required" }, { status: 400 })
    }

    const payload: IndexNowPayload = {
      host: new URL(SITE_URL).hostname,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_URL}/indexnow.txt`,
      urlList: urls,
    }

    const response = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await response.json()

    if (response.ok) {
      console.log(`[SEO] IndexNow: Submitted ${urls.length} URLs for indexing`)
      return NextResponse.json({
        success: true,
        submitted: urls.length,
        indexnowResponse: data,
      })
    }

    return NextResponse.json({ error: "IndexNow submission failed", details: data }, { status: response.status })
  } catch (error) {
    console.error("IndexNow API error:", error)
    return NextResponse.json({ error: "IndexNow submission failed" }, { status: 500 })
  }
}
