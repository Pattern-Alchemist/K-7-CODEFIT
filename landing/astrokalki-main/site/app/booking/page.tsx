"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, DollarSign, BookOpen } from "lucide-react"

const SERVICES = [
  {
    id: "flash-k",
    name: "Flash K",
    description: "Quick cosmic insight",
    duration: "15 min",
    price: "₹300",
  },
  {
    id: "karma-level",
    name: "Karma Level",
    description: "Deep karmic analysis",
    duration: "30 min",
    price: "₹1,500",
  },
  {
    id: "cosmic-code",
    name: "Cosmic Code",
    description: "Astrology + numerology",
    duration: "20 min",
    price: "₹777",
  },
  {
    id: "moksha-roadmap",
    name: "Moksha Roadmap",
    description: "12-18 month guidance",
    duration: "45 min",
    price: "₹2,500",
  },
]

export default function BookingPage() {
  const [selectedService, setSelectedService] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedSlot, setSelectedSlot] = useState("")
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const router = useRouter()

  const handleDateChange = async (date: string) => {
    setSelectedDate(date)
    setSelectedSlot("")
    setLoading(true)

    try {
      const response = await fetch("/api/bookings/available-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, serviceType: selectedService }),
      })

      const data = await response.json()
      setSlots(data.slots || [])
    } catch (err) {
      console.error("Error fetching slots:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedSlot) {
      alert("Please select service, date, and time slot")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceType: selectedService,
          scheduledFor: `${selectedDate}T${selectedSlot}`,
          notes,
        }),
      })

      const data = await response.json()

      if (data.success) {
        router.push(`/consultation/${data.consultation.id}`)
      } else {
        alert("Booking failed: " + data.error)
      }
    } catch (err) {
      alert("Error creating booking")
    } finally {
      setLoading(false)
    }
  }

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="min-h-screen bg-ink pt-24">
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      <main className="mx-auto max-w-4xl px-4 pb-16">
        <h1 className="font-cinzel text-3xl font-bold text-cyan-300 mb-2">Book a Consultation</h1>
        <p className="text-white/70 mb-8">Schedule your personalized cosmic reading session</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Service Selection */}
          <div>
            <h2 className="font-cinzel text-xl font-semibold text-white mb-4">Choose Service</h2>
            <div className="space-y-2">
              {SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setSelectedService(service.id)
                    setSelectedDate("")
                    setSlots([])
                  }}
                  className={`w-full p-4 rounded-lg border text-left transition ${
                    selectedService === service.id
                      ? "border-cyan-400 bg-cyan-400/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-white">{service.name}</p>
                      <p className="text-xs text-white/70">{service.description}</p>
                    </div>
                    <p className="text-cyan-300 text-sm">{service.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Selection */}
          <div>
            <h2 className="font-cinzel text-xl font-semibold text-white mb-4">Select Date & Time</h2>

            <div className="mb-4">
              <label className="block text-sm text-white/70 mb-2">Choose Date</label>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                disabled={!selectedService}
                className="glass focus-ring w-full px-4 py-2 rounded-lg text-white disabled:opacity-50"
              />
            </div>

            {selectedDate && (
              <div>
                <label className="block text-sm text-white/70 mb-2">Available Time Slots</label>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {loading ? (
                    <p className="text-white/50">Loading slots...</p>
                  ) : slots.length > 0 ? (
                    slots.map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => setSelectedSlot(slot.startTime)}
                        className={`w-full p-2 rounded text-sm transition ${
                          selectedSlot === slot.startTime
                            ? "bg-cyan-500 text-white"
                            : "bg-white/5 text-white hover:bg-white/10"
                        }`}
                      >
                        {slot.startTime} - {slot.endTime}
                      </button>
                    ))
                  ) : (
                    <p className="text-white/50">No slots available</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Notes & Booking */}
        <div className="mt-8 glass glow rounded-2xl p-6">
          <h2 className="font-cinzel text-xl font-semibold text-white mb-4">Additional Notes (Optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any questions or topics you'd like to discuss..."
            className="glass focus-ring w-full px-4 py-3 rounded-lg text-white placeholder-white/50 resize-none h-24"
          />

          {/* Summary & CTA */}
          {selectedService && selectedDate && selectedSlot && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="space-y-2 mb-6 text-white/70">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-cyan-400" />
                  <span>{SERVICES.find((s) => s.id === selectedService)?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-cyan-400" />
                  <span>{selectedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-cyan-400" />
                  <span>{selectedSlot}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-cyan-400" />
                  <span>{SERVICES.find((s) => s.id === selectedService)?.price}</span>
                </div>
              </div>

              <button onClick={handleBooking} disabled={loading} className="btn w-full justify-center">
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
