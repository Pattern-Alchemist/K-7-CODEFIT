import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"

export async function POST(req: NextRequest) {
  try {
    const { keyword, contentType } = await req.json()

    if (!keyword || !contentType) {
      return NextResponse.json({ error: "keyword and contentType required" }, { status: 400 })
    }

    // Generate content variants based on keyword and type
    const variants = generateContentVariants(keyword, contentType)

    const { data, error } = await supabase.from("content_variants").insert(variants).select()

    if (error) {
      console.error("[Generate Content] Error:", error)
      return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      variants: data,
    })
  } catch (error) {
    console.error("[Generate Content API] Error:", error)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}

function generateContentVariants(keyword: string, type: string) {
  const variants = []

  const templates: Record<string, any> = {
    blog_post: {
      title: `Complete Guide to ${keyword}`,
      description: `Learn everything about ${keyword} in this comprehensive guide`,
      estimated_traffic: 150,
    },
    faq: {
      title: `${keyword} - Frequently Asked Questions`,
      description: `Common questions and answers about ${keyword}`,
      estimated_traffic: 80,
    },
    guide: {
      title: `The Ultimate ${keyword} Guide`,
      description: `In-depth guide covering all aspects of ${keyword}`,
      estimated_traffic: 200,
    },
    comparison: {
      title: `${keyword}: Comparison & Analysis`,
      description: `Compare different aspects and options related to ${keyword}`,
      estimated_traffic: 120,
    },
  }

  const template = templates[type] || templates.blog_post

  variants.push({
    content_type: type,
    title: template.title,
    description: template.description,
    estimated_traffic: template.estimated_traffic,
    publish_status: "draft",
  })

  return variants
}
