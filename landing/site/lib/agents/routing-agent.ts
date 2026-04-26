import { generateText } from "ai"

export async function routeUserRequest(userInput: string, metadata: Record<string, any>) {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    console.log("[v0] OPENROUTER_API_KEY is not configured")
    return {
      recommendedService: "karma-level",
      confidence: 0.5,
      reasoning: "Default service - API key not configured",
      lifeArea: "General",
      followUpQuestions: [],
    }
  }

  const systemPrompt = `You are an intelligent routing agent for AstroKalki, a cosmic guidance platform.
  
Based on the user's input, determine which service tier they need:
- "flash-k" (₹100): Quick 1-question answer, 5-10 min voice message
- "karma-level" (₹1,500): 3 questions, 25-30 min call, 7-day follow-up
- "cosmic-code" (₹777): Astrology + numerology, 20 min call, full PDF report
- "karma-release" (₹4,500): Past-present-future deep dive, 45-60 min session
- "moksha-roadmap" (₹8,888): 12-18 month roadmap, 60-75 mins, 2 follow-ups
- "dharma-walk" (₹33,999): 3-month mentorship, ongoing access

Analyze the user's request and recommend the most suitable service.

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "recommendedService": "karma-level",
  "confidence": 0.95,
  "reasoning": "User is asking about relationship patterns and wants actionable guidance",
  "lifeArea": "Relationships",
  "followUpQuestions": ["What is your birth time?", "What location were you born?"]
}

Do NOT include any text outside the JSON object.`

  const userPrompt = `User Request: "${userInput}"
User Metadata: ${JSON.stringify(metadata)}

Determine the best service tier for this user.`

  try {
    const { text } = await generateText({
      model: "openrouter/auto",
      prompt: userPrompt,
      system: systemPrompt,
      apiKey,
    })

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No valid JSON in response")
    }

    const result = JSON.parse(jsonMatch[0])
    return result
  } catch (err) {
    console.error("[RoutingAgent] Error:", err)
    // Fallback to karma-level
    return {
      recommendedService: "karma-level",
      confidence: 0.5,
      reasoning: "Default service due to processing error",
      lifeArea: "General",
      followUpQuestions: [],
    }
  }
}
