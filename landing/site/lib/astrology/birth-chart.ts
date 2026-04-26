export interface BirthChart {
  sun_sign: string
  moon_sign_estimate: string
  rising_sign_estimate: string
  mercury_sign: string
  venus_sign: string
  mars_sign: string
  jupiter_sign: string
  life_path: number
  personal_year: number
  karmic_challenges: string[]
  karmic_gifts: string[]
}

export function generateBirthChartInterpretation(dob: string, tob?: string, location?: string): BirthChart {
  const date = new Date(dob)

  // Simplified calculations (for full accuracy, use Swiss Ephemeris)
  const sunSign = calculateSunSign(dob)
  const moonSign = estimateMoonSign(dob, tob)
  const risingSign = estimateRisingSign(dob, tob, location)
  const lifePathNum = calculateLifePath(dob).number

  const personalYear = calculatePersonalYear(dob)

  // Determine karmic themes based on birth data
  const karmicChallenges = determineKarmicChallenges(sunSign, moonSign, lifePathNum)
  const karmicGifts = determineKarmicGifts(sunSign, lifePathNum)

  return {
    sun_sign: sunSign,
    moon_sign_estimate: moonSign,
    rising_sign_estimate: risingSign,
    mercury_sign: estimatePlanetSign(dob, "mercury"),
    venus_sign: estimatePlanetSign(dob, "venus"),
    mars_sign: estimatePlanetSign(dob, "mars"),
    jupiter_sign: estimatePlanetSign(dob, "jupiter"),
    life_path: lifePathNum,
    personal_year: personalYear,
    karmic_challenges: karmicChallenges,
    karmic_gifts: karmicGifts,
  }
}

function calculateSunSign(dob: string): string {
  const date = new Date(dob)
  const month = date.getMonth() + 1
  const day = date.getDate()

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
    const [startM, startD] = sign.start
    const [endM, endD] = sign.end
    if ((month === startM && day >= startD) || (month === endM && day <= endD)) {
      return sign.name
    }
  }

  return "Unknown"
}

function estimateMoonSign(dob: string, tob?: string): string {
  const date = new Date(dob)
  const moonCycle = (date.getTime() / (29.5 * 24 * 60 * 60 * 1000)) % 1
  const moonPhase = Math.floor(moonCycle * 12)

  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]

  return signs[moonPhase]
}

function estimateRisingSign(dob: string, tob?: string, location?: string): string {
  // Simplified: use birth time hour to estimate
  const date = new Date(dob)
  const hour = tob ? Number.parseInt(tob.split(":")[0]) : date.getHours()

  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]

  return signs[hour % 12]
}

function estimatePlanetSign(dob: string, planet: string): string {
  const signs = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]

  const date = new Date(dob)
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000))

  const planetOffsets: Record<string, number> = {
    mercury: 1,
    venus: 2,
    mars: 3,
    jupiter: 4,
  }

  const offset = planetOffsets[planet] || 0
  return signs[(dayOfYear + offset) % 12]
}

function determineKarmicChallenges(sunSign: string, moonSign: string, lifePathNum: number): string[] {
  const challenges: Record<number, string[]> = {
    1: ["Learning collaboration", "Avoiding impatience"],
    2: ["Building self-confidence", "Making decisions"],
    3: ["Focus and completion", "Expressing vulnerability"],
    4: ["Flexibility and adaptability", "Accepting change"],
    5: ["Commitment and stability", "Channeling restlessness"],
    6: ["Setting boundaries", "Letting go of control"],
    7: ["Trusting intuition", "Balancing logic and feeling"],
    8: ["Ethical use of power", "Balancing material and spiritual"],
    9: ["Releasing and forgiveness", "Universal compassion"],
  }

  return challenges[lifePathNum] || ["Personal growth", "Self-discovery"]
}

function determineKarmicGifts(sunSign: string, lifePathNum: number): string[] {
  const gifts: Record<number, string[]> = {
    1: ["Natural leadership", "Pioneering spirit", "Courage"],
    2: ["Intuition", "Empathy", "Diplomacy"],
    3: ["Creativity", "Communication", "Joy"],
    4: ["Stability", "Reliability", "Organization"],
    5: ["Adaptability", "Curiosity", "Freedom"],
    6: ["Nurturing", "Responsibility", "Healing"],
    7: ["Wisdom", "Spirituality", "Analysis"],
    8: ["Manifestation", "Abundance", "Vision"],
    9: ["Compassion", "Wisdom", "Transformation"],
  }

  return gifts[lifePathNum] || ["Growth potential", "Unique gifts"]
}

function calculateLifePath(dob: string): { number: number } {
  const date = new Date(dob)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  let sum = year + month + day
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = String(sum)
      .split("")
      .reduce((acc, digit) => acc + Number.parseInt(digit), 0)
  }

  return { number: sum }
}

function calculatePersonalYear(dob: string): number {
  const date = new Date(dob)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = new Date().getFullYear()

  let sum = month + day + year
  while (sum > 9) {
    sum = String(sum)
      .split("")
      .reduce((acc, digit) => acc + Number.parseInt(digit), 0)
  }

  return sum
}
