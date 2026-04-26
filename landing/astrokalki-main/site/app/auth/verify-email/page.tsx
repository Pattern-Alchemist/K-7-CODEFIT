"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Mail, CheckCircle2 } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "")
  const confirmed = searchParams.get("confirmed") === "true"

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      <div className="w-full max-w-md">
        <div className="glass glow rounded-3xl p-8 text-center">
          <div className="mb-6 flex justify-center">
            {confirmed ? (
              <CheckCircle2 className="h-16 w-16 text-green-400" strokeWidth={1.5} />
            ) : (
              <Mail className="h-16 w-16 text-cyan-400" strokeWidth={1.5} />
            )}
          </div>

          <h1 className="font-cinzel text-3xl font-bold text-white mb-2">
            {confirmed ? "Email Verified!" : "Verify Your Email"}
          </h1>
          <p className="text-white/70 mb-6">
            {confirmed
              ? "Your email has been verified. You can now sign in to your account."
              : "We've sent a verification link to your email. Please click it to confirm your account."}
          </p>

          <Link href="/auth/login" className="btn w-full justify-center inline-block">
            Continue to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-ink flex items-center justify-center text-white">Loading...</div>}
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
