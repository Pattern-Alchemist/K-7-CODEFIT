"use client"

import { useState } from "react"
import { Mic, Phone } from "lucide-react"

export function VoiceEntryPoint() {
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function startVoiceSession() {
    setIsLoading(true)
    setIsRecording(true)

    try {
      // Initialize Web Speech API for voice capture
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)()
      recognition.continuous = false
      recognition.interimResults = false
      recognition.lang = "en-US"

      recognition.onstart = () => {
        console.log("[VoiceEntry] Recording started")
      }

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join("")

        console.log("[VoiceEntry] Transcript:", transcript)
        setTranscript(transcript)

        // Route through agent after voice capture
        routeVoiceInput(transcript)
      }

      recognition.onerror = (event: any) => {
        console.error("[VoiceEntry] Recording error:", event.error)
        setIsRecording(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
        setIsLoading(false)
      }

      recognition.start()
    } catch (err) {
      console.error("[VoiceEntry] Setup error:", err)
      setIsLoading(false)
      setIsRecording(false)
    }
  }

  async function routeVoiceInput(input: string) {
    try {
      const response = await fetch("/api/agents/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: input,
          metadata: { channel: "voice" },
        }),
      })

      const data = await response.json()
      console.log("[VoiceEntry] Routing result:", data)

      // Redirect to checkout with recommended service
      const { recommendedService } = data.routing
      window.location.href = `/checkout?service=${recommendedService}`
    } catch (err) {
      console.error("[VoiceEntry] Routing error:", err)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-cyan-500/10 via-ink to-fuchsia-500/10 flex items-center justify-center p-4 z-40">
      <div className="bg-ink border border-cyan-400/30 rounded-3xl p-8 max-w-md w-full text-center glass glow">
        <div className="mb-6">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20 border border-cyan-400">
            {isRecording ? (
              <div className="animate-pulse">
                <Mic className="h-8 w-8 text-cyan-400" />
              </div>
            ) : (
              <Mic className="h-8 w-8 text-cyan-300" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-2">Voice Portal</h2>
        <p className="text-white/70 mb-6">Speak your question. Let the cosmos listen.</p>

        {transcript && (
          <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-sm text-white/80 italic">"{transcript}"</p>
          </div>
        )}

        <button
          onClick={startVoiceSession}
          disabled={isLoading || isRecording}
          className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isRecording
              ? "bg-red-500 text-white animate-pulse"
              : "bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-600 hover:to-teal-600"
          }`}
        >
          {isRecording ? (
            <>
              <Phone className="h-5 w-5 animate-spin" />
              Recording...
            </>
          ) : (
            <>
              <Mic className="h-5 w-5" />
              Start Voice Session
            </>
          )}
        </button>

        <p className="mt-4 text-xs text-white/50">Chrome, Firefox, and Safari supported</p>
      </div>
    </div>
  )
}
