import { supabase } from "@/lib/supabaseClient"
import type { ReadingJobData } from "@/lib/queue"
import { generateKarmicReading } from "@/lib/ai/reading-generator"
import { generatePDF } from "@/lib/pdf-generator"
import { generateAudio } from "@/lib/audio-generator"

export async function processReadingJob(jobData: ReadingJobData) {
  const { orderId, inputs, service } = jobData

  try {
    console.log(`[ReadingProcessor] Processing reading for order ${orderId}`)

    // 1. Generate reading text using OpenAI/LLM
    const readingText = await generateKarmicReading(inputs, service)

    // 2. Store reading output in database
    const { data: reading, error: readingError } = await supabase
      .from("readings")
      .insert({
        order_id: orderId,
        inputs,
        output: { text: readingText, service, generatedAt: new Date().toISOString() },
      })
      .select()
      .single()

    if (readingError) {
      throw new Error(`Failed to store reading: ${readingError.message}`)
    }

    // 3. Generate PDF
    const pdfUrl = await generatePDF({
      orderId,
      readingId: reading.id,
      text: readingText,
      inputs,
    })

    // 4. Generate audio version
    const audioUrl = await generateAudio(readingText, orderId)

    // 5. Update reading with generated assets
    await supabase
      .from("readings")
      .update({
        pdf_url: pdfUrl,
        // audio_url: audioUrl, // Add to schema if needed
      })
      .eq("id", reading.id)

    console.log(`[ReadingProcessor] Completed reading ${orderId}`)

    return {
      success: true,
      orderId,
      readingId: reading.id,
      pdfUrl,
      audioUrl,
    }
  } catch (err) {
    console.error(`[ReadingProcessor] Error processing order ${orderId}:`, err)

    // Update order status to failed
    await supabase.from("orders").update({ status: "failed" }).eq("id", orderId)

    throw err
  }
}
