import { type NextRequest, NextResponse } from "next/server"
import { processFulfillment } from "@/lib/unified-fulfillment"
import { waitUntil } from "@vercel/functions"

export async function POST(req: NextRequest) {
  try {
    const { orderId, utr, email = "user@example.com", name = "Valued Customer" } = await req.json()

    if (!orderId || !utr) {
      return NextResponse.json({ error: "Missing orderId or UTR" }, { status: 400 })
    }

    console.log(`[Admin] Marking order ${orderId} as paid via UPI (UTR: ${utr})`)

    // Trigger fulfillment asynchronously
    waitUntil(
      processFulfillment({
        orderId,
        email,
        name,
        source: "upi",
        amount: 99,
        currency: "INR",
      }),
    )

    return NextResponse.json({
      success: true,
      message: "Order marked paid. Generating reading now.",
    })
  } catch (error) {
    console.error("[Admin] Error marking paid:", error)
    return NextResponse.json({ error: "Failed to process" }, { status: 500 })
  }
}
