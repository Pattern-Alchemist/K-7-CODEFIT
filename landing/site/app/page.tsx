"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import {
  Loader,
  CreditCard,
  QrCode,
  Download,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
  Zap,
} from "lucide-react"

import Chart from "chart.js/auto"
import SiteHeader from "@/components/SiteHeader"
import ServiceCards from "@/components/service-cards"
import KarmicToolsSuite from "@/components/karmic-tools-suite"
import { ConsultationBookingModal } from "@/components/consultation-booking-modal"

export default function HomePage() {
  // FOOTER YEAR
  const year = new Date().getFullYear()

  const [consultationModalOpen, setConsultationModalOpen] = useState(false)

  // =========================
  // MICROREADING FLOW STATE
  // =========================
  const [microStep, setMicroStep] = useState<1 | 2 | 3>(1)

  const startPayment = async (method: "upi" | "paypal") => {
    setMicroStep(2)

    try {
      if (method === "upi") {
        const response = await fetch("/api/payments/upi/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: 99,
            phoneNumber: "9211271977",
            orderId: null,
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Open UPI deep link in a new window for mobile/app
          if (data.deepLink) {
            window.open(data.deepLink, "_blank")
          }
          setTimeout(() => setMicroStep(3), 2000)
        } else {
          alert("Payment failed: " + data.error)
          setMicroStep(1)
        }
      } else if (method === "paypal") {
        const response = await fetch("/api/payments/paypal/pay", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.JSONstringify({
            amount: 5,
            orderId: null,
          }),
        })

        const data = await response.json()

        if (data.success) {
          // Redirect to PayPal approval URL if available
          if (data.approvalUrl) {
            window.open(data.approvalUrl, "_blank")
          } else {
            alert(`Send $5 to: ${data.paypalEmail}`)
          }
          setTimeout(() => setMicroStep(3), 2000)
        } else {
          alert("Payment failed: " + data.error)
          setMicroStep(1)
        }
      }
    } catch (err) {
      alert("Payment error. Please try again.")
      setMicroStep(1)
    }
  }

  // =========================
  // KARMIC MAP CHART
  // =========================
  const karmicRef = useRef<HTMLCanvasElement | null>(null)
  const karmicChartRef = useRef<Chart | null>(null)

  const renderKarmicChart = useCallback(() => {
    if (!karmicRef.current) return

    const ctx = karmicRef.current.getContext("2d")
    if (!ctx) return

    if (karmicChartRef.current) {
      karmicChartRef.current.destroy()
    }

    const dataVals = [65, 48, 72, 40, 58, 85]

    const gradientCyan = ctx.createLinearGradient(0, 0, 0, 300)
    gradientCyan.addColorStop(0, "rgba(103,232,249,0.7)")
    gradientCyan.addColorStop(1, "rgba(86,179,168,0.2)")

    const gradientFuschia = ctx.createLinearGradient(0, 0, 0, 300)
    gradientFuschia.addColorStop(0, "rgba(232,121,249,0.7)")
    gradientFuschia.addColorStop(1, "rgba(13,11,30,0.2)")

    karmicChartRef.current = new Chart(ctx, {
      type: "polarArea",
      data: {
        labels: ["Dharma", "Artha", "Kama", "Moksha", "Saturn", "Jupiter"],
        datasets: [
          {
            data: dataVals,
            backgroundColor: [
              gradientCyan,
              "rgba(86,179,168,0.4)",
              gradientFuschia,
              "rgba(232,121,249,0.35)",
              "rgba(103,232,249,0.35)",
              "rgba(86,179,168,0.35)",
            ],
            borderColor: "rgba(255,255,255,0.35)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          r: {
            grid: { color: "rgba(255,255,255,0.15)" },
            angleLines: { color: "rgba(255,255,255,0.15)" },
            ticks: { display: false },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
        },
      },
    })
  }, [])

  useEffect(() => {
    renderKarmicChart()
  }, [renderKarmicChart])

  // =========================
  // TESTIMONIALS CAROUSEL
  // =========================
  const [tIndex, setTIndex] = useState(0)

  const testimonials = [
    {
      name: "Aarav",
      location: "Pune",
      quote: "The Karmic Map read me like a mirror. Subtle nudges, clear next steps. I felt seen.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
    },
    {
      name: "Maya",
      location: "Bengaluru",
      quote: "Daily previews feel like gentle course-corrections. The design is otherworldly.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    {
      name: "Ishan",
      location: "Toronto",
      quote: "The Relationship Analyzer gave us a realistic plan, not fairy dust. It worked.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
  ]

  const handlePrev = () => {
    setTIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1))
  }

  const handleNext = () => {
    setTIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-950 text-white font-inter">
      <SiteHeader />

      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-purple-900/10 via-transparent to-transparent" />
      </div>

      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      </div>

      <div aria-hidden="true" className="fixed inset-0 -z-10">
        <div className="particle absolute left-12 top-24 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
        <div className="particle absolute right-16 top-1/3 h-2 w-2 rounded-full bg-purple-400 animate-pulse delay-75" />
        <div className="particle absolute bottom-32 left-1/3 h-2 w-2 rounded-full bg-cyan-400 animate-pulse delay-150" />
      </div>

      <main id="home" className="pt-20 sm:pt-24">
        <section className="section-spacing relative">
          <div className="section-container">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-8 max-w-2xl">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-300">Vedic Astrology Powered by AI</span>
                  </div>

                  <h1 className="font-cinzel text-5xl sm:text-6xl lg:text-7xl font-bold text-balance leading-[1.1] bg-gradient-to-br from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                    Decode Your Cosmic Blueprint
                  </h1>

                  <p className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-xl">
                    Get personalized karmic insights with actionable guidance. Ancient Vedic wisdom meets modern AI
                    technology.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <a
                    href="#booking"
                    className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105"
                  >
                    <Zap className="h-5 w-5" />
                    <span>Start Your Reading</span>
                  </a>

                  <button
                    onClick={() => setConsultationModalOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold transition-all backdrop-blur-sm"
                  >
                    <Star className="h-5 w-5" />
                    <span>1-on-1 Session</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                      10K+
                    </div>
                    <p className="text-sm text-slate-400">Readings Delivered</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      4.9★
                    </div>
                    <p className="text-sm text-slate-400">Average Rating</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-br from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                      50+
                    </div>
                    <p className="text-sm text-slate-400">Countries Served</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-slate-900/50 to-indigo-900/50 backdrop-blur-xl p-8 aspect-square flex items-center justify-center">
                  <svg className="w-full h-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                      <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#a855f7" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>

                    <line
                      x1="80"
                      y1="80"
                      x2="200"
                      y2="120"
                      stroke="url(#lineGradient1)"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />
                    <line
                      x1="200"
                      y1="120"
                      x2="320"
                      y2="80"
                      stroke="url(#lineGradient1)"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />
                    <line
                      x1="320"
                      y1="80"
                      x2="320"
                      y2="200"
                      stroke="url(#lineGradient1)"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />
                    <line
                      x1="320"
                      y1="200"
                      x2="200"
                      y2="280"
                      stroke="url(#lineGradient1)"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />
                    <line
                      x1="200"
                      y1="280"
                      x2="80"
                      y2="200"
                      stroke="url(#lineGradient1)"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />
                    <line
                      x1="80"
                      y1="200"
                      x2="80"
                      y2="80"
                      stroke="url(#lineGradient1)"
                      strokeWidth="2"
                      filter="url(#glow)"
                    />

                    <circle
                      cx="200"
                      cy="180"
                      r="35"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      opacity="0.8"
                      filter="url(#glow)"
                    />
                    <circle
                      cx="200"
                      cy="180"
                      r="50"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="1.5"
                      opacity="0.4"
                      filter="url(#glow)"
                    />
                    <circle
                      cx="200"
                      cy="180"
                      r="65"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="1"
                      opacity="0.2"
                      strokeDasharray="5,5"
                      filter="url(#glow)"
                    />

                    <circle cx="80" cy="80" r="6" fill="#06b6d4" filter="url(#glow)" />
                    <circle cx="200" cy="120" r="7" fill="#a855f7" filter="url(#glow)" />
                    <circle cx="320" cy="80" r="5" fill="#06b6d4" filter="url(#glow)" />
                    <circle cx="320" cy="200" r="6" fill="#a855f7" filter="url(#glow)" />
                    <circle cx="200" cy="280" r="7" fill="#06b6d4" filter="url(#glow)" />
                    <circle cx="80" cy="200" r="6" fill="#a855f7" filter="url(#glow)" />
                    <circle cx="200" cy="180" r="5" fill="#ffffff" filter="url(#glow)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-12 border-y border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <div className="section-container">
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                  ₹99
                </div>
                <p className="text-sm text-slate-400">Quick Microreading</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  10 min
                </div>
                <p className="text-sm text-slate-400">Instant Insights</p>
              </div>
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-br from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  24/7
                </div>
                <p className="text-sm text-slate-400">Always Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section id="pricing" className="relative mt-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-cinzel text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-br from-white via-cyan-100 to-purple-200 bg-clip-text text-transparent">
                Choose Your Cosmic Journey
              </h2>
              <p className="text-lg text-slate-300">Simple pricing. No hidden fees. Start your transformation today.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Flash K – Quick Insight */}
              <div className="group relative rounded-2xl p-8 bg-gradient-to-br from-slate-900/50 to-indigo-900/50 border border-white/10 hover:border-cyan-500/50 transition-all backdrop-blur-xl hover:scale-105">
                <div className="absolute -inset-px bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
                <div className="relative">
                  <h3 className="font-cinzel text-2xl font-semibold mb-2">Flash K</h3>
                  <p className="text-sm text-slate-400 mb-6">Instant clarity on any question</p>
                  <div className="mb-6">
                    <span className="text-5xl font-bold bg-gradient-to-br from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                      ₹100
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 text-sm text-slate-300">
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>1 Specific Question</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>Personal Voice message: 5–10 mins</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <span>1 Simple Remedy</span>
                    </li>
                  </ul>
                  <a
                    href="#booking"
                    className="block w-full text-center px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold transition-all"
                  >
                    Book Now
                  </a>
                </div>
              </div>

              {/* Cosmic Code – Astrology + Numerology */}
              <div className="glass glow flex flex-col rounded-2xl p-6 hover:border-cyan-300/40 border border-white/10 transition-all">
                <h3 className="font-cinzel title-tight text-xl font-semibold">Cosmic Code</h3>
                <p className="mt-1 text-sm text-white/70">Reveal your cosmic blueprint.</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-cyan-200">₹777</div>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-white/80 flex-grow">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Life Path + Future events</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Audio call: 20 mins + PDF Report</span>
                  </li>
                </ul>
                <a href="#booking" className="btn mt-6 w-full justify-center text-sm font-medium">
                  Book Now
                </a>
              </div>

              {/* KARMA Level */}
              <div className="glass glow flex flex-col rounded-2xl p-6 border-2 border-cyan-300/40 hover:border-cyan-300/60 transition-all lg:col-span-1 md:col-span-2 md:max-w-md lg:max-w-none">
                <h3 className="font-cinzel title-tight text-xl font-semibold">KARMA Level</h3>
                <span className="badge bg-cyan-300/30 text-xs w-fit mt-2">Most Popular</span>
                <p className="mt-3 text-sm text-white/70">Your personalized karmic insight session.</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-cyan-200">₹1,500</div>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-white/80 flex-grow">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>3 Questions covered in depth</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Audio call: 25-30 mins + follow-up</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Complete PDF Report</span>
                  </li>
                </ul>
                <a href="#booking" className="btn mt-6 w-full justify-center text-sm font-medium">
                  Book Now
                </a>
              </div>

              {/* KARMIC RELEASE */}
              <div className="glass glow flex flex-col rounded-2xl p-6 hover:border-cyan-300/40 border border-white/10 transition-all">
                <h3 className="font-cinzel title-tight text-xl font-semibold">KARMA RELEASE</h3>
                <p className="mt-1 text-sm text-white/70">Past-Present-Future deep dive.</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-cyan-200">₹4,500</div>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-white/80 flex-grow">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Past, Present and Future Predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Karmic analysis + Current Transits</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Video Session: 45–60 mins</span>
                  </li>
                </ul>
                <a href="#booking" className="btn mt-6 w-full justify-center text-sm font-medium">
                  Book Now
                </a>
              </div>

              {/* THE MOKSHA ROADMAP */}
              <div className="glass glow flex flex-col rounded-2xl p-6 hover:border-cyan-300/40 border border-white/10 transition-all">
                <h3 className="font-cinzel title-tight text-xl font-semibold">MOKSHA ROADMAP</h3>
                <p className="mt-1 text-sm text-white/70">12-18 month future roadmap.</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-cyan-200">₹8,888</div>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-white/80 flex-grow">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Full Chart + 12–18 Month Future Roadmap</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Future events decoding + Early path navigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Video Session: 60–75 mins + Two Follow-Up Calls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Complete PDF Report</span>
                  </li>
                </ul>
                <a href="#booking" className="btn mt-6 w-full justify-center text-sm font-medium">
                  Book Now
                </a>
              </div>

              {/* WALK for DHARMA */}
              <div className="glass glow flex flex-col rounded-2xl p-6 hover:border-cyan-300/40 border border-white/10 transition-all">
                <h3 className="font-cinzel title-tight text-xl font-semibold">WALK for DHARMA</h3>
                <p className="mt-1 text-sm text-white/70">Personal cosmic blueprint + 3-month access.</p>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-cyan-200">₹33,999</div>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-white/80 flex-grow">
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Personal Soul Blueprint decoded</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Custom Sadhana Plan + Karmic realignment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Priority 1-on-1 Access for 3 months + Tools + WhatsApp guidance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-teal-300 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                    <span>Access to lectures, crystals, rudraksha recommendations</span>
                  </li>
                </ul>
                <a href="#booking" className="btn mt-6 w-full justify-center text-sm font-medium">
                  Book Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section id="testimonials" className="relative mt-16 sm:mt-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="glass glow rounded-3xl p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-cinzel title-tight text-2xl font-semibold">Stories from the cosmos</h3>
                <div className="flex items-center gap-2">
                  <button
                    className="btn btn-ghost px-3 text-sm hover:bg-white/10"
                    aria-label="Previous"
                    onClick={handlePrev}
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    className="btn btn-ghost px-3 text-sm hover:bg-white/10"
                    aria-label="Next"
                    onClick={handleNext}
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${tIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="min-w-full flex-shrink-0">
                      <div className="glass rounded-2xl p-6 sm:p-8 max-w-3xl mx-auto">
                        <div className="flex items-center gap-4 mb-6">
                          <img
                            className="h-14 w-14 rounded-full object-cover ring-2 ring-cyan-400/30"
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                          />
                          <div>
                            <div className="font-semibold text-lg text-white">{testimonial.name}</div>
                            <div className="text-sm text-cyan-300">{testimonial.location}</div>
                          </div>
                        </div>
                        <p className="text-base sm:text-lg text-white/90 leading-relaxed italic">
                          "{testimonial.quote}"
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTIndex(index)}
                    className={`h-2 w-2 rounded-full transition-all ${
                      index === tIndex ? "bg-cyan-400 w-8" : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* NEW SERVICE CARDS SECTION */}
        <ServiceCards />

        {/* NEW KARMIC TOOLS SUITE SECTION */}
        <KarmicToolsSuite />

        {/* BOOKING / LEADS */}
        <section id="booking" className="relative mt-16 sm:mt-24 text-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Lead form */}
              <div className="rounded-3xl glass glow p-6">
                <h3 className="font-cinzel title-tight text-2xl font-semibold">Lead &amp; Booking Form</h3>
                <p className="text-sm text-white/70">We reply within 24 hours.</p>

                <form
                  className="mt-4 grid gap-4 sm:grid-cols-2"
                  onSubmit={async (e) => {
                    e.preventDefault()
                    setIsSubmittingBooking(true)

                    // Simulate API call
                    await new Promise((resolve) => setTimeout(resolve, 1500))

                    setIsSubmittingBooking(false)
                    const success = document.getElementById("lead-success")
                    if (success) {
                      success.classList.remove("hidden")
                      // Auto-hide after 5 seconds
                      setTimeout(() => {
                        success.classList.add("hidden")
                      }, 5000)
                    }
                    // Reset form
                    e.currentTarget.reset()
                  }}
                >
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-sm">Full Name</label>
                    <input
                      name="name"
                      type="text"
                      required
                      className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Phone</label>
                    <input
                      name="phone"
                      type="tel"
                      required
                      className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">DOB</label>
                    <input
                      name="dob"
                      type="date"
                      required
                      className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm">Location</label>
                    <input
                      name="location"
                      type="text"
                      required
                      className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      className="btn w-full justify-center text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed relative"
                      type="submit"
                      disabled={isSubmittingBooking}
                    >
                      {isSubmittingBooking ? (
                        <>
                          <Loader className="h-4 w-4 animate-spin mr-2" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        "Submit"
                      )}
                    </button>
                  </div>
                </form>

                <div
                  id="lead-success"
                  className="hidden mt-4 rounded-2xl glass p-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-500"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 mb-3">
                    <Check className="h-6 w-6 text-cyan-300" strokeWidth={2} />
                  </div>
                  <p className="font-semibold text-lg mb-1">🎉 Thank you!</p>
                  <p className="text-sm text-white/70">
                    Your cosmic journey begins now. We'll reach out within 24 hours.
                  </p>
                </div>
              </div>

              {/* Microreading Flow - Simplified with UPI & PayPal only */}
              <div className="rounded-3xl glass glow p-6">
                <h3 className="font-cinzel title-tight text-2xl font-semibold">Microreading</h3>
                <p className="text-sm text-white/70 mt-2">Quick cosmic insight for ₹99</p>

                <div className="mt-4 space-y-4 text-white text-xs sm:text-sm">
                  {/* STEP 1 - Payment Methods */}
                  {microStep === 1 && (
                    <div className="glass rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="font-medium">Choose Payment Method</div>
                        <CreditCard className="h-4 w-4 text-cyan-300" strokeWidth={1.5} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => startPayment("upi")}
                          className="btn text-xs sm:text-sm py-2 justify-center"
                        >
                          <QrCode className="h-3.5 w-3.5" strokeWidth={1.5} />
                          <span>UPI (₹99)</span>
                        </button>
                        <button
                          onClick={() => startPayment("paypal")}
                          className="btn btn-ghost text-xs sm:text-sm py-2 justify-center"
                        >
                          <span>PayPal ($5)</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 - Processing */}
                  {microStep === 2 && (
                    <div className="glass rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">Processing Payment</div>
                        <Loader className="h-4 w-4 animate-spin text-cyan-300" strokeWidth={1.5} />
                      </div>
                      <div className="mt-3 rounded-xl bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/20 to-teal-500/20 p-2 sm:p-3 text-xs sm:text-sm">
                        Aligning orbits, mapping karma…
                      </div>
                    </div>
                  )}

                  {/* STEP 3 - Download */}
                  {microStep === 3 && (
                    <div className="glass rounded-2xl p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">✨ Reading Ready</div>
                        <Check className="h-5 w-5 text-green-400" strokeWidth={2} />
                      </div>
                      <p className="text-xs sm:text-sm text-white/80 mb-3">
                        Your personalized reading is ready to download.
                      </p>
                      <div className="flex gap-2 flex-col sm:flex-row">
                        <a href="#" className="btn text-xs sm:text-sm py-2 flex-1 justify-center">
                          <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                          <span>Download PDF</span>
                        </a>
                        <button
                          onClick={() => setMicroStep(1)}
                          className="btn btn-ghost text-xs sm:text-sm py-2 flex-1 justify-center"
                        >
                          <span>New Reading</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="relative mt-24 py-12 border-t border-white/10 bg-white/[0.02] backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 md:grid-cols-3 mb-8">
              <div>
                <h4 className="font-cinzel text-lg font-semibold mb-4 bg-gradient-to-br from-cyan-400 to-purple-600 bg-clip-text text-transparent">
                  AstroKalki
                </h4>
                <p className="text-sm text-slate-400">
                  Ancient Vedic wisdom meets modern AI technology for personalized cosmic guidance.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <a href="#home" className="hover:text-cyan-400 transition-colors">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-cyan-400 transition-colors">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#services" className="hover:text-cyan-400 transition-colors">
                      Services
                    </a>
                  </li>
                  <li>
                    <a href="#booking" className="hover:text-cyan-400 transition-colors">
                      Book Now
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-white">Contact</h4>
                <ul className="space-y-2 text-sm text-slate-400">
                  <li>
                    <a
                      href="mailto:hello@astrokalki.com"
                      className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
                    >
                      <span>Email: hello@astrokalki.com</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://wa.me/919211271977"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-400 transition-colors inline-flex items-center gap-2"
                    >
                      <span>WhatsApp: +91 92112 71977</span>
                    </a>
                  </li>
                  <li>Available 24/7</li>
                </ul>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400">© {year} AstroKalki. All Rights Reserved.</p>
              <p className="mt-3 text-xs text-slate-500">
                The cosmos holds infinite possibilities. For entertainment and spiritual guidance.
              </p>
            </div>
          </div>
        </footer>
      </main>

      <ConsultationBookingModal isOpen={consultationModalOpen} onClose={() => setConsultationModalOpen(false)} />
    </div>
  )
}
