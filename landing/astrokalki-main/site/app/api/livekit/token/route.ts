import { type NextRequest, NextResponse } from "next/server"
import { generateLiveKitToken } from "@/lib/livekit"

export async function POST(req: NextRequest) {
  try {
    const { orderId, userEmail, roomName } = await req.json()

    if (!orderId || !userEmail) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const token = generateLiveKitToken({
      identity: userEmail,
      roomName: roomName || `session-${orderId}`,
      canPublish: true,
      canSubscribe: true,
    })

    return NextResponse.json({
      success: true,
      token,
      roomName: roomName || `session-${orderId}`,
      serverUrl: process.env.LIVEKIT_SERVER_URL || "wss://livekit.example.com",
    })
  } catch (err) {
    console.error("[LiveKit] Token generation error:", err)
    return NextResponse.json({ error: "Failed to generate token" }, { status: 500 })
  }
}
