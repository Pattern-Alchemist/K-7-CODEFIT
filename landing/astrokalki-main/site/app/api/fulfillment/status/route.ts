import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const orderId = searchParams.get("id")

    if (!orderId) {
      return NextResponse.json({ error: "Order ID required" }, { status: 400 })
    }

    const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (error) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const { data: reading } = await supabase.from("readings").select("*").eq("order_id", orderId).single()

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        status: order.status,
        service: order.product,
        amount: order.amount,
        currency: order.currency,
        createdAt: order.created_at,
      },
      reading: reading
        ? {
            id: reading.id,
            hasOutput: !!reading.output,
            pdfUrl: reading.pdf_url,
            generatedAt: reading.created_at,
          }
        : null,
    })
  } catch (err) {
    console.error("[FulfillmentStatus] Error:", err)
    return NextResponse.json({ error: "Failed to check status" }, { status: 500 })
  }
}
