"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { CheckCircle2, Clock, XCircle, Eye } from "lucide-react"

interface Order {
  id: string
  product: string
  amount: number
  currency: string
  status: "pending" | "paid" | "processing" | "completed" | "failed"
  channel: string
  external_id: string
  created_at: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => {
    fetchOrders()

    // Subscribe to real-time updates
    const subscription = supabase
      .from("orders")
      .on("*", (payload) => {
        console.log("[Admin] Order update:", payload)
        fetchOrders()
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  async function fetchOrders() {
    try {
      let query = supabase.from("orders").select("*").order("created_at", { ascending: false })

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus)
      }

      const { data, error } = await query

      if (error) throw error

      setOrders(data || [])
    } catch (err) {
      console.error("[Admin] Fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case "pending":
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-400 animate-spin" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <Clock className="h-5 w-5 text-cyan-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 border border-green-400/40 text-green-300"
      case "pending":
        return "bg-yellow-500/20 border border-yellow-400/40 text-yellow-300"
      case "processing":
        return "bg-blue-500/20 border border-blue-400/40 text-blue-300"
      case "paid":
        return "bg-cyan-500/20 border border-cyan-400/40 text-cyan-300"
      case "failed":
        return "bg-red-500/20 border border-red-400/40 text-red-300"
      default:
        return "bg-white/10 border border-white/20 text-white/70"
    }
  }

  return (
    <div className="min-h-screen bg-ink text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Orders</h1>
          <p className="text-white/70">Real-time order tracking and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length, color: "cyan" },
            {
              label: "Completed",
              value: orders.filter((o) => o.status === "completed").length,
              color: "green",
            },
            {
              label: "Pending",
              value: orders.filter((o) => o.status === "pending").length,
              color: "yellow",
            },
            {
              label: "Failed",
              value: orders.filter((o) => o.status === "failed").length,
              color: "red",
            },
          ].map((stat) => (
            <div key={stat.label} className="glass glow rounded-xl p-4">
              <div className="text-sm text-white/60">{stat.label}</div>
              <div className={`text-3xl font-bold mt-1 text-${stat.color}-300`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="mb-6 flex gap-2">
          {["all", "pending", "paid", "processing", "completed", "failed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterStatus === status ? "bg-cyan-500 text-black" : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        <div className="glass glow rounded-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-white/50">No orders found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-white/20 bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Service</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Channel</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm">{order.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-sm capitalize">{order.product}</td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        {order.amount} {order.currency}
                      </td>
                      <td className="px-6 py-4 text-sm uppercase">{order.channel}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}
                        >
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white/60">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-colors"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Detail Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-ink border border-white/20 rounded-xl p-6 max-w-md w-full">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="text-white/60 hover:text-white text-2xl">
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="border-b border-white/10 pb-2">
                  <div className="text-sm text-white/60">Order ID</div>
                  <div className="font-mono">{selectedOrder.id}</div>
                </div>
                <div className="border-b border-white/10 pb-2">
                  <div className="text-sm text-white/60">Service</div>
                  <div className="capitalize">{selectedOrder.product}</div>
                </div>
                <div className="border-b border-white/10 pb-2">
                  <div className="text-sm text-white/60">Amount</div>
                  <div className="text-lg font-bold">
                    {selectedOrder.amount} {selectedOrder.currency}
                  </div>
                </div>
                <div className="border-b border-white/10 pb-2">
                  <div className="text-sm text-white/60">Status</div>
                  <span
                    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mt-1 ${getStatusColor(selectedOrder.status)}`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="border-b border-white/10 pb-2">
                  <div className="text-sm text-white/60">Channel</div>
                  <div className="uppercase">{selectedOrder.channel}</div>
                </div>
                <div>
                  <div className="text-sm text-white/60">Created</div>
                  <div>{new Date(selectedOrder.created_at).toLocaleString()}</div>
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
