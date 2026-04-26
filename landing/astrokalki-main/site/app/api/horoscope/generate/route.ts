import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dob, tob, location, question } = body

    if (!dob || !location) {
      return NextResponse.json({ error: "Date of birth and location are required" }, { status: 400 })
    }

    // Parse birth details
    const birthDate = new Date(dob)
    const birthYear = birthDate.getFullYear()
    const birthMonth = birthDate.toLocaleString("en-US", { month: "long" })
    const birthDay = birthDate.getDate()

    // Calculate zodiac sign
    const zodiacSign = getZodiacSign(birthDate.getMonth() + 1, birthDay)

    // Calculate life path number (numerology)
    const lifePathNumber = calculateLifePathNumber(birthDate)

    // Generate personalized horoscope using AI
    const prompt = `You are an expert Vedic astrologer and spiritual guide. Generate a personalized, insightful horoscope reading.

Birth Details:
- Date: ${birthMonth} ${birthDay}, ${birthYear}
- Time: ${tob || "Not provided"}
- Location: ${location}
- Zodiac Sign: ${zodiacSign}
- Life Path Number: ${lifePathNumber}
${question ? `- Specific Question: ${question}` : ""}

Provide a comprehensive yet concise reading (200-300 words) that includes:
1. Current cosmic influences and planetary transits affecting them today
2. Personalized guidance based on their birth chart
3. One specific actionable insight or remedy they can apply immediately
4. A lucky color or element for the day
5. Brief career, love, or health insight if relevant to their question

Write in a mystical yet practical tone. Be specific and avoid generic statements. Focus on empowerment and clarity.`

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.8,
      maxTokens: 500,
    })

    return NextResponse.json({
      success: true,
      horoscope: text,
      metadata: {
        zodiacSign,
        lifePathNumber,
        birthDate: birthDate.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error generating horoscope:", error)
    return NextResponse.json({ error: "Failed to generate horoscope" }, { status: 500 })
  }
}

function getZodiacSign(month: number, day: number): string {
  const signs = [
    { name: "Capricorn", start: [12, 22], end: [1, 19] },
    { name: "Aquarius", start: [1, 20], end: [2, 18] },
    { name: "Pisces", start: [2, 19], end: [3, 20] },
    { name: "Aries", start: [3, 21], end: [4, 19] },
    { name: "Taurus", start: [4, 20], end: [5, 20] },
    { name: "Gemini", start: [5, 21], end: [6, 20] },
    { name: "Cancer", start: [6, 21], end: [7, 22] },
    { name: "Leo", start: [7, 23], end: [8, 22] },
    { name: "Virgo", start: [8, 23], end: [9, 22] },
    { name: "Libra", start: [9, 23], end: [10, 22] },
    { name: "Scorpio", start: [10, 23], end: [11, 21] },
    { name: "Sagittarius", start: [11, 22], end: [12, 21] },
  ]

  for (const sign of signs) {
    const [startMonth, startDay] = sign.start
    const [endMonth, endDay] = sign.end

    if ((month === startMonth && day >= startDay) || (month === endMonth && day <= endDay)) {
      return sign.name
    }
  }

  return "Capricorn"
}

function calculateLifePathNumber(date: Date): number {
  const dateString = date.toISOString().split("T")[0].replace(/-/g, "")
  let sum = 0

  for (const char of dateString) {
    sum += Number.parseInt(char, 10)
  }

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum
      .toString()
      .split("")
      .reduce((acc, digit) => acc + Number.parseInt(digit, 10), 0)
  }

  return sum
}
