-- SEO Tables for Advanced Content Analysis

-- Google API Credentials Storage (encrypted)
CREATE TABLE IF NOT EXISTS public.seo_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_name TEXT NOT NULL UNIQUE, -- 'google_search_console', 'google_analytics', 'index_now'
  credentials JSONB NOT NULL, -- Encrypted credentials
  access_token TEXT, -- Cached access token
  token_expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  last_verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content Gap Analysis Results
CREATE TABLE IF NOT EXISTS public.content_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL, -- Search query from GSC
  search_volume INTEGER,
  current_position INTEGER,
  impressions INTEGER,
  clicks INTEGER,
  ctr DECIMAL(5,2),
  gap_score DECIMAL(5,2), -- 0-100: higher = more opportunistic
  suggested_content TEXT, -- JSON array of content suggestions
  competitor_urls TEXT[], -- Top ranking competitors
  entity_keywords TEXT[], -- Related semantic keywords
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  analyzed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Keyword Clusters
CREATE TABLE IF NOT EXISTS public.keyword_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cluster_name TEXT NOT NULL,
  primary_keyword TEXT NOT NULL,
  related_keywords TEXT[] NOT NULL, -- Array of semantic variations
  entity_type TEXT, -- 'person', 'place', 'thing', 'event'
  search_intent TEXT, -- 'informational', 'navigational', 'commercial', 'transactional'
  avg_search_volume INTEGER,
  competition_level TEXT,
  recommended_content_type TEXT, -- 'blog', 'guide', 'faq', 'comparison'
  priority_score DECIMAL(5,2), -- 0-100: based on volume x intent match
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Internal Linking Opportunities
CREATE TABLE IF NOT EXISTS public.internal_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_url TEXT NOT NULL, -- Current page
  target_url TEXT NOT NULL, -- Potential link target
  anchor_text TEXT,
  link_type TEXT, -- 'contextual', 'breadcrumb', 'related', 'semantic'
  relevance_score DECIMAL(5,2), -- 0-100
  priority INTEGER, -- 1-5: higher = implement first
  status TEXT DEFAULT 'suggested', -- 'suggested', 'implemented', 'dismissed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Generated Content Variants
CREATE TABLE IF NOT EXISTS public.content_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  keyword_cluster_id UUID REFERENCES public.keyword_clusters(id),
  content_type TEXT NOT NULL, -- 'blog_post', 'faq', 'schema_article', 'snippet_answer'
  title TEXT NOT NULL,
  description TEXT,
  content_body TEXT,
  seo_optimized BOOLEAN DEFAULT false,
  estimated_traffic INTEGER,
  publish_status TEXT DEFAULT 'draft', -- 'draft', 'scheduled', 'published'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Entity Mapping (Semantic SEO)
CREATE TABLE IF NOT EXISTS public.semantic_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_name TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'Person', 'Place', 'Organization', 'Event'
  wikidata_id TEXT,
  description TEXT,
  related_entities TEXT[], -- Array of related entity names
  prominence_score DECIMAL(5,2),
  page_mentions TEXT[], -- URLs mentioning this entity
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEO Performance Alerts
CREATE TABLE IF NOT EXISTS public.seo_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type TEXT NOT NULL, -- 'traffic_drop', 'ranking_loss', 'crawl_error', 'performance_regression'
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  affected_url TEXT,
  affected_keyword TEXT,
  description TEXT,
  recommended_action TEXT,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_content_gaps_query ON public.content_gaps(query);
CREATE INDEX idx_keyword_clusters_primary ON public.keyword_clusters(primary_keyword);
CREATE INDEX idx_internal_links_source ON public.internal_links(source_url);
CREATE INDEX idx_semantic_entities_name ON public.semantic_entities(entity_name);
CREATE INDEX idx_seo_alerts_severity ON public.seo_alerts(severity);
CREATE INDEX idx_seo_alerts_created ON public.seo_alerts(created_at DESC);

-- Enable RLS
ALTER TABLE public.seo_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.keyword_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.internal_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semantic_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seo_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin-only access for SEO data)
CREATE POLICY "admin_seo_read" ON public.seo_credentials FOR SELECT USING (true);
CREATE POLICY "admin_content_gaps_read" ON public.content_gaps FOR SELECT USING (true);
CREATE POLICY "admin_keyword_clusters_read" ON public.keyword_clusters FOR SELECT USING (true);
CREATE POLICY "admin_internal_links_read" ON public.internal_links FOR SELECT USING (true);
CREATE POLICY "admin_content_variants_read" ON public.content_variants FOR SELECT USING (true);
CREATE POLICY "admin_semantic_entities_read" ON public.semantic_entities FOR SELECT USING (true);
CREATE POLICY "admin_seo_alerts_read" ON public.seo_alerts FOR SELECT USING (true);
