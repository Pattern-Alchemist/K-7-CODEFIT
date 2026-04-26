"use client"
import { useState } from "react"
import type React from "react"

type Lead = {
  name: string
  phone: string
  dob: string
  tob?: string
  birth_location: string
  country?: string
  email: string
  service_type?: string
}

export default function LeadForm() {
  const [formData, setFormData] = useState<Lead>({
    name: "",
    phone: "",
    dob: "",
    tob: "",
    birth_location: "",
    country: "",
    email: "",
    service_type: "starter",
  })
  const [status, setStatus] = useState("")
  const [dobDay, setDobDay] = useState("")
  const [dobMonth, setDobMonth] = useState("")
  const [dobYear, setDobYear] = useState("")
  const [tobHour, setTobHour] = useState("")
  const [tobMinute, setTobMinute] = useState("")
  const [tobPeriod, setTobPeriod] = useState("AM")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("Submitting...")

    // Build dob from dropdowns
    const dob = `${dobDay.padStart(2, "0")}/${dobMonth.padStart(2, "0")}/${dobYear}`
    // Build tob from dropdowns
    let tob = ""
    if (tobHour && tobMinute) {
      let hour24 = parseInt(tobHour)
      if (tobPeriod === "PM" && hour24 !== 12) hour24 += 12
      if (tobPeriod === "AM" && hour24 === 12) hour24 = 0
      tob = `${hour24.toString().padStart(2, "0")}:${tobMinute.padStart(2, "0")}`
    }

    const payload = { ...formData, dob, tob }

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error("Failed")
      setStatus("✅ Submitted! We'll contact you shortly.")
      // Reset
      setFormData({
        name: "",
        phone: "",
        dob: "",
        tob: "",
        birth_location: "",
        country: "",
        email: "",
        service_type: "starter",
      })
      setDobDay("")
      setDobMonth("")
      setDobYear("")
      setTobHour("")
      setTobMinute("")
      setTobPeriod("AM")
    } catch (err) {
      setStatus("⚠ Error. Please try again.")
    }
  }

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString())
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString())
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString())
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"))

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-black via-purple-950/20 to-black p-8 shadow-2xl shadow-cyan-500/20"
      id="lead"
    >
      <h3 className="text-center text-2xl font-semibold text-cyan-400">Get yours now</h3>

      <input
        required
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label="Full Name"
      />

      <input
        required
        placeholder="Phone Number"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label="Phone Number"
      />

      {/* Date of Birth with Dropdowns */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-cyan-300">Date of Birth *</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            required
            value={dobDay}
            onChange={(e) => setDobDay(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-3 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Day"
          >
            <option value="">Day</option>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            required
            value={dobMonth}
            onChange={(e) => setDobMonth(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-3 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Month"
          >
            <option value="">Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
          <select
            required
            value={dobYear}
            onChange={(e) => setDobYear(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-3 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Year"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Time of Birth with Dropdowns */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-cyan-300">Time of Birth (optional)</label>
        <div className="grid grid-cols-4 gap-2">
          <select
            value={tobHour}
            onChange={(e) => setTobHour(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-3 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Hour"
          >
            <option value="">Hour</option>
            {hours.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
          <select
            value={tobMinute}
            onChange={(e) => setTobMinute(e.target.value)}
            className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-3 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="Minute"
          >
            <option value="">Min</option>
            {minutes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            value={tobPeriod}
            onChange={(e) => setTobPeriod(e.target.value)}
            className="col-span-2 w-full rounded-lg border border-cyan-500/40 bg-black/60 px-3 py-3 text-white focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
            aria-label="AM/PM"
          >
            <option value="AM">AM</option>
            <option value="PM">PM</option>
          </select>
        </div>
      </div>

      <input
        required
        placeholder="Birth Location (City/State)"
        value={formData.birth_location}
        onChange={(e) => setFormData({ ...formData, birth_location: e.target.value })}
        className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label="Birth Location (City/State)"
      />

      <input
        placeholder="Country (if outside India)"
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label="Country (if outside India)"
      />

      <input
        required
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        className="w-full rounded-lg border border-cyan-500/40 bg-black/60 px-4 py-3 text-white placeholder-gray-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
        aria-label="Email"
      />

      <button
        type="submit"
        className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-cyan-400 hover:to-purple-400 hover:shadow-lg hover:shadow-cyan-500/50"
      >
        Submit
      </button>

      {status && <p className="text-center text-sm text-cyan-300">{status}</p>}

      <p className="text-center text-xs text-gray-400">
        By submitting, you consent to be contacted for booking and understand how we process your data.
      </p>
    </form>
  )
}
