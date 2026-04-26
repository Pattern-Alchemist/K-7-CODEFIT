import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { sendBookingReminderEmail } from "@/lib/email"
import { sendWhatsAppNotification, formatBookingReminderWhatsApp } from "@/lib/whatsapp"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    if (!supabase) {
      return NextResponse.json({ error: "Database not configured" }, { status: 500 })
    }

    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const dayAfterTomorrow = new Date(tomorrow)
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1)

    const { data: consultations, error } = await supabase
      .from("consultations")
      .select(`
        id,
        service_type,
        scheduled_for,
        user_id,
        profiles:user_id (
          full_name,
          email,
          phone
        )
      `)
      .eq("status", "scheduled")
      .gte("scheduled_for", tomorrow.toISOString())
      .lt("scheduled_for", dayAfterTomorrow.toISOString())

    if (error) {
      console.error("Error fetching consultations:", error)
      return NextResponse.json({ error: "Failed to fetch consultations" }, { status: 500 })
    }

    const results = []

    for (const consultation of consultations || []) {
      const profile = consultation.profiles as any

      if (profile?.email) {
        const emailResult = await sendBookingReminderEmail({
          to: profile.email,
          userName: profile.full_name || "Valued Customer",
          serviceName: consultation.service_type.replace(/-/g, " ").toUpperCase(),
          scheduledFor: consultation.scheduled_for,
          consultationId: consultation.id,
        })

        let whatsappResult = null
        if (profile?.phone) {
          const whatsappMessage = formatBookingReminderWhatsApp({
            userName: profile.full_name || "Valued Customer",
            serviceName: consultation.service_type.replace(/-/g, " ").toUpperCase(),
            scheduledFor: consultation.scheduled_for,
            consultationId: consultation.id,
          })

          whatsappResult = await sendWhatsAppNotification({
            to: profile.phone,
            message: whatsappMessage,
          })
        }

        results.push({
          consultationId: consultation.id,
          emailSent: emailResult.success,
          whatsappSent: whatsappResult?.success || false,
        })
      }
    }

    return NextResponse.json({
      message: `Sent ${results.filter((r) => r.emailSent).length} email reminders and ${results.filter((r) => r.whatsappSent).length} WhatsApp reminders`,
      results,
    })
  } catch (error) {
    console.error("Error sending reminders:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
