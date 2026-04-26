import { type NextRequest, NextResponse } from "next/server"
import { orchestrateFulfillment } from "@/lib/fulfillment/orchestrator"

export async function POST(req: NextRequest) {
  try {
    const { orderId, email, name, service, pdfUrl, audioUrl, readingText } = await req.json()

    if (!orderId || !email || !readingText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const result = await orchestrateFulfillment({
      orderId,
      email,
      name: name || "Cosmic Seeker",
      service: service || "karma-level",
      pdfUrl,
      audioUrl,
      readingText,
    })

    return NextResponse.json({
      success: true,
      result,
    })
  } catch (err) {
    console.error("[Fulfillment] API error:", err)
    return NextResponse.json({ error: "Fulfillment failed" }, { status: 500 })
  }
}
