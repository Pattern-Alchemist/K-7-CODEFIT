"use client"
import { motion } from "framer-motion"

const features = [
  {
    title: "Instant Karma Reading",
    description: "Get your complete karmic snapshot within 10 minutes of birth details.",
    icon: "⚡",
  },
  {
    title: "7-Day Action Plan",
    description: "Receive a personalized 7-day plan with practical cosmic guidance.",
    icon: "📅",
  },
  {
    title: "Karmic Patterns",
    description: "Understand your karmic strengths and growth opportunities.",
    icon: "🔮",
  },
  {
    title: "Affordable Pricing",
    description: "₹99 for India (UPI) or $5 globally (PayPal) - cosmic clarity at your fingertips.",
    icon: "💰",
  },
]

export default function FeatureBlocks() {
  return (
    <section className="relative bg-black py-20">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              AstroKalki
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-400">
            Experience the perfect blend of cosmic wisdom and practical guidance
          </p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group relative rounded-lg border border-cyan-500/20 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 p-6 backdrop-blur-sm transition-all hover:border-cyan-500/50 hover:bg-cyan-500/10"
            >
              {/* Hover glow effect */}
              <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 opacity-0 blur transition-opacity group-hover:opacity-10" />

              <div className="relative">
                {/* Icon */}
                <div className="mb-4 text-4xl">{feature.icon}</div>

                {/* Content */}
                <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
