import { type NextRequest, NextResponse } from "next/server"
import { getSunSign, getCompatibility } from "@/lib/astrology/zodiac"

export async function POST(req: NextRequest) {
  try {
    const { dob1, dob2 } = await req.json()

    if (!dob1 || !dob2) {
      return NextResponse.json({ error: "Both dates of birth required" }, { status: 400 })
    }

    const sign1 = getSunSign(dob1)
    const sign2 = getSunSign(dob2)

    if (!sign1 || !sign2) {
      return NextResponse.json({ error: "Invalid date of birth" }, { status: 400 })
    }

    const compatibility = getCompatibility(sign1, sign2)

    return NextResponse.json({
      success: true,
      person1: {
        sign: sign1.name,
        symbol: sign1.symbol,
        element: sign1.element,
        ruling_planet: sign1.ruling_planet,
      },
      person2: {
        sign: sign2.name,
        symbol: sign2.symbol,
        element: sign2.element,
        ruling_planet: sign2.ruling_planet,
      },
      compatibility_score: compatibility,
      compatibility_level: getCompatibilityLevel(compatibility),
    })
  } catch (err) {
    console.error("[Compatibility] Error:", err)
    return NextResponse.json({ error: "Failed to calculate compatibility" }, { status: 500 })
  }
}

function getCompatibilityLevel(score: number): string {
  if (score >= 80) return "Highly Compatible"
  if (score >= 60) return "Compatible"
  if (score >= 40) return "Moderately Compatible"
  return "Challenging"
}
