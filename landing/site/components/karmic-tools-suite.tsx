"use client"

import { useState, useCallback } from "react"
import { Loader, Map, Heart, Zap } from "lucide-react"

export default function KarmicToolsSuite() {
  const [activeTab, setActiveTab] = useState<"map" | "relationship" | "firewall">("map")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState("")

  // Karmic Map Analyzer
  const [kmDob, setKmDob] = useState("")
  const [kmTob, setKmTob] = useState("")
  const [kmLocation, setKmLocation] = useState("")

  // Relationship Analyzer
  const [raName1, setRaName1] = useState("")
  const [raDob1, setRaDob1] = useState("")
  const [raTob1, setRaTob1] = useState("")
  const [raLoc1, setRaLoc1] = useState("")
  const [raName2, setRaName2] = useState("")
  const [raDob2, setRaDob2] = useState("")
  const [raTob2, setRaTob2] = useState("")
  const [raLoc2, setRaLoc2] = useState("")

  // Karma Firewall
  const [kfQuestion, setKfQuestion] = useState("")

  const callOpenRouter = useCallback(async (prompt: string, systemPrompt: string) => {
    setLoading(true)
    setResult("")

    try {
      const response = await fetch("/api/tools/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }],
          systemPrompt,
          model: "openrouter/auto",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setResult(`Error: ${data.error || "Failed to generate analysis"}`)
        return
      }

      setResult(data.content)
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setLoading(false)
    }
  }, [])

  const analyzeKarmicMap = async () => {
    if (!kmDob || !kmLocation) {
      setResult("Please fill in DOB and Location")
      return
    }

    const prompt = `Analyze the karmic map for someone born on ${kmDob} at ${kmTob || "unknown time"} in ${kmLocation}. Provide:
1. Your repeating wound or life theme
2. Your money leak pattern
3. A 30-day ritual assignment`

    const systemPrompt =
      "You are a spiritual guide providing karmic insight. Be compassionate, specific, and actionable. Format your response clearly with numbered sections."

    await callOpenRouter(prompt, systemPrompt)
  }

  const analyzeRelationship = async () => {
    if (!raName1 || !raDob1 || !raName2 || !raDob2) {
      setResult("Please fill in both names and dates of birth")
      return
    }

    const prompt = `Analyze the relationship between:
Person A: ${raName1}, born ${raDob1} at ${raTob1 || "unknown time"} in ${raLoc1}
Person B: ${raName2}, born ${raDob2} at ${raTob2 || "unknown time"} in ${raLoc2}

Provide a 7-day repair plan with:
1. Exact words to say for the next 7 days
2. What NOT to tolerate
3. Boundary scripts for difficult moments`

    const systemPrompt =
      "You are a relationship coach using cosmic and psychological wisdom. Provide practical, compassionate advice that acknowledges both people's needs."

    await callOpenRouter(prompt, systemPrompt)
  }

  const analyzeFirewall = async () => {
    if (!kfQuestion) {
      setResult("Please ask your question")
      return
    }

    const prompt = `You are protecting someone from karmic harm. Their question: "${kfQuestion}"

Provide:
1. Their emotional danger hours (when to avoid decisions)
2. A "Never send this" message warning (what NOT to do)
3. A money-protection script (if applicable)`

    const systemPrompt =
      "You are a spiritual protector. Help someone avoid self-sabotage with clear, protective guidance."

    await callOpenRouter(prompt, systemPrompt)
  }

  return (
    <section className="relative mt-16 sm:mt-24 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-cinzel title-tight text-3xl font-semibold sm:text-4xl mb-2">Your Karmic Revelation</h2>
        <p className="mb-8 text-white/70">A spiritual interpretation of your pattern and actionable guidance.</p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab("map")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "map"
                ? "bg-cyan-500/30 text-cyan-300 border border-cyan-300/40"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Map className="h-4 w-4" strokeWidth={1.5} />
            Karmic Map
          </button>
          <button
            onClick={() => setActiveTab("relationship")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "relationship"
                ? "bg-cyan-500/30 text-cyan-300 border border-cyan-300/40"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Heart className="h-4 w-4" strokeWidth={1.5} />
            Relationship
          </button>
          <button
            onClick={() => setActiveTab("firewall")}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === "firewall"
                ? "bg-cyan-500/30 text-cyan-300 border border-cyan-300/40"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Zap className="h-4 w-4" strokeWidth={1.5} />
            Karma Firewall
          </button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Panel */}
          <div className="glass glow rounded-2xl p-6 lg:col-span-1">
            {activeTab === "map" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Karmic Map Analyzer</h3>
                <div>
                  <label className="block text-sm mb-2">Date of Birth</label>
                  <input
                    type="date"
                    value={kmDob}
                    onChange={(e) => setKmDob(e.target.value)}
                    className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Time of Birth (Optional)</label>
                  <input
                    type="time"
                    value={kmTob}
                    onChange={(e) => setKmTob(e.target.value)}
                    className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="City, Country"
                    value={kmLocation}
                    onChange={(e) => setKmLocation(e.target.value)}
                    className="glass focus-ring w-full rounded-xl bg-transparent px-3 py-2 text-white text-sm placeholder-white/40"
                  />
                </div>
                <button
                  onClick={analyzeKarmicMap}
                  disabled={loading}
                  className="btn w-full justify-center text-sm font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Map"
                  )}
                </button>
              </div>
            )}

            {activeTab === "relationship" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Relationship Analyzer</h3>
                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/70 mb-3">Profile A</p>
                  <input
                    type="text"
                    placeholder="Name"
                    value={raName1}
                    onChange={(e) => setRaName1(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white mb-2 placeholder-white/40"
                  />
                  <input
                    type="date"
                    value={raDob1}
                    onChange={(e) => setRaDob1(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white mb-2"
                  />
                  <input
                    type="time"
                    value={raTob1}
                    onChange={(e) => setRaTob1(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={raLoc1}
                    onChange={(e) => setRaLoc1(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white placeholder-white/40"
                  />
                </div>

                <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/70 mb-3">Profile B</p>
                  <input
                    type="text"
                    placeholder="Name"
                    value={raName2}
                    onChange={(e) => setRaName2(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white mb-2 placeholder-white/40"
                  />
                  <input
                    type="date"
                    value={raDob2}
                    onChange={(e) => setRaDob2(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white mb-2"
                  />
                  <input
                    type="time"
                    value={raTob2}
                    onChange={(e) => setRaTob2(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white mb-2"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={raLoc2}
                    onChange={(e) => setRaLoc2(e.target.value)}
                    className="glass focus-ring w-full rounded-lg bg-transparent px-2 py-1 text-sm text-white placeholder-white/40"
                  />
                </div>

                <button
                  onClick={analyzeRelationship}
                  disabled={loading}
                  className="btn w-full justify-center text-sm font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    "Analyze Relationship"
                  )}
                </button>
              </div>
            )}

            {activeTab === "firewall" && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Karma Firewall</h3>
                <p className="text-xs text-white/70">Ask your question to activate protection.</p>
                <textarea
                  placeholder="What decision are you facing? What temptation is calling?"
                  value={kfQuestion}
                  onChange={(e) => setKfQuestion(e.target.value)}
                  className="glass focus-ring w-full rounded-lg bg-transparent px-3 py-2 text-sm text-white placeholder-white/40 h-32 resize-none"
                />
                <button
                  onClick={analyzeFirewall}
                  disabled={loading}
                  className="btn w-full justify-center text-sm font-medium disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin" />
                      Activating...
                    </>
                  ) : (
                    "Activate Firewall"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Results Panel */}
          <div className="glass glow rounded-2xl p-6 lg:col-span-2">
            <h3 className="font-semibold text-lg mb-4">
              {activeTab === "map" && "Your Karmic Blueprint"}
              {activeTab === "relationship" && "Compatibility & Repair Plan"}
              {activeTab === "firewall" && "Protection Guidance"}
            </h3>

            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <div className="space-y-4 text-white/85 text-sm leading-relaxed whitespace-pre-wrap">{result}</div>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/50">
                  {loading
                    ? "Consulting the cosmic forces..."
                    : "Fill in your details and tap the button to receive your cosmic insight."}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-white/50">
          ✧ Fill in your pattern details and tap the button to begin your karmic analysis. ✧
        </div>
      </div>
    </section>
  )
}
