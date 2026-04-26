"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, LayoutDashboard, UsersIcon, Calendar, Settings, Zap } from "lucide-react"
import DashboardOverview from "./tabs/overview"
import UserManagement from "./tabs/users"
import BookingManagement from "./tabs/bookings"
import ConsultationsTab from "./tabs/consultations"
import AdminSettings from "./tabs/settings"

interface AdminDashboardClientProps {
  user: any
  orders: any[]
  leads: any[]
  profiles: any[]
  stats: {
    totalOrders: number
    completedOrders: number
    totalRevenue: number
    totalLeads: number
    totalUsers: number
  }
}

export default function AdminDashboardClient({ user, orders, leads, profiles, stats }: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "bookings" | "consultations" | "settings">(
    "overview",
  )
  const router = useRouter()

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: UsersIcon },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "consultations", label: "Consultations", icon: Zap },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const handleLogout = async () => {
    await fetch("/auth/signout", { method: "POST" })
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Aurora Background */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 backdrop-blur-md bg-slate-900/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-teal-400 flex items-center justify-center">
                <span className="text-sm font-bold text-slate-900">Λ</span>
              </div>
              <div>
                <h1 className="font-cinzel text-lg font-bold text-white">AstroKalki Admin</h1>
                <p className="text-xs text-white/50 mt-0.5">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition text-sm"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Tab Navigation - CHANGE: Added proper horizontal scroll and better styling */}
          <div className="flex gap-1 pb-0 border-t border-white/5 pt-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-all duration-200 border-b-2 ${
                    isActive
                      ? "border-cyan-400 text-cyan-300 bg-cyan-400/5"
                      : "border-transparent text-white/60 hover:text-white/80 hover:border-white/20"
                  }`}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* CHANGE: Wrapped content with smooth transition */}
        <div className="animate-in fade-in duration-200">
          {activeTab === "overview" && <DashboardOverview orders={orders} leads={leads} stats={stats} />}
          {activeTab === "users" && <UserManagement profiles={profiles} />}
          {activeTab === "bookings" && <BookingManagement orders={orders} leads={leads} />}
          {activeTab === "consultations" && <ConsultationsTab />}
          {activeTab === "settings" && <AdminSettings />}
        </div>
      </main>
    </div>
  )
}
