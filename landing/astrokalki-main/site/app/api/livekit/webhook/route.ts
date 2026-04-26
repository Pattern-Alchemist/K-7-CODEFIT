import { type NextRequest, NextResponse } from "next/server"
import { WebhookReceiver } from "livekit-server-sdk"
import { supabase } from "@/lib/supabaseClient"

const receiver = new WebhookReceiver(process.env.LIVEKIT_API_KEY || "", process.env.LIVEKIT_API_SECRET || "")

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const event = receiver.receive(body, req.headers.get("authorization") || "")

    console.log("[LiveKitWebhook] Event type:", event.event)

    switch (event.event) {
      case "participant_joined":
        console.log(`[LiveKit] User joined: ${event.createdParticipant?.identity}`)
        break

      case "participant_left":
        console.log(`[LiveKit] User left: ${event.createdParticipant?.identity}`)
        // Log session analytics to Supabase
        await logSessionEvent({
          type: "participant_left",
          userId: event.createdParticipant?.identity,
          roomName: event.room?.name,
          duration: event.createdParticipant?.duration || 0,
        })
        break

      case "recording_finished":
        console.log("[LiveKit] Recording finished")
        await logSessionEvent({
          type: "recording_finished",
          roomName: event.room?.name,
          recordingUrl: event.recordingFinished?.downloadUrl,
        })
        break
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[LiveKitWebhook] Error:", err)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}

async function logSessionEvent(data: any) {
  try {
    await supabase.from("voice_sessions").insert({
      event_type: data.type,
      user_id: data.userId,
      room_name: data.roomName,
      metadata: data,
      created_at: new Date().toISOString(),
    })
  } catch (err) {
    console.error("[VoiceSession] Logging error:", err)
  }
}
