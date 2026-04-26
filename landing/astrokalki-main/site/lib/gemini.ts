import { GoogleGenerativeAI } from "@google/generative-ai"

export async function geminiText(prompt: string) {
  const client = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY! })
  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" })
  const resp = await model.generateContent(prompt)
  return resp.response.text()
}

export async function generateKarmicSnapshot(input: {
  name: string
  dob: string
  tob?: string
  place?: string
  intent?: string
}) {
  const prompt = `You are ASTROKALKI: produce a concise karmic snapshot (<=350 words) with 3 friction points, 3 leverage points, and a 7-day plan of micro-actions. Inputs: ${JSON.stringify(input)}`
  const text = await geminiText(prompt)
  return { text }
}
