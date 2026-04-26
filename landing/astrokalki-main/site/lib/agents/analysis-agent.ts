import { generateText } from "ai"

export async function analyzeKarmicPattern(userQuestion: string, userProfile: Record<string, any>) {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    console.log("[v0] OPENROUTER_API_KEY is not configured")
    return {
      karmicLesson: "This is a demo response. Configure OPENROUTER_API_KEY for actual readings.",
      surfacePattern: "Demo mode active",
      deeperContext: "API key required for full analysis",
      sevenstepPlan: [{ day: 1, practice: "Configure environment variables", duration: "5 min" }],
      remedies: ["Set up OPENROUTER_API_KEY"],
      opportunityWindow: "After configuration",
      warningSign: "Missing API credentials",
    }
  }

  const systemPrompt = `You are an expert Vedic astrologer and karmic life coach with deep understanding of:
- Astrological patterns and planetary influences
- Numerology and life path meanings
- Karmic cycles and soul lessons
- Practical spiritual remedies

Provide nuanced, compassionate analysis that combines spiritual insight with practical actionable steps.

Return your analysis in this JSON format:
{
  "karmicLesson": "The underlying soul lesson in this situation",
  "surfacePattern": "What the user is experiencing on the surface",
  "deeperContext": "Historical/karmic context from their birth chart",
  "sevenstepPlan": [
    { "day": 1, "practice": "Morning meditation focus", "duration": "10 min" },
    { "day": 2, "practice": "Mantra or affirmation", "text": "I release control..." }
  ],
  "remedies": ["Crystal recommendation", "Mantra", "Lifestyle shift"],
  "opportunityWindow": "Timeframe when breakthroughs are likely",
  "warningSign": "What to watch out for"
}`

  const userPrompt = `User's Question: "${userQuestion}"
User Profile:
- Birth Date: ${userProfile.dob}
- Birth Time: ${userProfile.tob || "unknown"}
- Birth Location: ${userProfile.location}
- Life Area: ${userProfile.lifeArea}
- Current Situation: ${userProfile.context}

Provide deep karmic analysis and a practical 7-step breakthrough plan.`

  try {
    const { text } = await generateText({
      model: "openrouter/auto",
      prompt: userPrompt,
      system: systemPrompt,
      apiKey,
    })

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("No valid JSON in response")
    }

    const analysis = JSON.parse(jsonMatch[0])
    return analysis
  } catch (err) {
    console.error("[AnalysisAgent] Error:", err)
    throw err
  }
}
