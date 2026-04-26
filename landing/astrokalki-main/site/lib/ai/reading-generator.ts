import { generateText } from "ai"

export async function generateKarmicReading(inputs: Record<string, any>, service: string) {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    console.log("[v0] OPENROUTER_API_KEY is not configured")
    return getMockReading(inputs, service)
  }

  const prompt = buildKarmicPrompt(inputs, service)

  const { text } = await generateText({
    model: "openrouter/auto", // Auto-selects best available model
    prompt,
    apiKey,
  })

  return text
}

function getMockReading(inputs: Record<string, any>, service: string): string {
  return `Thank you for your interest in ${service}. This is a demo response. To receive actual karmic readings, please configure the OPENROUTER_API_KEY environment variable.`
}

function buildKarmicPrompt(inputs: Record<string, any>, service: string): string {
  const { question, dob, lifeArea, location } = inputs

  const prompts: Record<string, string> = {
    "flash-k": `You are a cosmic guide providing brief, actionable insight.
      
User's Question: ${question}
Life Area: ${lifeArea}
Date of Birth: ${dob}
Location: ${location}

Provide a 3-paragraph response that:
1. Addresses the immediate situation with empathy
2. Reveals the underlying karmic pattern
3. Suggests one concrete action they can take today

Keep it practical, spiritual, and under 200 words.`,

    "karma-level": `You are an expert in karmic analysis and life patterns.
      
User's Question: ${question}
Life Area: ${lifeArea}
Date of Birth: ${dob}
Location: ${location}

Provide a detailed karmic reading that includes:
1. The deeper pattern behind this situation
2. How past actions may have created this present circumstance
3. A 7-step remedy plan for breakthrough
4. Timing and what to watch for in the next 30 days

Format with clear sections and action items.`,

    "moksha-roadmap": `You are a Vedic astrologer creating a 12-18 month roadmap.
      
Date of Birth: ${dob}
Location: ${location}
Life Area: ${lifeArea}

Create a comprehensive roadmap covering:
1. Current planetary influences and what they mean
2. Key turning points in the next 12-18 months
3. Recommended practices (mantra, meditation, ritual)
4. Business/relationship opportunities to watch for
5. Dates to mark for major decisions

Be specific and actionable.`,
  }

  return prompts[service] || prompts["karma-level"]
}
