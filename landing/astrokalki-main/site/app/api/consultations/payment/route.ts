import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { consultationId, amount, method } = await req.json()

    if (!consultationId || !amount || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get consultation
    const { data: consultation, error: consultError } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", consultationId)
      .eq("user_id", user.id)
      .single()

    if (consultError || !consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 })
    }

    // Route to appropriate payment method
    if (method === "upi") {
      const upiResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/payments/upi/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            phoneNumber: "9211271977", // Default
            orderId: consultationId,
            orderType: "consultation",
          }),
        },
      )

      const upiData = await upiResponse.json()

      // Update consultation with payment intent
      await supabase.from("consultations").update({ payment_status: "initiated" }).eq("id", consultationId)

      return NextResponse.json({
        success: true,
        method: "upi",
        deepLink: upiData.deepLink,
        qrCode: upiData.qrCode,
      })
    } else if (method === "paypal") {
      const paypalResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/payments/paypal/pay`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amount / 100, // Convert to dollars
            orderId: consultationId,
            orderType: "consultation",
          }),
        },
      )

      const paypalData = await paypalResponse.json()

      await supabase.from("consultations").update({ payment_status: "initiated" }).eq("id", consultationId)

      return NextResponse.json({
        success: true,
        method: "paypal",
        approvalUrl: paypalData.approvalUrl,
      })
    }

    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 })
  } catch (err) {
    console.error("[Consultation Payment] Error:", err)
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 })
  }
}
