"use client"

import { useState } from "react"
import { Calendar, Edit, Clock, Phone } from "lucide-react"

interface Consultation {
  id: string
  user_id: string
  service_type: string
  scheduled_at: string
  status: string
  amount: number
  duration_minutes: number
  payment_status: string
}

interface ConsultationsTabProps {
  consultations: Consultation[]
}

export default function ConsultationsTab({ consultations }: ConsultationsTabProps) {
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const serviceNames: Record<string, string> = {
    flash_k: "Flash K",
    cosmic_code: "Cosmic Code",
    karma_level: "KARMA Level",
    karma_release: "KARMA RELEASE",
    moksha_roadmap: "MOKSHA ROADMAP",
    walk_dharma: "WALK for DHARMA",
  }

  const filteredConsultations = consultations.filter((c) => {
    const matchesStatus = filterStatus === "all" || c.status === filterStatus
    const matchesSearch = c.id.includes(searchTerm) || c.user_id.includes(searchTerm)
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      scheduled: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      in_progress: "bg-green-500/20 text-green-300 border-green-500/30",
      completed: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
      cancelled: "bg-red-500/20 text-red-300 border-red-500/30",
    }
    return colors[status] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "text-yellow-400",
      initiated: "text-blue-400",
      completed: "text-green-400",
      failed: "text-red-400",
    }
    return colors[status] || "text-gray-400"
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="glass rounded-2xl p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Search by ID or User</label>
          <input
            type="text"
            placeholder="Enter consultation or user ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="glass focus-ring w-full rounded-xl px-4 py-2 text-white placeholder-white/40"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Filter by Status</label>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "scheduled", "in_progress", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  filterStatus === status ? "bg-cyan-500 text-black" : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-3 px-4 text-white/70 text-sm font-semibold">Service</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-semibold">Scheduled</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-semibold">Payment</th>
                <th className="text-left py-3 px-4 text-white/70 text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/60">
                    No consultations found
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => (
                  <tr key={consultation.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-white font-medium">{serviceNames[consultation.service_type]}</p>
                        <p className="text-xs text-white/60">{consultation.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(consultation.status)}`}
                      >
                        {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1).replace("_", " ")}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-white/80">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-cyan-400" />
                        {new Date(consultation.scheduled_at).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(consultation.scheduled_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white font-medium">${(consultation.amount / 100).toFixed(2)}</td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${getPaymentStatusColor(consultation.payment_status)}`}>
                        {consultation.payment_status.charAt(0).toUpperCase() + consultation.payment_status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-300 transition-colors"
                        title="View Details"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedConsultation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur">
          <div className="glass rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-start justify-between mb-4">
              <h3 className="font-cinzel text-xl font-semibold text-white">Consultation Details</h3>
              <button onClick={() => setSelectedConsultation(null)} className="text-white/60 hover:text-white text-xl">
                ✕
              </button>
            </div>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-white/60 mb-1">Service</p>
                <p className="text-white font-medium">{serviceNames[selectedConsultation.service_type]}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Status</p>
                <p className={`font-medium ${getStatusColor(selectedConsultation.status)}`}>
                  {selectedConsultation.status.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Scheduled</p>
                <p className="text-white">{new Date(selectedConsultation.scheduled_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Duration</p>
                <p className="text-white">{selectedConsultation.duration_minutes} minutes</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Amount</p>
                <p className="text-white font-semibold">${(selectedConsultation.amount / 100).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60 mb-1">Payment Status</p>
                <p className={`font-medium ${getPaymentStatusColor(selectedConsultation.payment_status)}`}>
                  {selectedConsultation.payment_status.toUpperCase()}
                </p>
              </div>
              <div>
                <p className="text-white/60 mb-1">User ID</p>
                <p className="text-white text-xs break-all">{selectedConsultation.user_id}</p>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button className="btn flex-1 justify-center text-sm">
                <Phone className="h-4 w-4" />
                Join Session
              </button>
              <button
                onClick={() => setSelectedConsultation(null)}
                className="btn btn-ghost flex-1 justify-center text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
