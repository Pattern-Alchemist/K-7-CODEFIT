"use client"

import { useSearchParams } from "next/navigation"
import { Check, Download, ArrowLeft } from "lucide-react"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const transactionId = searchParams.get("transactionId") || "UNKNOWN"
  const method = searchParams.get("method") || "payment"

  return (
    <div className="min-h-screen bg-ink text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl glass glow p-8 sm:p-12 text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-cyan-300/20 mb-6">
            <Check className="h-8 w-8 text-cyan-300" strokeWidth={1.5} />
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-white/70 mb-6">
            Your karmic reading has been initiated. We'll send you a personalized audio message within 24 hours.
          </p>

          {/* Transaction Details */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-white/60 mb-1">Transaction ID</p>
                <p className="font-mono text-sm text-cyan-300 break-all">{transactionId}</p>
              </div>
              <div>
                <p className="text-sm text-white/60 mb-1">Payment Method</p>
                <p className="text-white capitalize">{method === "upi" ? "UPI" : "PayPal"}</p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-br from-cyan-400/10 via-indigo-500/10 to-fuchsia-500/10 rounded-2xl border border-white/10 p-6 mb-8 text-left">
            <h3 className="font-cinzel font-semibold text-lg text-white mb-4">What Happens Next</h3>
            <ol className="space-y-3 text-sm text-white/80">
              <li className="flex gap-3">
                <span className="text-cyan-300 font-semibold min-w-6">1.</span>
                <span>We receive your payment and activate your reading</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300 font-semibold min-w-6">2.</span>
                <span>Within 24 hours, you'll receive a personalized audio message</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300 font-semibold min-w-6">3.</span>
                <span>Download your complete PDF report and actionable remedies</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300 font-semibold min-w-6">4.</span>
                <span>Optionally book a 1-on-1 consultation for deeper insights</span>
              </li>
            </ol>
          </div>

          {/* Actionable Summary */}
          <div className="rounded-2xl border border-white/20 bg-white/5 p-6 mb-8 text-left">
            <h4 className="font-cinzel font-semibold text-lg text-white mb-3">Start Your Alignment Today</h4>
            <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
              <li>Morning ritual: 5-minute breath work (4-7-8 count)</li>
              <li>Reach out to one person who challenged you last year</li>
              <li>Choose one ritual color for this week: Teal</li>
              <li>Journal one intention before bed each night</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
              Back to Home
            </a>
            <button className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-600 hover:to-teal-600 transition-all">
              <Download className="h-4 w-4" strokeWidth={1.5} />
              Download Report
            </button>
          </div>

          {/* Support */}
          <p className="mt-8 text-xs text-white/50">
            Questions? Contact us at{" "}
            <a href="mailto:support@astrokalki.com" className="text-cyan-300 hover:text-cyan-200">
              support@astrokalki.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
