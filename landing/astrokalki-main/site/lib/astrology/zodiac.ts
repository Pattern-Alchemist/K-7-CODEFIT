export interface ZodiacSign {
  name: string
  symbol: string
  element: "fire" | "earth" | "air" | "water"
  modality: "cardinal" | "fixed" | "mutable"
  ruling_planet: string
  dates: { start: string; end: string }
}

const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  aries: {
    name: "Aries",
    symbol: "♈",
    element: "fire",
    modality: "cardinal",
    ruling_planet: "Mars",
    dates: { start: "03-21", end: "04-19" },
  },
  taurus: {
    name: "Taurus",
    symbol: "♉",
    element: "earth",
    modality: "fixed",
    ruling_planet: "Venus",
    dates: { start: "04-20", end: "05-20" },
  },
  gemini: {
    name: "Gemini",
    symbol: "♊",
    element: "air",
    modality: "mutable",
    ruling_planet: "Mercury",
    dates: { start: "05-21", end: "06-20" },
  },
  cancer: {
    name: "Cancer",
    symbol: "♋",
    element: "water",
    modality: "cardinal",
    ruling_planet: "Moon",
    dates: { start: "06-21", end: "07-22" },
  },
  leo: {
    name: "Leo",
    symbol: "♌",
    element: "fire",
    modality: "fixed",
    ruling_planet: "Sun",
    dates: { start: "07-23", end: "08-22" },
  },
  virgo: {
    name: "Virgo",
    symbol: "♍",
    element: "earth",
    modality: "mutable",
    ruling_planet: "Mercury",
    dates: { start: "08-23", end: "09-22" },
  },
  libra: {
    name: "Libra",
    symbol: "♎",
    element: "air",
    modality: "cardinal",
    ruling_planet: "Venus",
    dates: { start: "09-23", end: "10-22" },
  },
  scorpio: {
    name: "Scorpio",
    symbol: "♏",
    element: "water",
    modality: "fixed",
    ruling_planet: "Pluto",
    dates: { start: "10-23", end: "11-21" },
  },
  sagittarius: {
    name: "Sagittarius",
    symbol: "♐",
    element: "fire",
    modality: "mutable",
    ruling_planet: "Jupiter",
    dates: { start: "11-22", end: "12-21" },
  },
  capricorn: {
    name: "Capricorn",
    symbol: "♑",
    element: "earth",
    modality: "cardinal",
    ruling_planet: "Saturn",
    dates: { start: "12-22", end: "01-19" },
  },
  aquarius: {
    name: "Aquarius",
    symbol: "♒",
    element: "air",
    modality: "fixed",
    ruling_planet: "Uranus",
    dates: { start: "01-20", end: "02-18" },
  },
  pisces: {
    name: "Pisces",
    symbol: "♓",
    element: "water",
    modality: "mutable",
    ruling_planet: "Neptune",
    dates: { start: "02-19", end: "03-20" },
  },
}

export function getSunSign(dob: string): ZodiacSign | null {
  const date = new Date(dob)
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const monthDay = `${month}-${day}`

  for (const [key, sign] of Object.entries(ZODIAC_SIGNS)) {
    const [startM, startD] = sign.dates.start.split("-")
    const [endM, endD] = sign.dates.end.split("-")

    const start = Number.parseInt(`${startM}${startD}`)
    const end = Number.parseInt(`${endM}${endD}`)
    const current = Number.parseInt(monthDay.replace("-", ""))

    if (current >= start && current <= end) {
      return sign
    }
  }

  return null
}

export function getCompatibility(sign1: ZodiacSign, sign2: ZodiacSign): number {
  let score = 50 // Base score

  // Same element = high compatibility
  if (sign1.element === sign2.element) {
    score += 30
  }

  // Complementary elements (fire-air, earth-water)
  const complementary: Record<string, string[]> = {
    fire: ["air"],
    earth: ["water"],
    air: ["fire"],
    water: ["earth"],
  }

  if (complementary[sign1.element]?.includes(sign2.element)) {
    score += 20
  }

  // Same modality bonus
  if (sign1.modality === sign2.modality) {
    score += 10
  }

  return Math.min(100, Math.max(0, score))
}
