import type { NextRequest } from "next/server"
import { supabase, isSupabaseAvailable } from "@/lib/supabaseClient"
import { validateApiRequest, secureApiResponse, withSecurityHeaders } from "@/lib/api-security"

const leadSchema = {
  name: { type: "string", required: true, max: 100 },
  phone: { type: "phone", required: true },
  email: { type: "email", required: true },
  dob: { type: "string", required: true },
  birth_location: { type: "string", required: true, max: 100 },
  tob: { type: "string", required: false, max: 50 },
  country: { type: "string", required: false, max: 100 },
}

async function handler(req: NextRequest) {
  // Validate request
  const validation = await validateApiRequest(req, leadSchema)

  if (!validation.isValid) {
    return secureApiResponse(false, undefined, validation.errors.join(", "), 400)
  }

  const leadData = {
    name: validation.body.name,
    phone: validation.body.phone,
    dob: validation.body.dob,
    tob: validation.body.tob,
    birth_location: validation.body.birth_location,
    country: validation.body.country,
    email: validation.body.email,
    ip_address: validation.clientIp, // Track client IP for security
  }

  if (!isSupabaseAvailable() || !supabase) {
    console.log("[Astrokalki] Lead captured (fallback - DB not available):", leadData)
    return secureApiResponse(true, { id: `local_${Date.now()}`, fallback: true })
  }

  try {
    const { data, error } = await supabase.from("leads").insert(leadData).select().single()

    if (error) {
      console.warn("[Astrokalki] Database error:", error)
      return secureApiResponse(true, { id: `local_${Date.now()}`, fallback: true })
    }

    return secureApiResponse(true, { id: data.id })
  } catch (err) {
    console.error("[Astrokalki] Unexpected error:", err)
    return secureApiResponse(true, { id: `local_${Date.now()}`, fallback: true })
  }
}

export const POST = withSecurityHeaders(handler)
