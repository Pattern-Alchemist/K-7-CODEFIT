import { supabase } from "@/lib/supabaseClient"
import type { EmailJobData } from "@/lib/queue"
import { sendReadingEmail } from "@/lib/email-service"

export async function processEmailJob(jobData: EmailJobData) {
  const { orderId, recipientEmail, recipientName, pdfUrl, audioUrl, analysisText } = jobData

  try {
    console.log(`[EmailProcessor] Sending email for order ${orderId} to ${recipientEmail}`)

    // Send email with reading attachment
    const emailResult = await sendReadingEmail({
      to: recipientEmail,
      name: recipientName,
      pdfUrl,
      audioUrl,
      analysisText,
      orderId,
    })

    // Log email delivery in database
    await supabase.from("orders").update({ status: "completed" }).eq("id", orderId)

    console.log(`[EmailProcessor] Email sent for order ${orderId}`)

    return {
      success: true,
      orderId,
      emailSent: true,
      messageId: emailResult.messageId,
    }
  } catch (err) {
    console.error(`[EmailProcessor] Error sending email for order ${orderId}:`, err)
    throw err
  }
}
