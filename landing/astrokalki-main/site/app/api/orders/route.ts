import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const { service, amount, currency, inputs } = await req.json()

    if (!service || !amount) {
      return NextResponse.json({ error: "Missing service or amount" }, { status: 400 })
    }

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        product: service,
        amount,
        currency: currency || "INR",
        channel: "web",
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[Orders] Insert error:", error)
      return NextResponse.json({ error: "Failed to create order" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      order,
    })
  } catch (err) {
    console.error("[Orders] Error:", err)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("id")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      console.error("[Orders] Fetch error:", error)
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, order })
  } catch (err) {
    console.error("[Orders] Error:", err)
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}
