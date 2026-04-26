"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface GeneratedContent {
  id: string
  title: string
  type: string
  description: string
  estimated_traffic: number
}

export default function ContentGeneratorPage() {
  const [keyword, setKeyword] = useState("")
  const [contentType, setContentType] = useState("blog_post")
  const [generated, setGenerated] = useState<GeneratedContent[]>([])
  const [loading, setLoading] = useState(false)

  const contentTypes = [
    { value: "blog_post", label: "Blog Post" },
    { value: "faq", label: "FAQ Section" },
    { value: "guide", label: "Comprehensive Guide" },
    { value: "comparison", label: "Comparison Article" },
  ]

  const handleGenerate = async () => {
    if (!keyword) return

    setLoading(true)
    try {
      const res = await fetch("/api/seo/generate-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          contentType,
        }),
      })

      const data = await res.json()
      setGenerated(data.variants || [])
    } catch (error) {
      console.error("[ContentGenerator] Error:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Content Generator</h1>
          <p className="text-gray-600">Generate SEO-optimized content for target keywords</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
            <CardDescription>Create optimized content variants</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Target Keyword</label>
              <Input
                placeholder="e.g., 'astrology consultation services'"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Content Type</label>
              <div className="grid grid-cols-2 gap-2">
                {contentTypes.map((type) => (
                  <Button
                    key={type.value}
                    variant={contentType === type.value ? "default" : "outline"}
                    onClick={() => setContentType(type.value)}
                    className="w-full"
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleGenerate} disabled={!keyword || loading} className="w-full">
              {loading ? "Generating..." : "Generate Content"}
            </Button>
          </CardContent>
        </Card>

        {generated.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Generated Variants</h2>
            {generated.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                    <Badge>{item.type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600 mb-4">
                    Estimated traffic: {item.estimated_traffic} visits/month
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline">Preview</Button>
                    <Button>Publish</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
