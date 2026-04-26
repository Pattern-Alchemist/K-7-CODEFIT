import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabaseClient"
import { getRedisClient } from "@/lib/redis"

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      database: { status: "checking" },
      redis: { status: "checking" },
      api: { status: "ok" },
    },
  }

  try {
    // Check Supabase connection
    const { error: dbError } = await supabase.from("orders").select("count").limit(1)
    health.services.database.status = dbError ? "error" : "ok"
    if (dbError) {
      health.services.database.error = dbError.message
    }
  } catch (err) {
    health.services.database.status = "error"
    health.services.database.error = String(err)
  }

  try {
    // Check Redis connection
    const redis = getRedisClient()
    await redis.ping()
    health.services.redis.status = "ok"
  } catch (err) {
    health.services.redis.status = "error"
    health.services.redis.error = String(err)
  }

  // Determine overall health
  const isHealthy =
    health.services.database.status === "ok" &&
    health.services.redis.status === "ok" &&
    health.services.api.status === "ok"

  health.status = isHealthy ? "healthy" : "degraded"

  return NextResponse.json(health, { status: isHealthy ? 200 : 503 })
}
