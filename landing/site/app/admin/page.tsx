"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { Users, TrendingUp, Calendar, DollarSign, LogOut } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const bookingData = [
    { date: "Mon", bookings: 12, revenue: 1200 },
    { date: "Tue", bookings: 19, revenue: 1900 },
    { date: "Wed", bookings: 15, revenue: 1500 },
    { date: "Thu", bookings: 22, revenue: 2200 },
    { date: "Fri", bookings: 18, revenue: 1800 },
    { date: "Sat", bookings: 25, revenue: 2500 },
    { date: "Sun", bookings: 14, revenue: 1400 },
  ]

  const revenueData = [
    { month: "Jan", revenue: 8000 },
    { month: "Feb", revenue: 12000 },
    { month: "Mar", revenue: 15000 },
    { month: "Apr", revenue: 18000 },
    { month: "May", revenue: 22000 },
    { month: "Jun", revenue: 25000 },
  ]

  const stats = [
    { label: "Total Users", value: "1,245", icon: Users, color: "text-cyan-400" },
    { label: "This Month Revenue", value: "₹25,000", icon: DollarSign, color: "text-green-400" },
    { label: "Bookings This Week", value: "125", icon: Calendar, color: "text-fuchsia-400" },
    { label: "Growth Rate", value: "+18%", icon: TrendingUp, color: "text-teal-400" },
  ]

  return (
    <div className="min-h-screen bg-ink">
      {/* Aurora Background */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="font-cinzel text-2xl font-bold text-cyan-300">Admin Dashboard</h1>
            <button className="btn btn-ghost text-sm">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="glass glow rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/70">{stat.label}</p>
                    <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`h-10 w-10 ${stat.color}`} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="glass glow rounded-2xl p-6">
            <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Weekly Bookings</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={bookingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(13,11,30,0.8)", border: "1px solid rgba(103,232,249,0.3)" }}
                />
                <Legend />
                <Bar dataKey="bookings" fill="#67e8f9" name="Bookings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="glass glow rounded-2xl p-6">
            <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "rgba(13,11,30,0.8)", border: "1px solid rgba(103,232,249,0.3)" }}
                />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#e879f9" name="Revenue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="glass glow rounded-2xl p-6 mt-6">
          <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Recent Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70">Client Name</th>
                  <th className="text-left py-3 px-4 text-white/70">Service</th>
                  <th className="text-left py-3 px-4 text-white/70">Date</th>
                  <th className="text-left py-3 px-4 text-white/70">Amount</th>
                  <th className="text-left py-3 px-4 text-white/70">Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "Aarav Kumar",
                    service: "KARMA Level",
                    date: "2024-01-15",
                    amount: "₹1,500",
                    status: "Completed",
                  },
                  {
                    name: "Maya Sharma",
                    service: "Cosmic Code",
                    date: "2024-01-14",
                    amount: "₹777",
                    status: "Pending",
                  },
                  { name: "Ishan Patel", service: "Flash K", date: "2024-01-13", amount: "₹100", status: "Completed" },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/10">
                    <td className="py-3 px-4 text-white">{row.name}</td>
                    <td className="py-3 px-4 text-cyan-300">{row.service}</td>
                    <td className="py-3 px-4 text-white/70">{row.date}</td>
                    <td className="py-3 px-4 font-semibold text-white">{row.amount}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          row.status === "Completed"
                            ? "bg-green-500/20 text-green-300"
                            : "bg-yellow-500/20 text-yellow-300"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
