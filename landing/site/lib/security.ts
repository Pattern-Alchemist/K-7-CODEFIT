import crypto from "crypto"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Validate and sanitize user input
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .trim()
    .slice(0, 1000) // Limit length
}

/**
 * Validate email format with security checks
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return false
  if (email.length > 254) return false // RFC 5321
  return true
}

/**
 * Validate phone number format
 */
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

/**
 * Generate secure random token
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString("hex")
}

/**
 * Hash sensitive data with HMAC-SHA256
 */
export function hashData(data: string, secret: string = process.env.APP_SECRET || "default"): string {
  return crypto.createHmac("sha256", secret).update(data).digest("hex")
}

/**
 * Validate CSRF tokens
 */
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(sessionToken))
  } catch {
    return false
  }
}

/**
 * Rate limiting decorator for API routes
 */
export function createRateLimitMiddleware(maxRequests = 100, windowMs = 60000) {
  const requests = new Map<string, number[]>()

  return (req: NextRequest) => {
    const clientIp = req.headers.get("x-forwarded-for") || req.ip || "unknown"
    const now = Date.now()

    const clientRequests = requests.get(clientIp) || []
    const validRequests = clientRequests.filter((timestamp) => now - timestamp < windowMs)

    if (validRequests.length >= maxRequests) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": "60" } })
    }

    validRequests.push(now)
    requests.set(clientIp, validRequests)

    return null // Continue to next middleware
  }
}

/**
 * Validate API key from request headers
 */
export function validateApiKey(req: NextRequest): boolean {
  const apiKey = req.headers.get("x-api-key")
  const validKey = process.env.API_KEY

  if (!apiKey || !validKey) return false

  try {
    return crypto.timingSafeEqual(Buffer.from(apiKey), Buffer.from(validKey))
  } catch {
    return false
  }
}

/**
 * Encrypt sensitive data
 */
export function encryptData(data: string, key: string = process.env.ENCRYPTION_KEY || "default"): string {
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key.padEnd(32, "0").slice(0, 32)), iv)
  let encrypted = cipher.update(data, "utf8", "hex")
  encrypted += cipher.final("hex")
  return iv.toString("hex") + ":" + encrypted
}

/**
 * Decrypt sensitive data
 */
export function decryptData(encryptedData: string, key: string = process.env.ENCRYPTION_KEY || "default"): string {
  const [ivHex, encrypted] = encryptedData.split(":")
  const iv = Buffer.from(ivHex, "hex")
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key.padEnd(32, "0").slice(0, 32)), iv)
  let decrypted = decipher.update(encrypted, "hex", "utf8")
  decrypted += decipher.final("utf8")
  return decrypted
}

/**
 * Create security headers object
 */
export function getSecurityHeaders() {
  return {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "X-XSS-Protection": "1; mode=block",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  }
}
