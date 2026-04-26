import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    // Check if user is authenticated
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { planId } = await req.json()

    if (!planId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get plan details
    const { data: plan, error: planError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("id", planId)
      .single()

    if (planError || !plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 404 })
    }

    // Stripe subscription functionality removed (not needed - using one-time payments only)

    return NextResponse.json({ error: "Stripe subscription functionality removed" }, { status: 501 })
  } catch (error) {
    console.error("[v0] Error creating checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
