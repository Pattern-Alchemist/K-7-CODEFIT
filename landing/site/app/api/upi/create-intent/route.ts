import { type NextRequest, NextResponse } from "next/server"
import { buildUpiUri, toQrSvg } from "@/lib/upi"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { amount = 99, note = "AstroKalki ₹99 Reading" } = await req.json()

    const orderId = `AK-${randomUUID().slice(0, 8)}`
    const vpa = process.env.UPI_VPA || "astrokalki@okaxis"
    const payeeName = process.env.UPI_PAYEE_NAME || "AstroKalki"

    const upiUri = buildUpiUri({
      vpa,
      name: payeeName,
      amount,
      note,
      orderId,
    })

    const qrSvg = await toQrSvg(upiUri)

    // TODO: Persist pending order in Supabase with orderId for later verification
    console.log(`[UPI] Created intent for order ${orderId}`)

    return NextResponse.json({
      success: true,
      orderId,
      upiUri,
      qrSvg,
      amount,
      currency: "INR",
    })
  } catch (error) {
    console.error("[UPI] Error creating intent:", error)
    return NextResponse.json({ error: "Failed to create UPI intent" }, { status: 500 })
  }
}
