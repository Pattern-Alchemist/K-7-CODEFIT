"use client"

import { useState } from "react"
import { Send, Loader } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function AgentChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Welcome to AstroKalki. What brings you here today? Share your question or situation.",
      timestamp: new Date(),
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSendMessage() {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Step 1: Route the request through agent
      const routeResponse = await fetch("/api/agents/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userInput: input,
          metadata: {},
        }),
      })

      const routeData = await routeResponse.json()

      if (!routeResponse.ok) {
        throw new Error(routeData.error)
      }

      const { recommendedService, lifeArea } = routeData.routing

      // Step 2: Perform deep analysis
      const analysisResponse = await fetch("/api/agents/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userQuestion: input,
          userProfile: { lifeArea },
          service: recommendedService,
        }),
      })

      const analysisData = await analysisResponse.json()

      if (!analysisResponse.ok) {
        throw new Error(analysisData.error)
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: analysisData.formattedResponse,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      console.error("[AgentChat] Error:", err)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "I encountered an issue. Please try again.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-ink text-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === "user" ? "bg-cyan-500/20 border border-cyan-400" : "bg-white/10 border border-white/20"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Share your question..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-black rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
