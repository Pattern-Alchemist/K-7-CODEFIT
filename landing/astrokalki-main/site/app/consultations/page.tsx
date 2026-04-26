"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Calendar, Clock, User, DollarSign, ChevronRight, Plus } from "lucide-react"

interface Consultation {
  id: string
  service_type: string
  scheduled_at: string
  status: string
  amount: number
  duration_minutes: number
}

export default function ConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const supabase = createClient()

        if (!supabase) {
          setError("Database connection not available. Please check your configuration.")
          setLoading(false)
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        const { data, error: fetchError } = await supabase
          .from("consultations")
          .select("*")
          .eq("user_id", user.id)
          .order("scheduled_at", { ascending: false })

        if (fetchError) {
          console.error("[v0] Error fetching consultations:", fetchError)
          setError("Failed to load consultations. Please try again later.")
        } else if (data) {
          setConsultations(data)
        }
      } catch (err) {
        console.error("[v0] Error in fetchConsultations:", err)
        setError("An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }

    fetchConsultations()
  }, [router])

  const serviceNames: Record<string, string> = {
    flash_k: "Flash K",
    cosmic_code: "Cosmic Code",
    karma_level: "KARMA Level",
    karma_release: "KARMA RELEASE",
    moksha_roadmap: "MOKSHA ROADMAP",
    walk_dharma: "WALK for DHARMA",
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-300",
      scheduled: "bg-blue-500/20 text-blue-300",
      in_progress: "bg-green-500/20 text-green-300",
      completed: "bg-cyan-500/20 text-cyan-300",
      cancelled: "bg-red-500/20 text-red-300",
    }
    return colors[status] || "bg-gray-500/20 text-gray-300"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-ink pt-24 px-4">
        <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />
        <div className="text-center text-white">Loading your consultations...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ink pt-24 px-4">
        <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />
        <div className="mx-auto max-w-4xl">
          <div className="glass glow rounded-2xl p-8 text-center">
            <h2 className="font-cinzel text-2xl font-bold text-white mb-4">Unable to Load Consultations</h2>
            <p className="text-white/70 mb-6">{error}</p>
            <button onClick={() => router.push("/")} className="btn">
              Return Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink pt-24 pb-16">
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-cinzel text-3xl font-bold text-cyan-300">Your Consultations</h1>
            <p className="text-white/70 mt-1">Manage your booked sessions and stay connected</p>
          </div>
          <button onClick={() => router.push("/#booking")} className="btn flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Book Now
          </button>
        </div>

        {/* Consultations List */}
        <div className="space-y-4">
          {consultations.length === 0 ? (
            <div className="glass glow rounded-2xl p-8 text-center">
              <p className="text-white/70 mb-4">No consultations booked yet</p>
              <button onClick={() => router.push("/#booking")} className="btn inline-flex items-center gap-2">
                Book Your First Session
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            consultations.map((consultation) => (
              <div
                key={consultation.id}
                className="glass glow rounded-2xl p-6 hover:border-cyan-300/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-cinzel text-xl font-semibold text-white">
                      {serviceNames[consultation.service_type] || consultation.service_type}
                    </h3>
                    <span
                      className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(consultation.status)}`}
                    >
                      {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
                    </span>
                  </div>
                  {consultation.status === "scheduled" && (
                    <button onClick={() => router.push(`/consultations/${consultation.id}`)} className="btn text-sm">
                      Join Session
                    </button>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2 text-sm">
                  <div className="flex items-center gap-2 text-white/80">
                    <Calendar className="h-4 w-4 text-cyan-400" />
                    {new Date(consultation.scheduled_at).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <Clock className="h-4 w-4 text-cyan-400" />
                    {new Date(consultation.scheduled_at).toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    · {consultation.duration_minutes} mins
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <DollarSign className="h-4 w-4 text-cyan-400" />${consultation.amount / 100}
                  </div>
                  <div className="flex items-center gap-2 text-white/80">
                    <User className="h-4 w-4 text-cyan-400" />
                    Astrologer: TBD
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
