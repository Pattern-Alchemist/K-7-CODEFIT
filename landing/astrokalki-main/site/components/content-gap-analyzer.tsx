"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ContentGap {
  id: string
  query: string
  current_position: number
  impressions: number
  clicks: number
  ctr: number
  gap_score: number
  suggested_content?: string
}

export function ContentGapAnalyzer() {
  const [gaps, setGaps] = useState<ContentGap[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGaps() {
      try {
        const res = await fetch("/api/seo/content-gap-analysis")
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }
        const data = await res.json()
        setGaps(Array.isArray(data.gaps) ? data.gaps : [])
      } catch (err) {
        console.error("[ContentGapAnalyzer] Error:", err)
        setError("Failed to load content gaps")
        setGaps([])
      } finally {
        setLoading(false)
      }
    }

    fetchGaps()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading content gaps...</div>
  }

  if (error) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">Content Gap Analysis</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (gaps.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Gap Opportunities</CardTitle>
          <CardDescription>No gaps found. Run GSC analysis first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Content Gap Opportunities</CardTitle>
          <CardDescription>Keywords with high impression potential but low clicks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gaps.map((gap) => (
              <div key={gap.id} className="border rounded p-3 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{gap.query}</h4>
                  <Badge variant={gap.gap_score > 80 ? "destructive" : "default"}>
                    Score: {gap.gap_score.toFixed(0)}
                  </Badge>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm text-gray-600">
                  <div>Position: {gap.current_position}</div>
                  <div>Impressions: {gap.impressions}</div>
                  <div>Clicks: {gap.clicks}</div>
                  <div>CTR: {gap.ctr.toFixed(2)}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
