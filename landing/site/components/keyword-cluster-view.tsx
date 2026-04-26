"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface KeywordCluster {
  id: string
  cluster_name: string
  primary_keyword: string
  related_keywords: string[]
  search_intent: string
  avg_search_volume: number
  competition_level: string
  priority_score: number
}

export function KeywordClusterView() {
  const [clusters, setClusters] = useState<KeywordCluster[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchClusters() {
      try {
        const res = await fetch("/api/seo/keyword-clustering")
        if (!res.ok) {
          throw new Error(`API returned ${res.status}`)
        }
        const data = await res.json()
        setClusters(data.clusters || [])
      } catch (error) {
        console.error("[KeywordClusterView] Error:", error)
        setError("Failed to load keyword clusters")
        setClusters([])
      } finally {
        setLoading(false)
      }
    }

    fetchClusters()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading keyword clusters...</div>
  }

  if (error) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-900">Keyword Clusters</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (clusters.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Keyword Clusters</CardTitle>
          <CardDescription>No clusters found. Run keyword analysis first.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Keyword Clusters</CardTitle>
          <CardDescription>Semantic groupings of related search terms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {clusters.map((cluster) => (
              <div key={cluster.id} className="border rounded p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-lg">{cluster.primary_keyword}</h4>
                    <p className="text-sm text-gray-600">{cluster.cluster_name}</p>
                  </div>
                  <div className="flex gap-2">
                    <Badge>{cluster.search_intent}</Badge>
                    <Badge variant={cluster.competition_level === "high" ? "destructive" : "default"}>
                      {cluster.competition_level}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div>Volume: {cluster.avg_search_volume.toLocaleString()}</div>
                  <div>Priority: {cluster.priority_score.toFixed(0)}/100</div>
                </div>
                <div className="text-sm">
                  <p className="text-gray-600 mb-1">Related keywords:</p>
                  <div className="flex flex-wrap gap-1">
                    {cluster.related_keywords.slice(0, 5).map((kw) => (
                      <Badge key={kw} variant="outline" className="text-xs">
                        {kw}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
