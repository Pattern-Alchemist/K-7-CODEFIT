import { supabase } from "@/lib/supabaseClient"

export async function verifyUPIPayment(transactionId: string, utr: string) {
  try {
    // In production, verify with UPI gateway (Razorpay, PhonePe, etc.)
    // For now, accept UTR as proof of payment
    if (!utr || utr.length < 10) {
      return { success: false, error: "Invalid UTR format" }
    }

    // Record payment in Supabase
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "paid", external_id: utr, updated_at: new Date().toISOString() })
      .eq("external_id", transactionId)
      .select()
      .single()

    if (error) {
      console.error("[UPI Verification] Database error:", error)
      return { success: false, error: "Failed to verify payment" }
    }

    return { success: true, orderId: data?.id }
  } catch (err) {
    console.error("[UPI Verification] Error:", err)
    return { success: false, error: "Payment verification failed" }
  }
}

export async function verifyPayPalPayment(paypalOrderId: string) {
  try {
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
      return { success: false, error: "Failed to authenticate with PayPal" }
    }

    // Get order details from PayPal
    const orderResponse = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${paypalOrderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
    })

    const orderData = await orderResponse.json()

    if (orderData.status === "APPROVED" || orderData.status === "COMPLETED") {
      // Record in Supabase
      const { data, error } = await supabase
        .from("orders")
        .update({ status: "paid", external_id: paypalOrderId, updated_at: new Date().toISOString() })
        .eq("external_id", paypalOrderId)
        .select()
        .single()

      if (error) {
        console.error("[PayPal Verification] Database error:", error)
        return { success: false, error: "Failed to record payment" }
      }

      return { success: true, orderId: data?.id }
    }

    return { success: false, error: `Order status: ${orderData.status}` }
  } catch (err) {
    console.error("[PayPal Verification] Error:", err)
    return { success: false, error: "Payment verification failed" }
  }
}
