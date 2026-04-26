import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("consultations")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, consultations: data })
  } catch (err) {
    console.error("[Consultations List] Error:", err)
    return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
  }
}
