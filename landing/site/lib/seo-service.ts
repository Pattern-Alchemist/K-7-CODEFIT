import { supabase } from "@/lib/supabaseClient"

// Content Gap Service
export async function analyzeContentGaps(gscData: any[]) {
  try {
    const gaps = gscData
      .filter((item) => item.position > 10 && item.impressions > 100)
      .map((item) => ({
        query: item.query,
        search_volume: item.impressions,
        current_position: item.position,
        impressions: item.impressions,
        clicks: item.clicks,
        ctr: (item.clicks / item.impressions) * 100,
        gap_score: calculateGapScore(item),
      }))

    if (!supabase) {
      console.warn("[SEO] Supabase not initialized, returning mock data")
      return gaps
    }

    const { data, error } = await supabase.from("content_gaps").insert(gaps).select()

    if (error) {
      console.warn("[SEO] Content gap analysis warning:", error.message)
      return gaps // Return unsaved data as fallback
    }
    return data || gaps
  } catch (err) {
    console.error("[SEO] analyzeContentGaps error:", err)
    return []
  }
}

function calculateGapScore(item: any): number {
  const positionScore = (50 - item.position) / 40 // Lower position = higher score
  const impressionScore = Math.min(item.impressions / 1000, 1) // Up to 1000 impressions
  const ctrScore = item.clicks / Math.max(item.impressions, 1)

  return Math.max(0, Math.min(100, (positionScore * 30 + impressionScore * 40 + ctrScore * 30) * 100))
}

// Keyword Clustering Service
export async function clusterKeywords(keywords: Array<{ query: string; volume: number; intent: string }>) {
  try {
    const clusters = groupBySemanticSimilarity(keywords)

    const clusterData = clusters.map((cluster) => ({
      cluster_name: cluster.name,
      primary_keyword: cluster.primary,
      related_keywords: cluster.keywords,
      search_intent: cluster.intent,
      avg_search_volume: Math.round(cluster.avg_volume),
      competition_level: determineCompetition(cluster.avg_volume),
      recommended_content_type: recommendContentType(cluster.intent),
      priority_score: calculatePriority(cluster),
    }))

    if (!supabase) {
      console.warn("[SEO] Supabase not initialized, returning mock data")
      return clusterData
    }

    const { data, error } = await supabase.from("keyword_clusters").insert(clusterData).select()

    if (error) {
      console.warn("[SEO] Keyword clustering warning:", error.message)
      return clusterData
    }
    return data || clusterData
  } catch (err) {
    console.error("[SEO] clusterKeywords error:", err)
    return []
  }
}

function groupBySemanticSimilarity(keywords: any[]) {
  const clusters: any = {}

  keywords.forEach((kw) => {
    const rootWord = kw.query.split(" ")[0].toLowerCase()
    if (!clusters[rootWord]) {
      clusters[rootWord] = {
        name: rootWord,
        primary: kw.query,
        keywords: [kw.query],
        intent: kw.intent,
        volumes: [kw.volume],
      }
    } else {
      clusters[rootWord].keywords.push(kw.query)
      clusters[rootWord].volumes.push(kw.volume)
    }
  })

  return Object.values(clusters).map((c: any) => ({
    ...c,
    avg_volume: Math.round(c.volumes.reduce((a: number, b: number) => a + b, 0) / c.volumes.length),
  }))
}

function determineCompetition(volume: number): string {
  if (volume > 10000) return "high"
  if (volume > 1000) return "medium"
  return "low"
}

function recommendContentType(intent: string): string {
  const typeMap: Record<string, string> = {
    informational: "guide",
    navigational: "blog_post",
    commercial: "comparison",
    transactional: "faq",
  }
  return typeMap[intent] || "blog_post"
}

function calculatePriority(cluster: any): number {
  const volumeScore = Math.min(cluster.avg_volume / 10000, 1) * 40
  const intentScore = cluster.intent === "transactional" ? 30 : 20
  const keywordCount = Math.min(cluster.keywords.length / 10, 1) * 30
  return Math.round(volumeScore + intentScore + keywordCount)
}

// Internal Linking Service
export async function suggestInternalLinks(pageUrl: string, pageContent: string) {
  try {
    if (!supabase) {
      console.warn("[SEO] Supabase not initialized")
      return []
    }

    const { data: clusters, error: clusterError } = await supabase.from("keyword_clusters").select("*").limit(50)

    if (clusterError) {
      console.warn("[SEO] suggestInternalLinks warning:", clusterError.message)
      return []
    }

    if (!clusters) return []

    const suggestions = clusters
      .filter((c: any) => pageContent.toLowerCase().includes(c.primary_keyword.toLowerCase()))
      .map((cluster: any) => ({
        source_url: pageUrl,
        target_url: `/content/${cluster.id}`,
        anchor_text: cluster.primary_keyword,
        link_type: "contextual",
        relevance_score: 85,
        priority: calculateLinkPriority(cluster),
      }))

    const { data, error } = await supabase.from("internal_links").insert(suggestions).select()

    if (error) {
      console.warn("[SEO] Internal linking warning:", error.message)
      return suggestions
    }
    return data || suggestions
  } catch (err) {
    console.error("[SEO] suggestInternalLinks error:", err)
    return []
  }
}

function calculateLinkPriority(cluster: any): number {
  if (cluster.priority_score > 80) return 1
  if (cluster.priority_score > 60) return 2
  if (cluster.priority_score > 40) return 3
  if (cluster.priority_score > 20) return 4
  return 5
}

// Semantic Entity Mapping
export async function mapSemanticEntities(content: string) {
  try {
    const entities = extractEntities(content)

    const entityData = entities.map((entity: any) => ({
      entity_name: entity.name,
      entity_type: entity.type,
      description: entity.description,
      related_entities: entity.related || [],
      prominence_score: entity.score,
      page_mentions: [entity.source],
    }))

    if (!supabase) {
      console.warn("[SEO] Supabase not initialized")
      return entityData
    }

    const { data, error } = await supabase.from("semantic_entities").insert(entityData).select()

    if (error) {
      console.warn("[SEO] Entity mapping warning:", error.message)
      return entityData
    }
    return data || entityData
  } catch (err) {
    console.error("[SEO] mapSemanticEntities error:", err)
    return []
  }
}

function extractEntities(content: string) {
  const entities: any[] = []

  const patterns = {
    person: /(?:Dr\.|Mr\.|Ms\.|Prof\.)?\s+[A-Z][a-z]+\s+[A-Z][a-z]+/g,
    place: /(?:in|at|from|to)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/g,
    organization: /(?:company|organization|firm|institute|university)\s+(?:called|named)?\s*([A-Z][a-z]+)/g,
  }

  Object.entries(patterns).forEach(([type, pattern]) => {
    const matches = content.match(pattern)
    matches?.forEach((match) => {
      entities.push({
        name: match.trim(),
        type: type.charAt(0).toUpperCase() + type.slice(1),
        score: Math.random() * 100,
        source: "extraction",
      })
    })
  })

  return entities
}

// Get content gaps for dashboard
export async function getContentGaps(limit = 10) {
  try {
    if (!supabase) {
      console.warn("[SEO] Supabase not available, returning empty array")
      return []
    }

    const { data, error } = await supabase
      .from("content_gaps")
      .select("*")
      .order("gap_score", { ascending: false })
      .limit(limit)

    if (error) {
      console.warn("[SEO] Fetch content gaps warning:", error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error("[SEO] getContentGaps error:", err)
    return []
  }
}

// Get keyword clusters for dashboard
export async function getKeywordClusters(limit = 20) {
  try {
    if (!supabase) {
      console.warn("[SEO] Supabase not available, returning empty array")
      return []
    }

    const { data, error } = await supabase
      .from("keyword_clusters")
      .select("*")
      .order("priority_score", { ascending: false })
      .limit(limit)

    if (error) {
      console.warn("[SEO] Fetch keyword clusters warning:", error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error("[SEO] getKeywordClusters error:", err)
    return []
  }
}

// Get internal linking suggestions
export async function getInternalLinkingSuggestions(limit = 15) {
  try {
    if (!supabase) {
      console.warn("[SEO] Supabase not available, returning empty array")
      return []
    }

    const { data, error } = await supabase
      .from("internal_links")
      .select("*")
      .eq("status", "suggested")
      .order("priority", { ascending: true })
      .limit(limit)

    if (error) {
      console.warn("[SEO] Fetch internal links warning:", error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error("[SEO] getInternalLinkingSuggestions error:", err)
    return []
  }
}

// Create SEO alerts
export async function createSEOAlert(
  type: string,
  severity: string,
  description: string,
  affectedUrl?: string,
  recommendedAction?: string,
) {
  try {
    if (!supabase) {
      console.warn("[SEO] Supabase not initialized")
      return null
    }

    const { data, error } = await supabase
      .from("seo_alerts")
      .insert({
        alert_type: type,
        severity,
        description,
        affected_url: affectedUrl,
        recommended_action: recommendedAction,
      })
      .select()
      .single()

    if (error) {
      console.warn("[SEO] Create alert warning:", error.message)
      return null
    }
    return data
  } catch (err) {
    console.error("[SEO] createSEOAlert error:", err)
    return null
  }
}

// Get active alerts
export async function getActiveAlerts() {
  try {
    if (!supabase) {
      console.warn("[SEO] Supabase not initialized")
      return []
    }

    const { data, error } = await supabase
      .from("seo_alerts")
      .select("*")
      .eq("resolved", false)
      .order("created_at", { ascending: false })

    if (error) {
      console.warn("[SEO] Fetch alerts warning:", error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error("[SEO] getActiveAlerts error:", err)
    return []
  }
}
