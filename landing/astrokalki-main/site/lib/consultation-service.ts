import { createClient } from "@/lib/supabase/server"
import { generateLiveKitToken } from "@/lib/livekit"

export interface ConsultationData {
  id: string
  userId: string
  astrologerId?: string
  serviceType: string
  scheduledFor: string
  status: "pending" | "scheduled" | "in_progress" | "completed" | "cancelled"
  roomName: string
  amount: number
  paymentStatus: string
  createdAt: string
}

function normalizeServiceType(type: string): string {
  return type.replace(/_/g, "-")
}

export async function createConsultationBooking(userId: string, serviceType: string, scheduledFor: string) {
  const supabase = await createClient()

  const roomName = `consultation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const serviceConfig: Record<string, { amount: number; duration: number }> = {
    "flash-k": { amount: 100, duration: 15 },
    "cosmic-code": { amount: 777, duration: 20 },
    "karma-level": { amount: 1500, duration: 30 },
    "karma-release": { amount: 4500, duration: 60 },
    "moksha-roadmap": { amount: 8888, duration: 75 },
    "walk-dharma": { amount: 33999, duration: 180 },
  }

  const normalized = normalizeServiceType(serviceType)
  const config = serviceConfig[normalized] || { amount: 500, duration: 30 }

  const { data, error } = await supabase
    .from("consultations")
    .insert({
      user_id: userId,
      service_type: normalized,
      scheduled_at: scheduledFor,
      status: "scheduled",
      room_name: roomName,
      amount: config.amount,
      duration_minutes: config.duration,
      payment_status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return data as ConsultationData
}

export async function getUserConsultations(userId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("consultations")
    .select("*")
    .eq("user_id", userId)
    .order("scheduled_at", { ascending: false })

  if (error) throw error
  return data as ConsultationData[]
}

export async function getConsultationById(consultationId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.from("consultations").select("*").eq("id", consultationId).single()

  if (error) throw error
  return data as ConsultationData
}

export async function startConsultationSession(
  consultationId: string,
  userId: string,
): Promise<{ token: string; serverUrl: string; roomName: string }> {
  const supabase = await createClient()

  // Get consultation
  const { data: consultation, error: consultError } = await supabase
    .from("consultations")
    .select("*")
    .eq("id", consultationId)
    .eq("user_id", userId)
    .single()

  if (consultError || !consultation) {
    throw new Error("Consultation not found or unauthorized")
  }

  // Generate LiveKit token
  const token = generateLiveKitToken({
    identity: userId,
    roomName: consultation.room_name,
    canPublish: true,
    canSubscribe: true,
  })

  // Update status to in_progress
  await supabase.from("consultations").update({ status: "in_progress" }).eq("id", consultationId)

  return {
    token,
    serverUrl: process.env.LIVEKIT_SERVER_URL || "",
    roomName: consultation.room_name,
  }
}

export async function completeConsultation(consultationId: string) {
  const supabase = await createClient()

  const { error } = await supabase.from("consultations").update({ status: "completed" }).eq("id", consultationId)

  if (error) throw error
}
