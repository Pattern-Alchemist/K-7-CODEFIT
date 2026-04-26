import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: NextRequest) {
  try {
    const { data: orders, error } = await supabase.from("orders").select("*")

    if (error) {
      return NextResponse.json({ error: "Failed to fetch orders" }, { status: 400 })
    }

    // Calculate statistics
    const totalOrders = orders?.length || 0
    const completedOrders = orders?.filter((o) => o.status === "completed").length || 0
    const pendingOrders = orders?.filter((o) => o.status === "pending").length || 0
    const totalRevenue = orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0

    const stats = {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue,
      completionRate: totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0,
      avgOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    }

    return NextResponse.json({ success: true, stats })
  } catch (err) {
    console.error("[AdminStats] Error:", err)
    return NextResponse.json({ error: "Failed to fetch statistics" }, { status: 500 })
  }
}
