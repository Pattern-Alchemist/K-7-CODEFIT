import { type NextRequest, NextResponse } from "next/server"
import { sanitizeInput, validateEmail, validatePhoneNumber } from "./security"

/**
 * Validated request wrapper for API routes
 */
export interface ValidatedRequest {
  body: Record<string, any>
  clientIp: string
  isValid: boolean
  errors: string[]
}

/**
 * Validate and parse API request
 */
export async function validateApiRequest(
  req: NextRequest,
  schema: Record<string, { type: string; required?: boolean; max?: number; pattern?: RegExp }>,
): Promise<ValidatedRequest> {
  const errors: string[] = []
  let body: Record<string, any> = {}
  const clientIp = req.headers.get("x-forwarded-for") || req.ip || "unknown"

  try {
    body = await req.json()
  } catch {
    errors.push("Invalid JSON body")
    return { body, clientIp, isValid: false, errors }
  }

  // Validate each field against schema
  for (const [field, config] of Object.entries(schema)) {
    const value = body[field]

    if (config.required && !value) {
      errors.push(`${field} is required`)
      continue
    }

    if (value) {
      // Type validation
      if (config.type === "email" && !validateEmail(value)) {
        errors.push(`${field} must be a valid email`)
      } else if (config.type === "phone" && !validatePhoneNumber(value)) {
        errors.push(`${field} must be a valid phone number`)
      } else if (config.type === "string" && typeof value !== "string") {
        errors.push(`${field} must be a string`)
      } else if (config.type === "number" && typeof value !== "number") {
        errors.push(`${field} must be a number`)
      }

      // Length validation
      if (config.max && typeof value === "string" && value.length > config.max) {
        errors.push(`${field} must not exceed ${config.max} characters`)
      }

      // Pattern validation
      if (config.pattern && typeof value === "string" && !config.pattern.test(value)) {
        errors.push(`${field} format is invalid`)
      }

      // Sanitize string inputs
      if (typeof value === "string") {
        body[field] = sanitizeInput(value)
      }
    }
  }

  return {
    body,
    clientIp,
    isValid: errors.length === 0,
    errors,
  }
}

/**
 * Create secure API response
 */
export function secureApiResponse<T>(
  success: boolean,
  data?: T,
  error?: string,
  statusCode: number = success ? 200 : 400,
) {
  return NextResponse.json(
    {
      success,
      ...(data && { data }),
      ...(error && { error }),
      timestamp: new Date().toISOString(),
    },
    { status: statusCode },
  )
}

/**
 * Wrap API route handler with security checks
 */
export function withSecurityHeaders(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const response = await handler(req)

    // Add security headers
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-XSS-Protection", "1; mode=block")

    return response
  }
}
