import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import crypto from "crypto"

// Webhook signature verification
function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const hash = crypto.createHmac("sha256", secret).update(payload).digest("hex")
  return hash === signature
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get("x-webhook-signature") || ""
    const webhookSecret = process.env.WEBHOOK_SECRET || "dev-secret"

    // Verify webhook signature
    if (!verifyWebhookSignature(body, signature, webhookSecret)) {
      console.warn("[Webhook] Invalid signature for order confirmation")
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }

    const payload = JSON.parse(body)

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: "paid",
        external_id: payload.transactionId,
      })
      .eq("id", payload.orderId)
      .select()
      .single()

    if (error) {
      console.error("[Webhook] Order update error:", error)
      return NextResponse.json({ error: "Order update failed" }, { status: 400 })
    }

    // Queue the reading generation job
    console.log(`[Webhook] Order ${payload.orderId} confirmed. Queuing reading generation...`)

    return NextResponse.json({
      success: true,
      orderId: order?.id,
      status: "paid",
    })
  } catch (err) {
    console.error("[Webhook] Order confirmation error:", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
