"use client"

import { useState } from "react"
import { Save, AlertCircle, CheckCircle2 } from "lucide-react"

export default function AdminSettings() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    businessName: "AstroKalki",
    adminEmail: "admin@astrokalki.com",
    supportEmail: "support@astrokalki.com",
    maintenanceMode: false,
    enableNewBookings: true,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Business Settings */}
      <div className="glass glow rounded-2xl p-6">
        <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Business Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-2">Business Name</label>
            <input
              type="text"
              value={settings.businessName}
              onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
              className="w-full glass focus-ring rounded-xl px-4 py-2 text-white"
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Admin Email</label>
              <input
                type="email"
                value={settings.adminEmail}
                onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                className="w-full glass focus-ring rounded-xl px-4 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Support Email</label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="w-full glass focus-ring rounded-xl px-4 py-2 text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className="glass glow rounded-2xl p-6">
        <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Feature Controls</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="font-medium text-white">Maintenance Mode</p>
              <p className="text-xs text-white/60 mt-1">Disable all user features temporarily</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.maintenanceMode ? "bg-red-500" : "bg-green-500/30"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  settings.maintenanceMode ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-white/5 border border-white/10">
            <div>
              <p className="font-medium text-white">Enable New Bookings</p>
              <p className="text-xs text-white/60 mt-1">Allow users to create new bookings</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, enableNewBookings: !settings.enableNewBookings })}
              className={`relative w-12 h-6 rounded-full transition ${
                settings.enableNewBookings ? "bg-green-500/50" : "bg-red-500/30"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition ${
                  settings.enableNewBookings ? "translate-x-6" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="glass glow rounded-2xl p-6">
        <h3 className="font-cinzel text-xl font-semibold text-white mb-4">API Configuration</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-300 flex-shrink-0 mt-0.5" strokeWidth={1.5} />
            <p className="text-yellow-200">API keys are managed in your Vercel Environment Variables</p>
          </div>
          <div className="grid gap-2">
            <p className="text-white/70">Required Variables:</p>
            <ul className="list-disc list-inside space-y-1 text-white/50 text-xs">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              <li>NEXT_PUBLIC_PAYPAL_CLIENT_ID</li>
              <li>PAYPAL_CLIENT_SECRET</li>
              <li>UPI_VPA</li>
              <li>NEXT_PUBLIC_PAYPAL_CURRENCY</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button onClick={handleSave} className="btn flex items-center gap-2">
          <Save className="h-4 w-4" strokeWidth={1.5} />
          Save Settings
        </button>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/20 text-green-300">
            <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
            Saved!
          </div>
        )}
      </div>
    </div>
  )
}
