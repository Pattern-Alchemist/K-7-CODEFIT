"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogIn } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to dashboard
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="rounded-lg bg-white/5 border border-white/10 backdrop-blur p-8">
          <h1 className="text-3xl font-bold text-center font-cinzel mb-2">Admin Portal</h1>
          <p className="text-center text-slate-400 text-sm mb-6">Sign in to access the dashboard</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-300/40 focus:outline-none transition"
                placeholder="admin@astrokalki.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-slate-500 focus:border-cyan-300/40 focus:outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded px-3 py-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-medium py-2 hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" strokeWidth={1.5} />
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-400 text-xs mt-4">For admin access, contact: support@astrokalki.com</p>
        </div>
      </div>
    </div>
  )
}
