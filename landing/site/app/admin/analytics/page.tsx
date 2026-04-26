"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

export default function AnalyticsPage() {
  const [revenueData, setRevenueData] = useState<any[]>([])
  const [serviceBreakdown, setServiceBreakdown] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    avgOrderValue: 0,
    completionRate: 0,
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  async function fetchAnalytics() {
    try {
      const { data: orders, error } = await supabase.from("orders").select("*")

      if (error) throw error

      // Calculate stats
      const totalRevenue =
        orders?.reduce((sum, o) => sum + (o.status === "paid" || o.status === "completed" ? o.amount : 0), 0) || 0
      const totalOrders = orders?.length || 0
      const completedOrders = orders?.filter((o) => o.status === "completed").length || 0
      const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
      const completionRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0

      setStats({
        totalRevenue,
        totalOrders,
        avgOrderValue,
        completionRate,
      })

      // Service breakdown
      const serviceMap = new Map<string, number>()
      orders?.forEach((o) => {
        const count = serviceMap.get(o.product) || 0
        serviceMap.set(o.product, count + 1)
      })

      const breakdown = Array.from(serviceMap).map(([product, count]) => ({
        name: product,
        value: count,
      }))

      setServiceBreakdown(breakdown)

      // Revenue trend (last 7 days)
      const last7Days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        last7Days.push(date)
      }

      const revenueByDay = last7Days.map((date) => {
        const dayOrders =
          orders?.filter((o) => {
            const orderDate = new Date(o.created_at)
            return orderDate.toDateString() === date.toDateString() && (o.status === "paid" || o.status === "completed")
          }) || []

        const revenue = dayOrders.reduce((sum, o) => sum + o.amount, 0)

        return {
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          revenue,
        }
      })

      setRevenueData(revenueByDay)
    } catch (err) {
      console.error("[Analytics] Error:", err)
    }
  }

  const COLORS = ["#67e8f9", "#e879f9", "#56b3a8", "#d97706"]

  return (
    <div className="min-h-screen bg-ink text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics</h1>
          <p className="text-white/70">Business metrics and performance overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="glass glow rounded-xl p-6">
            <div className="text-sm text-white/60 mb-2">Total Revenue</div>
            <div className="text-3xl font-bold text-cyan-300">₹{stats.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="glass glow rounded-xl p-6">
            <div className="text-sm text-white/60 mb-2">Total Orders</div>
            <div className="text-3xl font-bold text-cyan-300">{stats.totalOrders}</div>
          </div>
          <div className="glass glow rounded-xl p-6">
            <div className="text-sm text-white/60 mb-2">Avg Order Value</div>
            <div className="text-3xl font-bold text-cyan-300">₹{stats.avgOrderValue}</div>
          </div>
          <div className="glass glow rounded-xl p-6">
            <div className="text-sm text-white/60 mb-2">Completion Rate</div>
            <div className="text-3xl font-bold text-cyan-300">{stats.completionRate}%</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <div className="glass glow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Revenue Trend (7 Days)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d0b1e", border: "1px solid rgba(255,255,255,0.2)" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="revenue" fill="#67e8f9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Service Breakdown */}
          <div className="glass glow rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Service Breakdown</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={serviceBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                  {serviceBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#0d0b1e", border: "1px solid rgba(255,255,255,0.2)" }}
                  labelStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
