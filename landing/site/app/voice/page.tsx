"use client"

import { useState } from "react"
import { LiveKitRoom, RoomAudioRenderer, StartAudio } from "@livekit/components-react"
import "@livekit/components-styles"
import Link from "next/link"

export default function VoicePage() {
  const [token, setToken] = useState<string>()
  const [url, setUrl] = useState<string>()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const joinVoiceDemo = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: `guest-${Math.random().toString(36).slice(2, 8)}`,
          room: "kalki-voice-demo",
        }),
      })

      const data = await response.json()

      if (!data.token) {
        throw new Error("Failed to get token")
      }

      setUrl(data.serverUrl)
      setToken(data.token)
    } catch (err) {
      console.error("Error joining voice room:", err)
      setError("Failed to start voice demo. Please try again.")
      setLoading(false)
    }
  }

  if (token && url) {
    return (
      <LiveKitRoom serverUrl={url} token={token} audio video={false} data-lk-theme="default" className="h-screen">
        <main className="h-screen bg-gradient-to-b from-slate-950 to-black text-white flex flex-col items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="text-teal-500 text-sm font-mono tracking-widest mb-2">ASTROKALKI VOICE</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Connected & Listening</h1>
            <p className="text-gray-400 mb-8">You have 60 seconds. Speak your question to Kalki.</p>

            <StartAudio label="Enable Audio" className="w-full mb-6" />
            <RoomAudioRenderer />

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-300 mb-4">
                After your demo, upgrade to receive a complete ₹99 karmic reading with audio, PDF, and 7-day guidance.
              </p>
              <Link
                href="/checkout"
                className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
              >
                Get Full Reading for ₹99
              </Link>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition"
            >
              Disconnect
            </button>
          </div>
        </main>
      </LiveKitRoom>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="text-teal-500 text-sm font-mono tracking-widest mb-4">ASTROKALKI VOICE</div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Talk to Kalki</h1>
        <p className="text-gray-400 text-lg mb-4">
          Free 60-second voice demo. Then upgrade for your complete ₹99 karmic reading.
        </p>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 mb-6">
          <ul className="text-left space-y-3 text-sm">
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">✓</span>
              <span>Speak your question directly to Kalki</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">✓</span>
              <span>Get instant voice response</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">✓</span>
              <span>Limited to 60 seconds</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-400 mr-3">✓</span>
              <span>No payment required</span>
            </li>
          </ul>
        </div>

        <button
          onClick={joinVoiceDemo}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition mb-4"
        >
          {loading ? "Connecting..." : "Start Voice Demo"}
        </button>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <Link
          href="/checkout"
          className="block w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
        >
          Skip Demo → Buy ₹99 Reading
        </Link>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Full reading includes audio MP3, formatted PDF, and 7 actionable steps</p>
        </div>
      </div>
    </main>
  )
}
