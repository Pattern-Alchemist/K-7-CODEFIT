"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { User, Mail, Phone, MapPin, Calendar, LogOut, Edit2, Save, X, Crown, Sparkles } from "lucide-react"

interface ProfileContentProps {
  initialProfile: any
  initialSubscription: any
}

export default function ProfileContent({ initialProfile, initialSubscription }: ProfileContentProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(initialProfile)
  const [originalProfile, setOriginalProfile] = useState(initialProfile)
  const [isSaving, setIsSaving] = useState(false)
  const [subscription, setSubscription] = useState(initialSubscription)
  const router = useRouter()

  useEffect(() => {
    setOriginalProfile(initialProfile)
  }, [initialProfile])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          phone: profile.phone,
          dob: profile.dob,
          location: profile.location,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      setOriginalProfile(profile)
      setIsEditing(false)
    } catch (err) {
      console.error("Save error:", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setProfile(originalProfile)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="text-white">Profile not found</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ink pt-24">
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      <main className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-cinzel text-3xl font-bold text-cyan-300">My Profile</h1>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button onClick={handleSave} disabled={isSaving} className="btn text-sm">
                  <Save className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button onClick={handleCancel} className="btn btn-ghost text-sm">
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn text-sm">
                <Edit2 className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="glass glow rounded-3xl p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400 flex items-center justify-center">
              <User className="h-12 w-12 text-ink" />
            </div>
            <div className="flex-1">
              <h2 className="font-cinzel text-2xl font-bold text-white">{profile.name || "User"}</h2>
              <p className="text-white/70">Cosmic Explorer</p>
              {subscription && (
                <div className="flex items-center gap-2 mt-2">
                  <Crown className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-400">{subscription.plan?.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Info */}
          <div className="space-y-4">
            {[
              { icon: Mail, label: "Email", key: "email", readonly: true },
              { icon: Phone, label: "Phone", key: "phone" },
              { icon: Calendar, label: "Date of Birth", key: "dob", type: "date" },
              { icon: MapPin, label: "Location", key: "location" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.key} className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                  <Icon className="h-5 w-5 text-cyan-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-white/70">{item.label}</p>
                    {isEditing && !item.readonly ? (
                      <input
                        type={item.type || "text"}
                        value={profile[item.key] || ""}
                        onChange={(e) => setProfile({ ...profile, [item.key]: e.target.value })}
                        className="glass focus-ring w-full mt-1 px-3 py-2 rounded-lg text-white"
                      />
                    ) : (
                      <p className="text-white font-medium">{profile[item.key] || "—"}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Subscription Status Section */}
        {subscription && (
          <div className="glass glow rounded-3xl p-8 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-cinzel text-xl font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Active Subscription
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  subscription.status === "active"
                    ? "bg-green-500/20 text-green-300"
                    : "bg-yellow-500/20 text-yellow-300"
                }`}
              >
                {subscription.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-white/70">Plan</p>
                <p className="text-white font-semibold">{subscription.plan?.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-white/70">Consultations Left</p>
                <p className="text-white font-semibold">
                  {(subscription.plan?.consultations_per_month || 0) - subscription.consultations_used}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-white/70">Renews On</p>
                <p className="text-white font-semibold">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-sm text-white/70">Monthly Price</p>
                <p className="text-white font-semibold">₹{subscription.plan?.price_monthly}</p>
              </div>
            </div>
            <a href="/subscription/plans" className="btn btn-ghost w-full justify-center mt-4 text-sm">
              Manage Subscription
            </a>
          </div>
        )}

        {/* Upgrade CTA if no subscription */}
        {!subscription && (
          <div className="glass glow rounded-3xl p-8 mt-8 text-center">
            <Crown className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
            <h3 className="font-cinzel text-xl font-semibold text-white mb-2">Unlock Premium Benefits</h3>
            <p className="text-white/70 mb-4">
              Subscribe to get unlimited consultations, priority support, and exclusive cosmic insights
            </p>
            <a href="/subscription/plans" className="btn w-full justify-center">
              <Sparkles className="h-4 w-4" />
              View Subscription Plans
            </a>
          </div>
        )}

        {/* Bookings History */}
        <div className="glass glow rounded-3xl p-8 mt-8">
          <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Recent Consultations</h3>
          <div className="space-y-3">
            {[
              { service: "KARMA Level", date: "2024-01-15", status: "Completed" },
              { service: "Cosmic Code", date: "2024-01-10", status: "Completed" },
              { service: "Flash K", date: "2024-01-05", status: "Completed" },
            ].map((booking, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                <div>
                  <p className="text-white font-medium">{booking.service}</p>
                  <p className="text-sm text-white/70">{booking.date}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-xs font-semibold">
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Consultations Section */}
        <div className="glass glow rounded-3xl p-8 mt-8">
          <h3 className="font-cinzel text-xl font-semibold text-white mb-4">My Consultations</h3>
          <div className="space-y-3">
            {[
              { service: "KARMA Level", date: "2024-02-15", status: "Scheduled", time: "3:00 PM" },
              { service: "Cosmic Code", date: "2024-01-20", status: "Completed", time: "2:00 PM" },
              { service: "Flash K", date: "2024-01-10", status: "Completed", time: "11:00 AM" },
            ].map((consultation, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div>
                  <p className="text-white font-medium">{consultation.service}</p>
                  <p className="text-sm text-white/70">
                    {consultation.date} at {consultation.time}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${consultation.status === "Completed" ? "bg-green-500/20 text-green-300" : "bg-blue-500/20 text-blue-300"}`}
                >
                  {consultation.status}
                </span>
              </div>
            ))}
          </div>
          <a href="/consultations" className="btn mt-4 w-full justify-center text-sm">
            View All Consultations
          </a>
        </div>

        {/* Book a New Consultation */}
        <a href="/#booking" className="btn btn-ghost w-full justify-center mt-4">
          Book a New Consultation
        </a>

        {/* Logout */}
        <button onClick={handleLogout} className="btn btn-ghost w-full justify-center mt-8">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </main>
    </div>
  )
}
