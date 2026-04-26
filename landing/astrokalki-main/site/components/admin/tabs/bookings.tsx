"use client"

import { useState } from "react"
import { Calendar, User, CheckCircle2, AlertCircle, Trash2 } from "lucide-react"

interface BookingManagementProps {
  orders: any[]
  leads: any[]
}

export default function BookingManagement({ orders, leads }: BookingManagementProps) {
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "paid" | "failed">("all")

  const filteredOrders = orders.filter((o) => filterStatus === "all" || o.status === filterStatus)

  const statusConfig: Record<string, { bg: string; text: string; icon: any }> = {
    paid: { bg: "bg-green-500/20", text: "text-green-300", icon: CheckCircle2 },
    pending: { bg: "bg-yellow-500/20", text: "text-yellow-300", icon: AlertCircle },
    failed: { bg: "bg-red-500/20", text: "text-red-300", icon: AlertCircle },
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "paid", "failed"] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
              filterStatus === status
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-300/40"
                : "border border-white/10 text-white/70 hover:text-white"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="glass glow rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="text-left py-3 px-4 text-white/70">Order ID</th>
                <th className="text-left py-3 px-4 text-white/70">Channel</th>
                <th className="text-left py-3 px-4 text-white/70">Amount</th>
                <th className="text-left py-3 px-4 text-white/70">Status</th>
                <th className="text-left py-3 px-4 text-white/70">Date</th>
                <th className="text-left py-3 px-4 text-white/70">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order: any) => {
                const config = statusConfig[order.status] || statusConfig.pending
                const Icon = config.icon
                return (
                  <tr key={order.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 text-cyan-300 font-mono text-xs">{order.id.slice(0, 8)}...</td>
                    <td className="py-3 px-4 text-white capitalize">{order.channel || "—"}</td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {order.currency === "INR" ? "₹" : "$"}
                      {(order.amount / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <div className={`flex items-center gap-2 w-fit px-2 py-1 rounded ${config.bg}`}>
                        <Icon className={`h-3 w-3 ${config.text}`} strokeWidth={2} />
                        <span className={`text-xs font-semibold capitalize ${config.text}`}>{order.status}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/70 text-xs">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <button className="p-2 rounded-lg hover:bg-red-500/20 text-red-300 transition">
                        <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leads Summary */}
      <div className="glass glow rounded-2xl p-6">
        <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Recent Booking Leads</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {leads.slice(0, 4).map((lead: any) => (
            <div key={lead.id} className="glass rounded-lg p-4 border border-white/10">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-300" strokeWidth={1.5} />
                  <h4 className="font-medium text-white">{lead.name}</h4>
                </div>
              </div>
              <div className="space-y-2 text-xs text-white/70">
                <p>Email: {lead.email}</p>
                <p>Phone: {lead.phone}</p>
                <p className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(lead.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
