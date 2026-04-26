import { type NextRequest, NextResponse } from "next/server"
import { initiateUPIPayment } from "@/lib/paymentGateway"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const { amount, phoneNumber, orderId } = await req.json()

    if (!amount || amount !== 99) {
      return NextResponse.json({ error: "Invalid amount. Must be ₹99" }, { status: 400 })
    }

    // Initiate UPI payment
    const upiPayment = await initiateUPIPayment(phoneNumber, amount * 100) // Convert to paise

    // Record in Supabase orders table if orderId provided
    if (orderId) {
      const { error } = await supabase
        .from("orders")
        .update({
          external_id: upiPayment.transactionId,
          status: "pending",
        })
        .eq("id", orderId)

      if (error) {
        console.error("[Astrokalki] Order update error:", error)
      }
    }

    return NextResponse.json({
      success: true,
      transactionId: upiPayment.transactionId,
      deepLink: upiPayment.deepLink,
      message: "UPI link generated. Use any UPI app to complete payment.",
    })
  } catch (err) {
    console.error("[Astrokalki] UPI payment error:", err)
    return NextResponse.json({ error: "Failed to initiate UPI payment" }, { status: 500 })
  }
}
