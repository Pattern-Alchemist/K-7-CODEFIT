import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateLiveKitToken } from "@/lib/livekit"

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

    const { consultationId } = await req.json()

    if (!consultationId) {
      return NextResponse.json({ error: "Consultation ID required" }, { status: 400 })
    }

    // Get consultation details
    const { data: consultation, error: consultError } = await supabase
      .from("consultations")
      .select("*")
      .eq("id", consultationId)
      .single()

    if (consultError || !consultation) {
      return NextResponse.json({ error: "Consultation not found" }, { status: 404 })
    }

    // Generate token
    const token = generateLiveKitToken({
      identity: user.id,
      roomName: consultation.room_name,
      canPublish: true,
      canSubscribe: true,
    })

    return NextResponse.json({
      success: true,
      token,
      serverUrl: process.env.LIVEKIT_SERVER_URL,
      roomName: consultation.room_name,
    })
  } catch (err) {
    console.error("[Room Token] Error:", err)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
