import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { bookConsultation } from "@/lib/booking-service"

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { serviceType, scheduledFor, notes } = await req.json()

    if (!serviceType || !scheduledFor) {
      return NextResponse.json({ error: "Service type and scheduled time required" }, { status: 400 })
    }

    const consultation = await bookConsultation({
      userId: user.id,
      serviceType,
      scheduledFor,
      notes,
    })

    return NextResponse.json({
      success: true,
      consultation,
    })
  } catch (err) {
    console.error("[Create Booking] Error:", err)
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 })
  }
}
