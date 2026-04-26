# Security Guidelines for AstroKalki

## Overview

This document outlines the security practices and hardening measures implemented in the AstroKalki application.

## Security Headers

All HTTP responses include comprehensive security headers:

- **X-Content-Type-Options**: `nosniff` - Prevents MIME type sniffing
- **X-Frame-Options**: `DENY` - Prevents clickjacking attacks
- **X-XSS-Protection**: `1; mode=block` - Enables browser XSS protection
- **Referrer-Policy**: `strict-origin-when-cross-origin` - Controls referrer information
- **Permissions-Policy**: Restricts access to browser features (geolocation, microphone, camera)
- **Strict-Transport-Security**: Enforces HTTPS connections
- **Content-Security-Policy**: Restricts resource loading

## Rate Limiting

### Global Rate Limit
- **Default**: 100 requests per minute per IP address
- **Applies to**: All `/api/*` routes
- **Response**: HTTP 429 (Too Many Requests) with `Retry-After` header

### Configurable Rate Limits
Different endpoints can have custom rate limits:

\`\`\`typescript
const createRateLimitMiddleware = (maxRequests: number, windowMs: number) => {
  // Implementation in lib/security.ts
}
\`\`\`

## Input Validation

### Email Validation
- RFC 5321 compliant
- Maximum 254 characters
- Pattern matching for valid format

### Phone Number Validation
- Supports international formats
- Validates digit and formatting character combinations
- Removes leading/trailing whitespace

### String Sanitization
- Removes potentially harmful HTML characters (`<`, `>`)
- Limits input length to 1000 characters
- Trims whitespace

## Data Protection

### Encryption
Sensitive data can be encrypted using AES-256-CBC:

\`\`\`typescript
import { encryptData, decryptData } from "@/lib/security"

const encrypted = encryptData(sensitiveData)
const decrypted = decryptData(encrypted)
\`\`\`

### Hashing
HMAC-SHA256 hashing for non-decryptable storage:

\`\`\`typescript
import { hashData } from "@/lib/security"

const hash = hashData(data)
\`\`\`

### CSRF Protection
Token validation using timing-safe comparison:

\`\`\`typescript
import { validateCSRFToken } from "@/lib/security"

const isValid = validateCSRFToken(userToken, sessionToken)
\`\`\`

## API Security

### Request Validation
All API endpoints should validate input against a schema:

\`\`\`typescript
import { validateApiRequest, secureApiResponse } from "@/lib/api-security"

const schema = {
  email: { type: "email", required: true },
  name: { type: "string", required: true, max: 100 },
}

const validation = await validateApiRequest(req, schema)
if (!validation.isValid) {
  return secureApiResponse(false, undefined, validation.errors.join(", "), 400)
}
\`\`\`

### Security Headers on Routes
Wrap handlers with security header middleware:

\`\`\`typescript
import { withSecurityHeaders } from "@/lib/api-security"

export const POST = withSecurityHeaders(async (req) => {
  // Handler logic
})
\`\`\`

## Authentication & Authorization

### API Key Validation
Validate API keys using timing-safe comparison:

\`\`\`typescript
import { validateApiKey } from "@/lib/security"

if (!validateApiKey(req)) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
\`\`\`

### Session Management
- Store session tokens securely
- Use secure, HTTP-only cookies
- Implement token expiration
- Validate tokens on each request

## Best Practices

### Development
1. Use HTTPS/TLS for all connections
2. Never commit secrets to version control
3. Use environment variables for sensitive configuration
4. Validate and sanitize all user input
5. Use prepared statements for database queries
6. Log security events (without exposing sensitive data)

### Deployment
1. Enable HTTPS with valid SSL/TLS certificates
2. Set secure HTTP headers (CSP, HSTS, etc.)
3. Implement Web Application Firewall (WAF)
4. Enable DDoS protection
5. Use rate limiting and request throttling
6. Monitor for suspicious activity
7. Keep dependencies updated
8. Regular security audits and penetration testing

### Database Security
1. Use strong, unique passwords
2. Implement Row Level Security (RLS) policies
3. Encrypt sensitive columns
4. Regular backups with encryption
5. Limit database user permissions (principle of least privilege)
6. Audit database access logs

## Incident Response

### If a Security Issue is Discovered
1. Do not publicly disclose until a fix is available
2. Create a security patch immediately
3. Test the patch thoroughly
4. Deploy the fix to production
5. Notify affected users if necessary
6. Document the incident and lessons learned

## Dependencies

Keep all dependencies up to date to receive security patches:

\`\`\`bash
pnpm update
pnpm audit
\`\`\`

## Compliance

- GDPR: Personal data is collected with consent
- PCI DSS: Payment information is handled securely
- ISO 27001: Information security management practices

## Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
