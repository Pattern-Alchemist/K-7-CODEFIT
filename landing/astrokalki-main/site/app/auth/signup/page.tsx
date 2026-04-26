"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Mail, Lock, User, ArrowRight, AlertCircle } from "lucide-react"

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    dob: "",
    location: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const supabase = createClient()

      // Create auth user
      const { data: authData, error: signupError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback`,
        },
      })

      if (signupError) throw signupError

      if (!authData.user) {
        throw new Error("Failed to create user account")
      }

      // Create profile in profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email: formData.email,
        name: formData.name,
        dob: formData.dob || null,
        location: formData.location || null,
        created_at: new Date().toISOString(),
      })

      if (profileError) throw profileError

      // Redirect to verification page
      router.push("/auth/verify-email")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
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
            <h1 className="font-cinzel text-3xl font-bold text-cyan-300">Join AstroKalki</h1>
            <p className="text-sm text-white/70 mt-2">Begin your cosmic journey</p>
          </div>

          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your name"
                  className="glass focus-ring w-full pl-10 pr-4 py-2 rounded-xl text-white placeholder-white/50"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-cyan-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="glass focus-ring w-full pl-10 pr-4 py-2 rounded-xl text-white placeholder-white/50"
                  required
                />
              </div>
              <p className="text-xs text-white/50 mt-1">Minimum 8 characters</p>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Date of Birth (optional)</label>
              <input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="glass focus-ring w-full px-4 py-2 rounded-xl text-white"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-white mb-2">Location (optional)</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="City, Country"
                className="glass focus-ring w-full px-4 py-2 rounded-xl text-white placeholder-white/50"
              />
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn w-full justify-center mt-6">
              {loading ? "Creating account..." : "Sign Up"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-6 text-center text-sm">
            <p className="text-white/70">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-cyan-300 hover:text-cyan-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
