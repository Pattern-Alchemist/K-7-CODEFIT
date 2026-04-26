import { supabase } from "@/lib/supabaseClient"
import { sendFulfillmentEmail } from "@/lib/fulfillment/resend-client"
import { logToGoogleSheets } from "@/lib/fulfillment/sheets-logger"

export async function orchestrateFulfillment(jobData: {
  orderId: string
  email: string
  name: string
  service: string
  pdfUrl?: string
  audioUrl?: string
  readingText: string
}) {
  const { orderId, email, name, service, pdfUrl, audioUrl, readingText } = jobData

  try {
    console.log(`[Fulfillment] Starting fulfillment for order ${orderId}`)

    // 1. Send fulfillment email
    const emailResult = await sendFulfillmentEmail({
      to: email,
      name,
      orderId,
      service,
      pdfUrl,
      audioUrl,
      readingText,
    })

    console.log(`[Fulfillment] Email sent for order ${orderId}`)

    // 2. Update order status
    await supabase.from("orders").update({ status: "completed" }).eq("id", orderId)

    // 3. Log to Google Sheets
    const order = await supabase.from("orders").select("*").eq("id", orderId).single()

    await logToGoogleSheets({
      timestamp: new Date().toISOString(),
      orderId,
      email,
      service,
      status: "sent",
      amount: order.data?.amount || 0,
      currency: order.data?.currency || "INR",
      pdfUrl,
    })

    return {
      success: true,
      orderId,
      emailSent: true,
      messageId: emailResult.messageId,
    }
  } catch (err) {
    console.error(`[Fulfillment] Error for order ${orderId}:`, err)

    // Mark order as failed
    await supabase.from("orders").update({ status: "failed" }).eq("id", orderId)

    throw err
  }
}
