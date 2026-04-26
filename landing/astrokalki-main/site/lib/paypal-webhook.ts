const PAYPAL_BASE = () =>
  process.env.PAYPAL_ENV === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com"

async function getPayPalOAuthToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${PAYPAL_BASE()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  })

  const json = (await res.json()) as { access_token: string }
  return json.access_token
}

export async function verifyPaypalWebhookSignature(headers: Headers, body: Record<string, unknown>): Promise<boolean> {
  const token = await getPayPalOAuthToken()

  const res = await fetch(`${PAYPAL_BASE()}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      auth_algo: headers.get("paypal-auth-algo"),
      cert_url: headers.get("paypal-cert-url"),
      transmission_id: headers.get("paypal-transmission-id"),
      transmission_sig: headers.get("paypal-transmission-sig"),
      transmission_time: headers.get("paypal-transmission-time"),
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: body,
    }),
  })

  const json = (await res.json()) as { verification_status: string }
  return json.verification_status === "SUCCESS"
}
