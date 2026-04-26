"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ContentGapAnalyzer } from "@/components/content-gap-analyzer"
import { KeywordClusterView } from "@/components/keyword-cluster-view"
import { InternalLinkingSuggestions } from "@/components/internal-linking-suggestions"

export default function AdvancedSEOPage() {
  const [activeTab, setActiveTab] = useState("gaps")

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Advanced SEO Tools</h1>
          <p className="text-gray-600">Content gaps, keyword clustering, and internal linking analysis</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
            <TabsTrigger value="clusters">Keyword Clusters</TabsTrigger>
            <TabsTrigger value="linking">Internal Links</TabsTrigger>
          </TabsList>

          <TabsContent value="gaps">
            <ContentGapAnalyzer />
          </TabsContent>

          <TabsContent value="clusters">
            <KeywordClusterView />
          </TabsContent>

          <TabsContent value="linking">
            <InternalLinkingSuggestions />
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>SEO Strategy Overview</CardTitle>
            <CardDescription>Implementation roadmap for the next 8 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Weeks 1-2: Foundation</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ Entity-first schema markup</li>
                    <li>✓ Core Web Vitals optimization</li>
                    <li>✓ Answer engine optimization</li>
                  </ul>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Weeks 3-4: Analysis</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ Content gap identification</li>
                    <li>✓ Keyword clustering</li>
                    <li>✓ Competitor analysis</li>
                  </ul>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Weeks 5-6: Implementation</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ Content generation</li>
                    <li>✓ Internal linking</li>
                    <li>✓ Schema markup enhancement</li>
                  </ul>
                </div>
                <div className="border rounded p-4">
                  <h3 className="font-semibold mb-2">Weeks 7-8: Optimization</h3>
                  <ul className="text-sm space-y-1 text-gray-600">
                    <li>✓ Link velocity management</li>
                    <li>✓ Semantic search optimization</li>
                    <li>✓ Performance monitoring</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
