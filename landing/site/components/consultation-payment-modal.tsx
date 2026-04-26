"use client"

import { useState } from "react"
import { AlertCircle, CreditCard, QrCode, Loader } from "lucide-react"

interface ConsultationPaymentModalProps {
  consultationId: string
  amount: number
  onSuccess: () => void
  onCancel: () => void
}

export function ConsultationPaymentModal({
  consultationId,
  amount,
  onSuccess,
  onCancel,
}: ConsultationPaymentModalProps) {
  const [method, setMethod] = useState<"upi" | "paypal" | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)

  const handlePayment = async (paymentMethod: "upi" | "paypal") => {
    setLoading(true)
    setError(null)
    setMethod(paymentMethod)

    try {
      const response = await fetch("/api/consultations/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId,
          amount,
          method: paymentMethod,
        }),
      })

      if (!response.ok) throw new Error("Payment initiation failed")

      const data = await response.json()

      if (paymentMethod === "upi") {
        if (data.deepLink) {
          window.open(data.deepLink, "_blank")
        }
        if (data.qrCode) {
          setQrCode(data.qrCode)
        }
        // Verify payment after delay
        setTimeout(verifyPayment, 3000)
      } else if (paymentMethod === "paypal") {
        if (data.approvalUrl) {
          window.open(data.approvalUrl, "_blank")
        }
        setTimeout(verifyPayment, 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed")
      setLoading(false)
    }
  }

  const verifyPayment = async () => {
    try {
      const response = await fetch("/api/consultations/payment/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId,
          paymentId: consultationId,
          status: "success",
        }),
      })

      if (response.ok) {
        onSuccess()
      }
    } catch (err) {
      console.error("Payment verification error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass glow rounded-2xl p-8 max-w-md w-full">
      <h3 className="font-cinzel text-2xl font-bold text-white mb-2">Complete Payment</h3>
      <p className="text-cyan-300 text-lg mb-6">Amount: ${amount}</p>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex gap-2">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {qrCode && (
        <div className="mb-6 p-4 rounded-lg bg-white/10 border border-white/20 text-center">
          <img src={qrCode || "/placeholder.svg"} alt="UPI QR Code" className="w-full max-w-xs mx-auto" />
          <p className="text-white/70 text-sm mt-2">Scan to pay via UPI</p>
        </div>
      )}

      {!method ? (
        <div className="space-y-3">
          <button onClick={() => handlePayment("upi")} disabled={loading} className="btn w-full justify-center">
            <QrCode className="h-4 w-4" />
            Pay with UPI
          </button>
          <button
            onClick={() => handlePayment("paypal")}
            disabled={loading}
            className="btn btn-ghost w-full justify-center"
          >
            <CreditCard className="h-4 w-4" />
            Pay with PayPal
          </button>
          <button onClick={onCancel} disabled={loading} className="btn btn-ghost w-full text-sm text-white/70">
            Cancel
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="text-center py-6">
            {loading ? (
              <>
                <Loader className="h-8 w-8 animate-spin text-cyan-300 mx-auto mb-2" />
                <p className="text-white/70">Processing payment...</p>
              </>
            ) : (
              <p className="text-white/70">Redirecting to {method.toUpperCase()}...</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
