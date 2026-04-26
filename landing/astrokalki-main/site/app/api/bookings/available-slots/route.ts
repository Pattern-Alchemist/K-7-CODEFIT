import { type NextRequest, NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/booking-service"

export async function POST(req: NextRequest) {
  try {
    const { date, serviceType } = await req.json()

    if (!date || !serviceType) {
      return NextResponse.json({ error: "Date and service type required" }, { status: 400 })
    }

    const slots = await getAvailableSlots(date, serviceType)

    return NextResponse.json({
      success: true,
      slots,
    })
  } catch (err) {
    console.error("[Available Slots] Error:", err)
    return NextResponse.json({ error: "Failed to fetch available slots" }, { status: 500 })
  }
}
