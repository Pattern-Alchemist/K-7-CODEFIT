import { type NextRequest, NextResponse } from "next/server"
import { createSubscription } from "@/lib/subscription-service"
import { headers } from "next/headers"
import Stripe from "stripe"

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Stripe not configured" }, { status: 503 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
    const body = await req.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "No signature" }, { status: 400 })
    }

    // Verify webhook signature
    const event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)

    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const userId = session.metadata.user_id
        const planId = session.metadata.plan_id

        // Create subscription in database
        await createSubscription(
          userId,
          planId,
          session.subscription,
          session.customer,
          new Date(session.subscription_data.current_period_start * 1000),
          new Date(session.subscription_data.current_period_end * 1000),
        )
        break
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        // Handle subscription updates/cancellations
        console.log("[v0] Subscription event:", event.type)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
