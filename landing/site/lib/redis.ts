import Redis from "ioredis"

let redisInstance: Redis | null = null

export function getRedisClient(): Redis {
  if (!redisInstance) {
    const redisUrl = process.env.REDIS_URL || process.env.UPSTASH_REDIS_REST_URL

    if (!redisUrl) {
      console.warn("[Redis] No REDIS_URL or UPSTASH_REDIS_REST_URL configured, using in-memory mock")
      // For development, you can use a simple mock or switch to a real Redis instance
      return new Redis() // Will attempt localhost:6379
    }

    redisInstance = new Redis(redisUrl)

    redisInstance.on("error", (err) => console.error("[Redis] Client error:", err))
    redisInstance.on("connect", () => console.log("[Redis] Connected"))
  }

  return redisInstance
}

export async function closeRedis() {
  if (redisInstance) {
    await redisInstance.quit()
    redisInstance = null
  }
}
