import type { ApiResponse } from "@astrokalki/types"

// API Response builders
export function successResponse<T>(data: T): ApiResponse {
  return {
    success: true,
    data,
    timestamp: new Date(),
  }
}

export function errorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
    timestamp: new Date(),
  }
}

// Error handler decorator
export function handleApiError(error: unknown): ApiResponse {
  if (error instanceof Error) {
    return errorResponse(error.message)
  }
  return errorResponse("An unexpected error occurred")
}

// Rate limiter
export class RateLimiter {
  private requests: Map<string, number[]> = new Map()
  private readonly windowMs: number
  private readonly maxRequests: number

  constructor(windowMs = 60000, maxRequests = 100) {
    this.windowMs = windowMs
    this.maxRequests = maxRequests
  }

  isAllowed(key: string): boolean {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const validRequests = requests.filter((timestamp) => now - timestamp < this.windowMs)

    if (validRequests.length >= this.maxRequests) {
      return false
    }

    validRequests.push(now)
    this.requests.set(key, validRequests)
    return true
  }

  getRemainingRequests(key: string): number {
    const now = Date.now()
    const requests = this.requests.get(key) || []
    const validRequests = requests.filter((timestamp) => now - timestamp < this.windowMs)
    return Math.max(0, this.maxRequests - validRequests.length)
  }
}
