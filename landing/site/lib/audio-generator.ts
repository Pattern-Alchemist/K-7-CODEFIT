export async function generateAudio(text: string, orderId: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    console.warn("[AudioGenerator] No API key for audio generation")
    return ""
  }

  // Call TTS API (would integrate with actual TTS service)
  // For now, return placeholder
  console.log(`[AudioGenerator] Would generate audio for order ${orderId}`)

  return `https://audio.example.com/readings/${orderId}.mp3`
}
