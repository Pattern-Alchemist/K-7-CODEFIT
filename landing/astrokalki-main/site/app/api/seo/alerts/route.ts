import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabase
      .from("seo_alerts")
      .select("*")
      .eq("resolved", false)
      .order("severity", { ascending: false })
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[Alerts API] Error:", error)
      return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      alerts: data,
    })
  } catch (error) {
    console.error("[Alerts API] Error:", error)
    return NextResponse.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { alertType, severity, description, affectedUrl, recommendedAction } = await req.json()

    const { data, error } = await supabase
      .from("seo_alerts")
      .insert({
        alert_type: alertType,
        severity,
        description,
        affected_url: affectedUrl,
        recommended_action: recommendedAction,
      })
      .select()
      .single()

    if (error) {
      console.error("[Alerts API] Error:", error)
      return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      alert: data,
    })
  } catch (error) {
    console.error("[Alerts API] Error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}
