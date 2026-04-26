"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { BookingCalendar } from "./booking-calendar"
import { ConsultationBookingForm } from "./consultation-booking-form"

interface ServiceBookingModalProps {
  service: {
    id: string
    name: string
    price: number
    description: string
  }
  onClose: () => void
}

export function ServiceBookingModal({ service, onClose }: ServiceBookingModalProps) {
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; time: string } | null>(null)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur">
      <div className="glass glow rounded-3xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-cinzel text-2xl font-bold text-white">{service.name}</h2>
            <p className="text-cyan-300 text-lg mt-1">${service.price}</p>
          </div>
          <button onClick={onClose} className="btn btn-ghost p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="text-white/80">{service.description}</p>

          {/* Calendar Selection */}
          <BookingCalendar
            serviceType={service.id}
            onSelectDateTime={(date, time) => setSelectedDateTime({ date, time })}
          />

          {/* Booking Form */}
          {selectedDateTime && (
            <div>
              <h4 className="font-cinzel font-semibold text-white mb-4">Confirm Booking</h4>
              <ConsultationBookingForm serviceType={service.id} serviceName={service.name} amount={service.price} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
