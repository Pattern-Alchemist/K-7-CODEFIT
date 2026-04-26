"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface LinkSuggestion {
  id: string
  source_url: string
  target_url: string
  anchor_text: string
  link_type: string
  relevance_score: number
  priority: number
}

export function InternalLinkingSuggestions() {
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const res = await fetch("/api/seo/internal-linking")
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`)
        }
        const data = await res.json()
        setSuggestions(data.suggestions || [])
      } catch (error) {
        console.error("[InternalLinkingSuggestions] Error:", error)
        setError("Failed to load internal linking suggestions")
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading suggestions...</div>
  }

  if (error) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">Internal Linking</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Internal Linking Opportunities</CardTitle>
          <CardDescription>No suggestions available yet. Analyze your content first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const handleImplement = (id: string) => {
    console.log("[v0] Implementing link:", id)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Internal Linking Opportunities</CardTitle>
          <CardDescription>Suggested contextual links to improve SEO</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((sugg) => (
              <div key={sugg.id} className="border rounded p-3">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">From: {sugg.source_url}</p>
                    <p className="font-medium">
                      "{sugg.anchor_text}" → {sugg.target_url}
                    </p>
                  </div>
                  <Badge>P{sugg.priority}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Relevance: {sugg.relevance_score}% | Type: {sugg.link_type}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleImplement(sugg.id)}>
                    Implement
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
