"use client"

import { useEffect, useState, useRef } from "react"
import { LiveKitRoom, VideoConference } from "@livekit/components-react"
import "@livekit/components-styles"
import { PhoneOff } from "lucide-react"

interface VoiceSessionProps {
  token: string
  roomName: string
  serverUrl: string
  onSessionEnd?: () => void
}

export function VoiceSession({ token, roomName, serverUrl, onSessionEnd }: VoiceSessionProps) {
  const [transcript, setTranscript] = useState("")
  const [isConnected, setIsConnected] = useState(false)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    // Initialize real-time transcription
    if (typeof window !== "undefined") {
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsConnected(true)
      }

      recognition.onresult = (event: any) => {
        let interimTranscript = ""
        let finalTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript

          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setTranscript(finalTranscript || interimTranscript)
      }

      recognitionRef.current = recognition
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  function endSession() {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    onSessionEnd?.()
  }

  return (
    <div className="h-screen bg-ink text-white flex flex-col">
      {/* LiveKit Room */}
      <div className="flex-1">
        <LiveKitRoom
          video={true}
          audio={true}
          token={token}
          serverUrl={serverUrl}
          data-lk-theme="dark"
          style={{ height: "100%" }}
        >
          <VideoConference />
        </LiveKitRoom>
      </div>

      {/* Transcript Display */}
      {transcript && (
        <div className="p-6 border-t border-white/20 bg-white/5">
          <div className="text-sm text-white/60 mb-2">Real-time Transcript</div>
          <p className="text-lg text-cyan-200">{transcript}</p>
        </div>
      )}

      {/* Controls */}
      <div className="p-6 border-t border-white/20 flex justify-center">
        <button
          onClick={endSession}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors"
        >
          <PhoneOff className="h-5 w-5" />
          End Session
        </button>
      </div>
    </div>
  )
}
