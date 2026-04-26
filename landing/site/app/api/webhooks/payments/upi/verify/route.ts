import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const { transactionId, status, amount, orderId } = await req.json()

    if (!transactionId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update order status based on payment verification
    const orderStatus = status === "success" || status === "completed" ? "paid" : "failed"

    const { data: order, error } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        external_id: transactionId,
      })
      .eq("id", orderId)
      .select()
      .single()

    if (error) {
      console.error("[UPI Webhook] Order update error:", error)
      return NextResponse.json({ error: "Order update failed" }, { status: 400 })
    }

    console.log(`[UPI Webhook] Order ${orderId} status: ${orderStatus}`)

    return NextResponse.json({
      success: true,
      orderId: order?.id,
      status: orderStatus,
    })
  } catch (err) {
    console.error("[UPI Webhook] Verification error:", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
