"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface BookingCalendarProps {
  onSelectDateTime: (date: string, time: string) => void
  serviceType: string
}

export function BookingCalendar({ onSelectDateTime, serviceType }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const handleDateSelect = async (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    setSelectedDate(dateStr)
    setSelectedTime(null)
    setLoadingSlots(true)

    try {
      const response = await fetch("/api/bookings/available-slots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: dateStr, serviceType }),
      })

      const data = await response.json()
      setAvailableSlots(data.slots || [])
    } catch (err) {
      console.error("Error fetching slots:", err)
    } finally {
      setLoadingSlots(false)
    }
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i)

  const monthName = currentDate.toLocaleString("en-US", { month: "long" })
  const year = currentDate.getFullYear()

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-cinzel font-semibold text-white">
            {monthName} {year}
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
              className="btn btn-ghost p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
              className="btn btn-ghost p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-white/60">
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-2">
          {emptyDays.map((i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}
          {days.map((day) => (
            <button
              key={day}
              onClick={() => handleDateSelect(day)}
              className={`aspect-square rounded-lg font-semibold transition-colors ${
                selectedDate?.endsWith(`-${String(day).padStart(2, "0")}`)
                  ? "bg-cyan-500 text-black"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Time Slots */}
      {selectedDate && (
        <div className="glass rounded-2xl p-6">
          <h4 className="font-cinzel font-semibold text-white mb-4">Available Times</h4>

          {loadingSlots ? (
            <p className="text-white/60 text-center py-4">Loading available slots...</p>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => {
                    setSelectedTime(slot.time)
                    onSelectDateTime(selectedDate, slot.time)
                  }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    selectedTime === slot.time ? "bg-cyan-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-center py-4">No available slots for this date</p>
          )}
        </div>
      )}
    </div>
  )
}
