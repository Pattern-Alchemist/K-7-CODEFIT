import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { consultationId, paymentId, status } = await req.json()

    if (!consultationId || !paymentId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update consultation payment status
    const { error } = await supabase
      .from("consultations")
      .update({
        payment_status: status === "success" ? "completed" : "failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", consultationId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: `Payment ${status}`,
    })
  } catch (err) {
    console.error("[Verify Consultation Payment] Error:", err)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
