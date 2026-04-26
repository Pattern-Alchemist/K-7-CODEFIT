import { type NextRequest, NextResponse } from "next/server"
import { verifyPaypalWebhookSignature } from "@/lib/paypal-webhook"
import { processFulfillment } from "@/lib/unified-fulfillment"
import { waitUntil } from "@vercel/functions"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const body = rawBody ? JSON.parse(rawBody) : {}

    // Verify webhook signature
    const isValid = await verifyPaypalWebhookSignature(req.headers, body)
    if (!isValid) {
      console.warn("[PayPal Webhook] Invalid signature")
      return new NextResponse("Invalid signature", { status: 401 })
    }

    // Handle PAYMENT.CAPTURE.COMPLETED event
    if (body.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = body.resource as any
      const orderId = resource.supplementary_data?.related_ids?.order_id || resource.id || "unknown"
      const payerEmail = resource.payer?.email_address || "noreply@astrokalki.com"

      console.log(`[PayPal Webhook] Processing payment for order ${orderId}`)

      // Trigger fulfillment asynchronously
      waitUntil(
        processFulfillment({
          orderId,
          email: payerEmail,
          source: "paypal",
          amount: 99,
          currency: "USD",
        }),
      )
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[PayPal Webhook] Error:", error)
    return NextResponse.json({ error: "Processing failed" }, { status: 500 })
  }
}
