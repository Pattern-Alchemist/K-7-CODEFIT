import { AccessToken } from "livekit-server-sdk"

export function generateLiveKitToken(options: {
  identity: string
  roomName: string
  canPublish?: boolean
  canPublishData?: boolean
  canSubscribe?: boolean
}) {
  const { identity, roomName, canPublish = true, canPublishData = true, canSubscribe = true } = options

  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET

  if (!apiKey || !apiSecret) {
    throw new Error("LiveKit API credentials not configured")
  }

  const token = new AccessToken(apiKey, apiSecret)
  token.identity = identity
  token.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish,
    canPublishData,
    canSubscribe,
  })

  return token.toJwt()
}
