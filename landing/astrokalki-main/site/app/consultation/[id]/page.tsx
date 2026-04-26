"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"

export default function ConsultationPage() {
  const params = useParams()
  const consultationId = params.id as string
  const [token, setToken] = useState("")
  const [serverUrl, setServerUrl] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const getToken = async () => {
      try {
        const response = await fetch("/api/consultations/room-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ consultationId }),
        })

        const data = await response.json()

        if (data.success) {
          setToken(data.token)
          setServerUrl(data.serverUrl)
        } else {
          setError(data.error)
        }
      } catch (err) {
        setError("Failed to load consultation room")
      } finally {
        setLoading(false)
      }
    }

    getToken()
  }, [consultationId])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ink text-white">
        Loading consultation room...
      </div>
    )
  }

  if (error || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ink text-white">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink">
      <LiveKitRoom video={true} audio={true} token={token} serverUrl={serverUrl} data-lk-theme="dark">
        <VideoConference />
      </LiveKitRoom>
    </div>
  )
}
