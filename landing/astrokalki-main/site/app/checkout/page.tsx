"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"

declare global {
  interface Window {
    paypal: any
  }
}

export default function CheckoutPage() {
  const [activeTab, setActiveTab] = useState<"paypal" | "upi">("paypal")
  const [status, setStatus] = useState("")
  const [upi, setUpi] = useState<{ orderId?: string; upiUri?: string; qrSvg?: string }>({})
  const [utr, setUtr] = useState("")
  const paypalContainerRef = useRef<HTMLDivElement>(null)

  const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || ""
  const CURRENCY = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY || "USD"

  const initializePayPalButtons = () => {
    if (!window.paypal || !paypalContainerRef.current) return

    paypalContainerRef.current.innerHTML = ""

    window.paypal
      .Buttons({
        style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
        createOrder: async () => {
          try {
            const response = await fetch("/api/payments/paypal/create", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ amount: "99", currency: CURRENCY }),
            })
            const data = await response.json()
            return data.id
          } catch (error) {
            console.error("Error creating order:", error)
            setStatus("Error creating PayPal order")
            return null
          }
        },
        onApprove: async (data: any) => {
          try {
            setStatus("Processing payment...")
            await fetch("/api/payments/paypal/capture", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ orderId: data.orderID }),
            })
            setStatus("Payment successful! Generating your reading...")
          } catch (error) {
            console.error("Error capturing order:", error)
            setStatus("Error processing payment")
          }
        },
        onError: (error: any) => {
          console.error("PayPal error:", error)
          setStatus(`PayPal error: ${String(error)}`)
        },
      })
      .render(paypalContainerRef.current)
  }

  useEffect(() => {
    if (activeTab === "paypal" && CLIENT_ID) {
      initializePayPalButtons()
    }
  }, [activeTab, CLIENT_ID])

  const createUpiIntent = async () => {
    try {
      setStatus("Generating UPI link...")
      const response = await fetch("/api/upi/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 99, note: "AstroKalki ₹99 Reading" }),
      })
      const data = await response.json()
      setUpi(data)
      setStatus("Scan QR or tap link. Then enter UTR after payment.")
    } catch (error) {
      console.error("Error creating UPI intent:", error)
      setStatus("Error generating UPI link")
    }
  }

  const markPaidAndProcess = async () => {
    if (!upi.orderId || !utr.trim()) {
      setStatus("Please enter your UTR")
      return
    }

    try {
      setStatus("Processing payment...")
      await fetch("/api/admin/mark-upi-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: upi.orderId,
          utr,
          email: "user@example.com",
          name: "Valued Customer",
        }),
      })
      setStatus("Payment confirmed! Generating your reading now...")
    } catch (error) {
      console.error("Error processing payment:", error)
      setStatus("Error processing payment")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 to-black text-white p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="text-teal-500 text-sm font-mono tracking-widest mb-2">ASTROKALKI</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Karma Balance Reading</h1>
          <p className="text-gray-400 text-lg">₹99 — 10-minute karmic snapshot with actionable guidance</p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => setActiveTab("paypal")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "paypal" ? "bg-blue-600 text-white" : "bg-slate-800 text-gray-300 hover:bg-slate-700"
            }`}
          >
            PayPal
          </button>
          <button
            onClick={() => setActiveTab("upi")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "upi" ? "bg-orange-600 text-white" : "bg-slate-800 text-gray-300 hover:bg-slate-700"
            }`}
          >
            UPI (India)
          </button>
        </div>

        {/* PayPal Section */}
        {activeTab === "paypal" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Pay with PayPal</h2>
              <p className="text-gray-400 text-sm">
                Secure, instant payment. Reading generated immediately after capture.
              </p>
            </div>
            {CLIENT_ID ? (
              <div ref={paypalContainerRef} className="mb-4" />
            ) : (
              <div className="p-4 bg-yellow-900/30 border border-yellow-800 rounded text-yellow-200 text-sm">
                PayPal is not configured. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your environment variables.
              </div>
            )}
            {status && <p className="text-sm text-amber-400 mt-4">{status}</p>}
          </div>
        )}

        {/* UPI Section */}
        {activeTab === "upi" && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8">
            {!upi.orderId ? (
              <button
                onClick={createUpiIntent}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition"
              >
                Generate UPI QR for ₹99
              </button>
            ) : (
              <div className="grid md:grid-cols-2 gap-8">
                {/* QR Code */}
                <div className="flex flex-col items-center">
                  <h3 className="font-semibold mb-4">Order: {upi.orderId}</h3>
                  <div className="bg-white p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: upi.qrSvg || "" }} />
                  {upi.upiUri && (
                    <a
                      href={upi.upiUri}
                      className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition"
                    >
                      Open in UPI App
                    </a>
                  )}
                </div>

                {/* UTR Form */}
                <div className="flex flex-col justify-center">
                  <label className="block text-sm font-medium mb-3">Enter UTR (after payment)</label>
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="12-digit UTR from your bank"
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 mb-4"
                  />
                  <button
                    onClick={markPaidAndProcess}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
                  >
                    Mark Paid & Generate Reading
                  </button>
                  <p className="text-xs text-gray-400 mt-4">
                    We verify your UTR and immediately generate your audio + PDF reading.
                  </p>
                </div>
              </div>
            )}
            {status && <p className="text-sm text-amber-400 mt-4">{status}</p>}
          </div>
        )}

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl mb-2">🎧</div>
            <p className="font-semibold">Audio Reading</p>
            <p className="text-sm text-gray-400">MP3 delivered instantly</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📄</div>
            <p className="font-semibold">PDF Report</p>
            <p className="text-sm text-gray-400">Formatted for your records</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">✨</div>
            <p className="font-semibold">Actionable Guidance</p>
            <p className="text-sm text-gray-400">7-day practical steps</p>
          </div>
        </div>
      </div>

      {/* PayPal Script */}
      {activeTab === "paypal" && CLIENT_ID && (
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${CLIENT_ID}&currency=${CURRENCY}`}
          strategy="afterInteractive"
          onLoad={initializePayPalButtons}
        />
      )}
    </main>
  )
}
