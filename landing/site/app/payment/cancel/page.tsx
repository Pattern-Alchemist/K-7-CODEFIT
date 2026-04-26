"use client"

import { AlertCircle, ArrowLeft, RotateCcw } from "lucide-react"

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-ink text-white pt-24 pb-16 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-3xl glass glow p-8 sm:p-12 text-center">
          {/* Alert Icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-300/20 mb-6">
            <AlertCircle className="h-8 w-8 text-red-300" strokeWidth={1.5} />
          </div>

          <h1 className="font-cinzel text-3xl sm:text-4xl font-bold text-white mb-2">Payment Cancelled</h1>
          <p className="text-white/70 mb-8">
            Your payment wasn't completed. No charges were made. You can try again anytime.
          </p>

          {/* What Went Wrong */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-white mb-4">Why This Happened</h3>
            <ul className="space-y-2 text-sm text-white/80 list-disc pl-5">
              <li>You cancelled the payment in your payment app</li>
              <li>The payment window closed before completion</li>
              <li>Your payment method encountered an issue</li>
              <li>Session timed out during the transaction</li>
            </ul>
          </div>

          {/* Try Again */}
          <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-6 mb-8">
            <h4 className="font-cinzel font-semibold text-lg text-cyan-300 mb-2">Ready to Try Again?</h4>
            <p className="text-sm text-white/80 mb-4">
              Return to the home page and select your preferred payment method. Your data is safe.
            </p>
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
            <a
              href="/#booking"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 to-teal-500 text-black hover:from-cyan-600 hover:to-teal-600 transition-all"
            >
              <RotateCcw className="h-4 w-4" strokeWidth={1.5} />
              Try Again
            </a>
          </div>

          {/* FAQ */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <h3 className="font-semibold text-white mb-4">Common Questions</h3>
            <div className="space-y-4 text-left">
              <div>
                <p className="text-sm font-medium text-white mb-1">Will I be charged?</p>
                <p className="text-xs text-white/70">No. Cancelled payments are not processed at all.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Can I use a different payment method?</p>
                <p className="text-xs text-white/70">Yes, try UPI if you used PayPal, or vice versa.</p>
              </div>
              <div>
                <p className="text-sm font-medium text-white mb-1">Need help?</p>
                <p className="text-xs text-white/70">
                  Email us at{" "}
                  <a href="mailto:support@astrokalki.com" className="text-cyan-300 hover:text-cyan-200">
                    support@astrokalki.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
