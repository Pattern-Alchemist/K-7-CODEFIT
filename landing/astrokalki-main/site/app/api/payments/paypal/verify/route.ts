import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 })
    }

    // Get PayPal access token
    const tokenResponse = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    const tokenData = await tokenResponse.json()

    if (!tokenData.access_token) {
      return NextResponse.json({ error: "PayPal authentication failed" }, { status: 500 })
    }

    // Capture the PayPal order
    const captureResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
    })

    const captureData = await captureResponse.json()

    if (captureData.status === "COMPLETED") {
      // Record in Supabase
      const { data: order, error: recordError } = await supabase
        .from("orders")
        .insert({
          product: "karmic_snapshot",
          amount: 500, // $5 in cents
          currency: "USD",
          channel: "paypal",
          external_id: orderId,
          status: "paid",
        })
        .select()
        .single()

      if (recordError) {
        console.error("[PayPal Verify] Record error:", recordError)
        return NextResponse.json({ error: "Failed to record payment" }, { status: 500 })
      }

      console.log(`[PayPal] Payment ${orderId} captured and recorded`)

      return NextResponse.json({
        success: true,
        orderId: order.id,
        status: "paid",
      })
    }

    return NextResponse.json({ error: `Capture failed: ${captureData.message}` }, { status: 400 })
  } catch (err) {
    console.error("[PayPal Verify] Error:", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
