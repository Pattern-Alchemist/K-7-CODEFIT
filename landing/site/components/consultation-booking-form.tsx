"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, AlertCircle } from "lucide-react"

interface BookingFormProps {
  serviceType: string
  serviceName: string
  amount: number
}

export function ConsultationBookingForm({ serviceType, serviceName, amount }: BookingFormProps) {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // First create consultation booking
      const bookingResponse = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType,
          scheduledFor: new Date(`${date}T${time}`).toISOString(),
        }),
      })

      if (!bookingResponse.ok) {
        throw new Error("Failed to create booking")
      }

      const { consultation } = await bookingResponse.json()

      // Then process payment
      const paymentResponse = await fetch("/api/payments/upi/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amount,
          consultationId: consultation.id,
        }),
      })

      if (!paymentResponse.ok) {
        throw new Error("Payment processing failed")
      }

      const paymentData = await paymentResponse.json()

      if (paymentData.deepLink) {
        window.open(paymentData.deepLink, "_blank")
      }

      // Redirect to consultation page after a delay
      setTimeout(() => {
        router.push(`/consultations/${consultation.id}`)
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Booking failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-white mb-2">Select Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="glass focus-ring w-full pl-10 pr-4 py-2 rounded-xl text-white"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Select Time</label>
        <div className="relative">
          <Clock className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="glass focus-ring w-full pl-10 pr-4 py-2 rounded-xl text-white"
            required
          />
        </div>
      </div>

      <button type="submit" disabled={loading || !date || !time} className="btn w-full justify-center mt-6">
        {loading ? "Processing..." : `Proceed to Payment (${amount} INR)`}
      </button>
    </form>
  )
}
