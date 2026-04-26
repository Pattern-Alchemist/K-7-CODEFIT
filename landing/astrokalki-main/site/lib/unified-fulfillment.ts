import { composeReadingText } from "./tts-generator"
import { textToMp3 } from "./tts-generator"
import { htmlToPdf } from "./pdf-generator-enhanced"
import { sendFulfillmentEmail } from "./fulfillment/resend-client"
import { logToGoogleSheets } from "./fulfillment/sheets-logger"
import { supabase } from "@/lib/supabaseClient"

export interface FulfillmentPayload {
  orderId: string
  email: string
  name?: string
  source: "paypal" | "upi" | "test"
  amount?: number
  currency?: string
}

export async function processFulfillment(payload: FulfillmentPayload) {
  const name = payload.name ?? "Valued Customer"
  const timestamp = new Date().toISOString()

  try {
    console.log(`[Fulfillment] Starting for order ${payload.orderId} (${payload.source})`)

    // 1. Compose reading
    const readingText = await composeReadingText({ name })

    // 2. Generate TTS audio
    const audio = await textToMp3(readingText)

    // 3. Generate PDF
    const pdf = await htmlToPdf(name, readingText)

    // 4. Send email with attachments
    const emailResult = await sendFulfillmentEmail({
      to: payload.email,
      name,
      orderId: payload.orderId,
      service: "AstroKalki ₹99 Reading",
      pdfUrl: pdf.url,
      audioUrl: audio.url,
      readingText,
    })

    // 5. Log to Google Sheets
    await logToGoogleSheets({
      timestamp,
      orderId: payload.orderId,
      email: payload.email,
      service: "AstroKalki Reading",
      status: "completed",
      amount: payload.amount ?? 99,
      currency: payload.currency ?? "INR",
      pdfUrl: pdf.url,
    })

    // 6. Update order status in Supabase
    if (supabase) {
      await supabase.from("orders").update({ status: "completed" }).eq("id", payload.orderId)
    }

    console.log(`[Fulfillment] Success for order ${payload.orderId}`)

    return {
      success: true,
      orderId: payload.orderId,
      audioUrl: audio.url,
      pdfUrl: pdf.url,
      emailId: emailResult.messageId,
    }
  } catch (error) {
    console.error(`[Fulfillment] Error for order ${payload.orderId}:`, error)

    // Mark order as failed
    if (supabase) {
      await supabase.from("orders").update({ status: "failed" }).eq("id", payload.orderId)
    }

    throw error
  }
}
