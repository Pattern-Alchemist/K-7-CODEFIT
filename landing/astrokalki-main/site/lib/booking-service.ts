import { createClient } from "@/lib/supabase/server"

export interface BookingSlot {
  id: string
  date: string
  startTime: string
  endTime: string
  available: boolean
  price: number
  duration: number
  serviceType: string
}

export interface Consultation {
  id: string
  userId: string
  astrologerId: string
  serviceType: "flash-k" | "karma-level" | "cosmic-code" | "moksha-roadmap"
  scheduledFor: string
  duration: number
  status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled"
  roomName?: string
  notes?: string
  createdAt: string
}

const SERVICE_TYPE_MAP: Record<string, string> = {
  flash_k: "flash-k",
  cosmic_code: "cosmic-code",
  karma_level: "karma-level",
  karma_release: "karma-release",
  moksha_roadmap: "moksha-roadmap",
  walk_dharma: "walk-dharma",
  "flash-k": "flash-k",
  "cosmic-code": "cosmic-code",
  "karma-level": "karma-level",
  "karma-release": "karma-release",
  "moksha-roadmap": "moksha-roadmap",
  "walk-dharma": "walk-dharma",
}

export async function getAvailableSlots(date: string, serviceType: string): Promise<BookingSlot[]> {
  // Generate available slots based on astrologer availability
  const slots: BookingSlot[] = []
  const serviceDurations: Record<string, number> = {
    "flash-k": 15,
    "karma-level": 30,
    "cosmic-code": 20,
    "moksha-roadmap": 45,
    "karma-release": 60,
    "walk-dharma": 180,
  }

  const prices: Record<string, number> = {
    "flash-k": 100,
    "karma-level": 1500,
    "cosmic-code": 777,
    "moksha-roadmap": 8888,
    "karma-release": 4500,
    "walk-dharma": 33999,
  }

  const normalizedType = SERVICE_TYPE_MAP[serviceType] || serviceType

  const duration = serviceDurations[normalizedType] || 30
  const price = prices[normalizedType] || 500

  // Generate slots every 30 minutes from 10 AM to 8 PM
  for (let hour = 10; hour < 20; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const startTime = `${String(hour).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
      const endHour = minutes + duration >= 60 ? hour + 1 : hour
      const endMinutes = (minutes + duration) % 60
      const endTime = `${String(endHour).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`

      slots.push({
        id: `${date}-${startTime}`,
        date,
        startTime,
        endTime,
        available: true,
        price,
        duration,
        serviceType: normalizedType,
      })
    }
  }

  return slots
}

export async function bookConsultation(booking: {
  userId: string
  serviceType: string
  scheduledFor: string
  notes?: string
}): Promise<Consultation> {
  const supabase = await createClient()

  // Generate unique room name
  const roomName = `astro-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const normalizedType = SERVICE_TYPE_MAP[booking.serviceType] || booking.serviceType

  const { data, error } = await supabase
    .from("consultations")
    .insert({
      user_id: booking.userId,
      astrologer_id: "astrokalki-main", // Default astrologer
      service_type: normalizedType,
      scheduled_for: booking.scheduledFor,
      status: "scheduled",
      room_name: roomName,
      notes: booking.notes,
      duration: getDurationByService(normalizedType),
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to book consultation: ${error.message}`)
  }

  return data as Consultation
}

export async function getConsultations(userId: string): Promise<Consultation[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("user_id", userId)
    .order("scheduled_for", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch consultations: ${error.message}`)
  }

  return data as Consultation[]
}

export async function updateConsultationStatus(
  consultationId: string,
  status: "pending" | "scheduled" | "in-progress" | "completed" | "cancelled",
): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase.from("consultations").update({ status }).eq("id", consultationId)

  if (error) {
    throw new Error(`Failed to update consultation: ${error.message}`)
  }
}

function getDurationByService(serviceType: string): number {
  const durations: Record<string, number> = {
    "flash-k": 15,
    "karma-level": 30,
    "cosmic-code": 20,
    "moksha-roadmap": 45,
    "karma-release": 60,
    "walk-dharma": 180,
  }
  return durations[serviceType] || 30
}
