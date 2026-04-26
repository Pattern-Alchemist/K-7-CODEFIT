import { type NextRequest, NextResponse } from "next/server"

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

if (!OPENROUTER_API_KEY) {
  console.warn("[v0] OPENROUTER_API_KEY is not configured")
}

export async function POST(request: NextRequest) {
  try {
    const { messages, model = "openrouter/auto", systemPrompt } = await request.json()

    if (!OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OPENROUTER_API_KEY is not configured" }, { status: 500 })
    }

    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": typeof window !== "undefined" ? window.location.origin : "https://astrokalki.com",
        "X-Title": "AstroKalki Cosmic Tools",
      },
      body: JSON.stringify({
        model,
        messages: [...(systemPrompt ? [{ role: "system", content: systemPrompt }] : []), ...messages],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] OpenRouter API error:", error)
      return NextResponse.json({ error: error.error?.message || "OpenRouter API error" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json({
      success: true,
      content: data.choices[0].message.content,
      model: data.model,
    })
  } catch (error) {
    console.error("[v0] OpenRouter error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}
