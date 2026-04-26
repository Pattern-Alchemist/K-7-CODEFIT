import OpenAI from "openai"
import path from "node:path"
import fs from "node:fs/promises"

let client: OpenAI | null = null

function getClient(): OpenAI {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return client
}

function getPublicBase(): string {
  return (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true })
}

export async function textToMp3(text: string): Promise<{ url: string; path: string }> {
  const openaiClient = getClient()
  const response = await openaiClient.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: text,
  })

  const buffer = Buffer.from(await response.arrayBuffer())
  const relativePath = `/assets/audio/${Date.now()}-${Math.random().toString(36).slice(2)}.mp3`
  const absolutePath = path.join(process.cwd(), "public", relativePath)

  await ensureDir(path.dirname(absolutePath))
  await fs.writeFile(absolutePath, buffer)

  return { url: getPublicBase() + relativePath, path: absolutePath }
}

export async function composeReadingText(profile: {
  name: string
  dob?: string
  tob?: string
  place?: string
}): Promise<string> {
  const prompt = `Write a 250-300 word calm, ethical karmic reading for:
${JSON.stringify(profile, null, 2)}
Focus on:
- Avoid medical/legal/financial claims
- Offer 2-3 grounded actions for the next 7 days
- Use warm, supportive tone
- Keep reading concise and actionable`

  const openaiClient = getClient()
  const response = await openaiClient.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1024,
    messages: [{ role: "user", content: prompt }],
  })

  const textContent = response.content.find((block) => block.type === "text")
  return textContent && "text" in textContent ? textContent.text : "Your reading will arrive shortly."
}
