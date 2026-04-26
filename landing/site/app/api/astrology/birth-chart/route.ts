import { type NextRequest, NextResponse } from "next/server"
import { generateBirthChartInterpretation } from "@/lib/astrology/birth-chart"

export async function POST(req: NextRequest) {
  try {
    const { dob, tob, location } = await req.json()

    if (!dob) {
      return NextResponse.json({ error: "Date of birth required" }, { status: 400 })
    }

    const chart = generateBirthChartInterpretation(dob, tob, location)

    return NextResponse.json({
      success: true,
      chart,
      interpretation: `
Sun Sign: ${chart.sun_sign}
Moon Sign (estimated): ${chart.moon_sign_estimate}
Rising Sign (estimated): ${chart.rising_sign_estimate}

Life Path Number: ${chart.life_path}
Personal Year: ${chart.personal_year}

Karmic Challenges: ${chart.karmic_challenges.join(", ")}
Karmic Gifts: ${chart.karmic_gifts.join(", ")}

Note: This is a simplified birth chart. For complete accuracy with exact house positions and aspects, consult a professional astrologer with your precise birth time and location.
      `,
    })
  } catch (err) {
    console.error("[BirthChart] Error:", err)
    return NextResponse.json({ error: "Failed to generate birth chart" }, { status: 500 })
  }
}
