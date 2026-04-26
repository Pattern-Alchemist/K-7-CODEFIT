import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const { utr } = await req.json()

    if (!utr) {
      return NextResponse.json({ error: "UTR required" }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        product: "karmic_snapshot",
        amount: 9900,
        currency: "INR",
        channel: "upi",
        external_id: utr,
        status: "paid",
      })
      .select()
      .single()

    if (error) {
      console.error("[UPI Verify] Error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ order_id: order.id })
  } catch (err) {
    console.error("[UPI Verify] Error:", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
