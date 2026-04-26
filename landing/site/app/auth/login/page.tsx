"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      router.push("/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      <div className="w-full max-w-md">
        <div className="glass glow rounded-3xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-cinzel text-3xl font-bold text-cyan-300">AstroKalki</h1>
            <p className="text-sm text-white/70 mt-2">Sign in to your cosmic journey</p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="glass focus-ring w-full pl-10 pr-4 py-2 rounded-xl text-white placeholder-white/50"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass focus-ring w-full pl-10 pr-4 py-2 rounded-xl text-white placeholder-white/50"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn w-full justify-center mt-6">
              {loading ? "Signing in..." : "Sign In"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/50">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Footer Links */}
          <div className="space-y-2 text-center text-sm">
            <p className="text-white/70">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-cyan-300 hover:text-cyan-200">
                Sign up
              </Link>
            </p>
            <p>
              <Link href="/auth/forgot-password" className="text-cyan-300 hover:text-cyan-200">
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
