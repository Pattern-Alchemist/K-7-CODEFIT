export interface WhatsAppMessage {
  to: string
  message: string
}

export async function sendWhatsAppNotification(data: WhatsAppMessage) {
  try {
    // Using Twilio WhatsApp API
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const whatsappFrom = process.env.TWILIO_WHATSAPP_NUMBER || "whatsapp:+14155238886"

    if (!accountSid || !authToken) {
      console.warn("Twilio credentials not configured")
      return { success: false, error: "WhatsApp not configured" }
    }

    const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      },
      body: new URLSearchParams({
        From: whatsappFrom,
        To: `whatsapp:${data.to}`,
        Body: data.message,
      }),
    })

    const result = await response.json()

    if (response.ok) {
      return { success: true, messageId: result.sid }
    } else {
      console.error("WhatsApp send error:", result)
      return { success: false, error: result.message }
    }
  } catch (error) {
    console.error("Error sending WhatsApp notification:", error)
    return { success: false, error }
  }
}

export function formatBookingConfirmationWhatsApp(data: {
  userName: string
  serviceName: string
  scheduledFor: string
  consultationId: string
}): string {
  const formattedDate = new Date(data.scheduledFor).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  })

  return `🌟 *AstroKalki Consultation Confirmed* 🌟

Dear ${data.userName},

Your cosmic consultation has been successfully booked!

📅 *Service:* ${data.serviceName}
🕐 *Date & Time:* ${formattedDate}
🆔 *Consultation ID:* ${data.consultationId}

📝 *Preparation Tips:*
• Have your birth details ready
• Prepare your questions in advance
• Find a quiet space for the session
• Test your camera and microphone

You'll receive a reminder 24 hours before your session.

View details: ${process.env.NEXT_PUBLIC_APP_URL}/consultations/${data.consultationId}

_Karma. Cosmos. Dharma._
- AstroKalki Team`
}

export function formatBookingReminderWhatsApp(data: {
  userName: string
  serviceName: string
  scheduledFor: string
  consultationId: string
}): string {
  const formattedDate = new Date(data.scheduledFor).toLocaleString("en-IN", {
    dateStyle: "full",
    timeStyle: "short",
  })

  return `⏰ *Consultation Reminder* ⏰

Dear ${data.userName},

Your ${data.serviceName} consultation is scheduled for *tomorrow*!

🕐 *Time:* ${formattedDate}

✅ *Pre-Session Checklist:*
✓ Birth details ready
✓ Questions prepared
✓ Quiet space arranged
✓ Camera & mic tested
✓ Internet connection verified

Join here: ${process.env.NEXT_PUBLIC_APP_URL}/consultations/${data.consultationId}

See you soon!
- AstroKalki Team`
}
