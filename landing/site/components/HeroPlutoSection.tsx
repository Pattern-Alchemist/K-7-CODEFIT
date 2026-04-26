"use client"
import { motion } from "framer-motion"
import Link from "next/link"

export default function HeroKalkiSection() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center bg-[#050508] text-white overflow-hidden">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,#1b1b3a_0%,#0a0a15_50%,#050508_100%)] opacity-90" />
      <div className="absolute -inset-40 blur-3xl opacity-30 bg-[conic-gradient(from_180deg_at_50%_50%,#56B3A8_0%,#D77B2A_40%,#8a5cf6_100%)]" />

      <div className="container relative z-10 mx-auto px-4 py-20 text-center">
        {/* Logo - DOUBLED SIZE */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mx-auto mb-8 flex justify-center"
        >
          <video
            src="/hero_home.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full max-w-2xl h-[360px] md:h-[480px] rounded-3xl shadow-[0_20px_60px_rgba(103,232,249,0.4)] object-cover"
            aria-label="AstroKalki cosmic hero video"
          />
        </motion.div>

        {/* Brand Name - DOUBLED SIZE */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-2 font-cinzel text-7xl font-bold tracking-wider text-cyan-400"
        >
          ASTROKALKI
        </motion.h1>

        {/* Brand Name */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mb-6 text-3xl font-bold tracking-widest text-purple-300"
        >
          KARMA BALANCE
        </motion.p>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mx-auto mb-6 max-w-4xl text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white"
        >
          Unlock Your Karmic Snapshot in Just 10 Minutes
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="mx-auto mb-8 max-w-3xl text-lg text-gray-300"
        >
          <span className="block font-semibold text-white mb-2">
            Cosmic insights and clarity-driven strategy—no waiting, no guesswork.
          </span>
        </motion.p>

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.8 }}
          className="mx-auto mb-10 max-w-2xl space-y-3 text-lg text-gray-300"
        >
          <div className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold mt-1">•</span>
            <span>Receive your personalized astrological reading instantly</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold mt-1">•</span>
            <span>Practical 7-day cosmic action plan, tailored for you</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-cyan-400 font-bold mt-1">•</span>
            <span>Only ₹99 (UPI, India) or $5 (PayPal, Global)</span>
          </div>
        </motion.div>

        {/* Special Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mx-auto mb-10 max-w-2xl text-base text-purple-300 italic"
        >
          Embrace the truth of your karma with <span className="font-semibold text-cyan-400">"KAUSTUBH"</span>... Tuning
          the <span className="font-semibold text-cyan-400">"RADIO"</span>... SOON...
        </motion.p>

        {/* Updated Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mx-auto mb-10 max-w-3xl text-2xl font-bold text-white"
        >
          Transform your week—starting now.
          <br />
          <span className="text-cyan-400">Instant delivery. Infinite possibilities.</span>
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            href="/#get-started"
            className="rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-500/50 transition-all hover:scale-105 hover:from-cyan-400 hover:to-purple-400"
          >
            Get Started
          </Link>
          <Link
            href="/services#lead"
            className="rounded-full border-2 border-cyan-500 bg-black/40 px-8 py-4 text-lg font-semibold text-cyan-400 backdrop-blur-sm transition-all hover:bg-cyan-500/20"
          >
            Book now
          </Link>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="h-8 w-8 text-cyan-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
