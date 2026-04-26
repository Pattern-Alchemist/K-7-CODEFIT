export function calculateLifePath(dob: string): { number: number; meaning: string } {
  const date = new Date(dob)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const lifePathNumber = reduceToSingleDigit(year + month + day)

  const meanings: Record<number, string> = {
    1: "The Leader - Independence, innovation, and determination",
    2: "The Mediator - Sensitivity, diplomacy, and partnership",
    3: "The Creative - Expression, inspiration, and growth",
    4: "The Builder - Stability, practicality, and hard work",
    5: "The Freedom Seeker - Adventure, versatility, and change",
    6: "The Nurturer - Responsibility, compassion, and service",
    7: "The Seeker - Introspection, analysis, and spirituality",
    8: "The Achiever - Power, ambition, and material success",
    9: "The Humanitarian - Compassion, wisdom, and completion",
    11: "The Illuminator - Intuition, idealism, and enlightenment",
    22: "The Master Builder - Vision, inspiration, and achievement",
  }

  return {
    number: lifePathNumber,
    meaning: meanings[lifePathNumber] || "Unknown path",
  }
}

export function calculateDestinyNumber(fullName: string): { number: number; meaning: string } {
  const value = sumLetterValues(fullName)
  const destinyNumber = reduceToSingleDigit(value)

  const meanings: Record<number, string> = {
    1: "Leadership and innovation in your life's purpose",
    2: "Balance and harmony in relationships",
    3: "Creative expression and communication",
    4: "Building solid foundations",
    5: "Freedom and exploration",
    6: "Service and healing",
    7: "Spiritual growth and wisdom",
    8: "Material manifestation and success",
    9: "Global impact and completion",
  }

  return {
    number: destinyNumber,
    meaning: meanings[destinyNumber] || "Unknown destiny",
  }
}

export function calculatePersonalYear(dob: string, year: number = new Date().getFullYear()): number {
  const date = new Date(dob)
  const month = date.getMonth() + 1
  const day = date.getDate()

  return reduceToSingleDigit(month + day + year)
}

function reduceToSingleDigit(num: number): number {
  let n = num
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n)
      .split("")
      .reduce((acc, digit) => acc + Number.parseInt(digit), 0)
  }
  return n
}

function sumLetterValues(text: string): number {
  const letters = text.toUpperCase().replace(/[^A-Z]/g, "")
  return letters.split("").reduce((sum, letter) => {
    return sum + (letter.charCodeAt(0) - 64)
  }, 0)
}
