"use client"

import { useState } from "react"
import { X, Video, Clock, CheckCircle2 } from "lucide-react"
import { ConsultationBookingForm } from "./consultation-booking-form"

interface ConsultationBookingModalProps {
  isOpen: boolean
  onClose: () => void
}

const SERVICES = [
  {
    id: "flash-k",
    name: "Flash K",
    price: 100,
    duration: "10 mins",
    description: "Quick insight on any question",
  },
  {
    id: "cosmic-code",
    name: "Cosmic Code",
    price: 777,
    duration: "20 mins",
    description: "Astrology + Numerology blueprint",
  },
  {
    id: "karma-level",
    name: "KARMA Level",
    price: 1500,
    duration: "30 mins",
    description: "Personalized karmic insight session",
    popular: true,
  },
  {
    id: "karma-release",
    name: "KARMA RELEASE",
    price: 4500,
    duration: "60 mins",
    description: "Past-Present-Future deep dive",
  },
  {
    id: "moksha-roadmap",
    name: "MOKSHA ROADMAP",
    price: 8888,
    duration: "75 mins",
    description: "12-18 month future roadmap",
  },
  {
    id: "walk-dharma",
    name: "WALK for DHARMA",
    price: 33999,
    duration: "90 mins",
    description: "3-month mentorship program",
  },
]

export function ConsultationBookingModal({ isOpen, onClose }: ConsultationBookingModalProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null)

  if (!isOpen) return null

  const service = SERVICES.find((s) => s.id === selectedService)

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl glass glow border border-cyan-500/30 p-6 sm:p-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20">
            <Video className="h-6 w-6 text-cyan-300" />
          </div>
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white">Book Video Consultation</h2>
            <p className="text-sm text-white/70">Live 1-on-1 session with expert astrologer</p>
          </div>
        </div>

        {!selectedService ? (
          // Service Selection
          <div className="space-y-4">
            <p className="text-white/80 text-sm">Select your consultation package:</p>
            <div className="grid gap-3 sm:grid-cols-2">
              {SERVICES.map((svc) => (
                <button
                  key={svc.id}
                  onClick={() => setSelectedService(svc.id)}
                  className="relative text-left p-4 rounded-xl glass hover:border-cyan-400/50 border border-white/10 transition-all group"
                >
                  {svc.popular && (
                    <span className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-cyan-500 text-xs font-semibold text-black">
                      Popular
                    </span>
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-cinzel font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-white/60 mt-1">{svc.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-cyan-300">
                          <Clock className="h-3 w-3" />
                          {svc.duration}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-cyan-300">₹{svc.price}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Booking Form
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
              <div>
                <h3 className="font-cinzel font-semibold text-white">{service?.name}</h3>
                <p className="text-sm text-white/70">{service?.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-300">₹{service?.price}</div>
                <div className="text-xs text-white/60">{service?.duration}</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" />
                <span>Live video consultation with expert astrologer</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" />
                <span>Personalized insights based on your birth chart</span>
              </div>
              <div className="flex items-start gap-2 text-sm text-white/80">
                <CheckCircle2 className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" />
                <span>Recording and PDF report included</span>
              </div>
            </div>

            <ConsultationBookingForm
              serviceType={service?.id || ""}
              serviceName={service?.name || ""}
              amount={service?.price || 0}
            />

            <button
              onClick={() => setSelectedService(null)}
              className="w-full text-center text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
            >
              ← Back to service selection
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
