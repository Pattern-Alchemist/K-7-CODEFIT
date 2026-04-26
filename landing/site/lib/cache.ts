const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  VERY_LONG: 86400, // 24 hours
}

export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl: number = CACHE_TTL.MEDIUM): Promise<T> {
  // In production, use Redis via REDIS_URL
  // For now, use in-memory cache with Map
  const cache = new Map<string, { value: T; expires: number }>()

  const cached = cache.get(key)
  if (cached && cached.expires > Date.now()) {
    return cached.value
  }

  const value = await fetcher()
  cache.set(key, { value, expires: Date.now() + ttl * 1000 })

  return value
}

export const cacheConfig = {
  SHORT: `max-age=${CACHE_TTL.SHORT}, s-maxage=${CACHE_TTL.SHORT * 2}`,
  MEDIUM: `max-age=${CACHE_TTL.MEDIUM}, s-maxage=${CACHE_TTL.MEDIUM * 2}`,
  LONG: `max-age=${CACHE_TTL.LONG}, s-maxage=${CACHE_TTL.LONG * 2}`,
  VERY_LONG: `max-age=${CACHE_TTL.VERY_LONG}, s-maxage=${CACHE_TTL.VERY_LONG}`,
}
