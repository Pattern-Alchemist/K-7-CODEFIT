import { type NextRequest, NextResponse } from "next/server"
import { createOrder } from "@/lib/order-service"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { service, email, name, channel = "web" } = await req.json()

    if (!service || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get service pricing
    const servicePricing: Record<string, { amount: number; currency: string }> = {
      "flash-k": { amount: 100, currency: "INR" },
      "karma-level": { amount: 1500, currency: "INR" },
      "cosmic-code": { amount: 777, currency: "INR" },
      "karma-release": { amount: 4500, currency: "INR" },
      "moksha-roadmap": { amount: 8888, currency: "INR" },
      "dharma-walk": { amount: 33999, currency: "INR" },
    }

    const pricing = servicePricing[service] || servicePricing["karma-level"]

    // Create order
    const order = await createOrder({
      service,
      amount: pricing.amount,
      currency: pricing.currency,
      channel,
    })

    // Log lead
    if (email) {
      await supabase.from("leads").insert({
        name: name || "Voice User",
        email,
        phone: "via-voice",
        dob: "not-provided",
        birth_location: "not-provided",
        source: channel,
      })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: pricing.amount,
      currency: pricing.currency,
      redirectUrl: `/payment?orderId=${order.id}`,
    })
  } catch (err) {
    console.error("[Checkout] Error:", err)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
