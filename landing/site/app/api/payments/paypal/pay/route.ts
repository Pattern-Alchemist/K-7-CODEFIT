import { type NextRequest, NextResponse } from "next/server"
import { initiatePayPalPayment } from "@/lib/paymentGateway"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId } = await req.json()

    if (!amount || amount !== 5) {
      return NextResponse.json({ error: "Invalid amount. Must be $5" }, { status: 400 })
    }

    // Initiate PayPal payment
    const paypalPayment = await initiatePayPalPayment(amount)

    // Record in Supabase orders table if orderId provided
    if (orderId) {
      const { error } = await supabase
        .from("orders")
        .update({
          external_id: paypalPayment.transactionId,
          status: "pending",
        })
        .eq("id", orderId)

      if (error) {
        console.error("[Astrokalki] Order update error:", error)
      }
    }

    return NextResponse.json({
      success: true,
      transactionId: paypalPayment.transactionId,
      paypalEmail: paypalPayment.paypalEmail,
      message: "PayPal initiated. Complete payment on PayPal.",
    })
  } catch (err) {
    console.error("[Astrokalki] PayPal payment error:", err)
    return NextResponse.json({ error: "Failed to initiate PayPal payment" }, { status: 500 })
  }
}
