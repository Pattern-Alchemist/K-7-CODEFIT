"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SEOAlert {
  id: string
  alert_type: string
  severity: string
  affected_url: string
  description: string
  recommended_action: string
  created_at: string
  resolved: boolean
}

export default function SEOAlertsPage() {
  const [alerts, setAlerts] = useState<SEOAlert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch("/api/seo/alerts")
        const data = await res.json()
        setAlerts(data.alerts || [])
      } catch (error) {
        console.error("[SEOAlerts] Error:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
  }, [])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading alerts...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">SEO Alerts</h1>
          <p className="text-gray-600">Monitor performance issues and SEO problems</p>
        </div>

        <div className="space-y-4">
          {alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{alert.alert_type.replace(/_/g, " ")}</CardTitle>
                    <CardDescription>{alert.description}</CardDescription>
                  </div>
                  <Badge variant={getSeverityColor(alert.severity) as any}>{alert.severity.toUpperCase()}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {alert.affected_url && (
                  <div className="text-sm">
                    <span className="font-medium">Affected URL:</span> {alert.affected_url}
                  </div>
                )}
                {alert.recommended_action && (
                  <div className="bg-blue-50 p-3 rounded text-sm">
                    <span className="font-medium block mb-1">Recommended Action:</span>
                    {alert.recommended_action}
                  </div>
                )}
                <div className="text-xs text-gray-500">{new Date(alert.created_at).toLocaleDateString()}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
