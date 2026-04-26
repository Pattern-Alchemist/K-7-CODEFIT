"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { VoiceSession } from "@/components/voice-session"
import { Loader, AlertCircle } from "lucide-react"

interface LiveKitCredentials {
  token: string
  serverUrl: string
  roomName: string
}

export default function ConsultationRoomPage() {
  const [credentials, setCredentials] = useState<LiveKitCredentials | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const params = useParams()
  const consultationId = params.id as string

  useEffect(() => {
    const initSession = async () => {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Get LiveKit token from API
        const response = await fetch("/api/consultations/room-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ consultationId }),
        })

        if (!response.ok) {
          throw new Error("Failed to get session credentials")
        }

        const data = await response.json()
        setCredentials(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Session initialization failed")
      } finally {
        setLoading(false)
      }
    }

    initSession()
  }, [consultationId, router])

  if (loading) {
    return (
      <div className="h-screen bg-ink flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin text-cyan-300 mx-auto mb-4" />
          <p className="text-white">Connecting to your session...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="h-screen bg-ink flex items-center justify-center p-4">
        <div className="glass glow rounded-2xl p-8 max-w-md w-full">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <h2 className="font-cinzel text-lg font-semibold text-white">Connection Error</h2>
          </div>
          <p className="text-white/70 mb-6">{error}</p>
          <button onClick={() => router.back()} className="btn w-full justify-center">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!credentials) {
    return null
  }

  return (
    <VoiceSession
      token={credentials.token}
      roomName={credentials.roomName}
      serverUrl={credentials.serverUrl}
      onSessionEnd={() => router.push("/consultations")}
    />
  )
}
