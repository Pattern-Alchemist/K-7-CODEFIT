import { createClient } from "@/lib/supabase/server"

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price_monthly: number
  price_yearly: number
  features: string[]
  consultations_per_month: number
  priority_support: boolean
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  status: "active" | "cancelled" | "past_due" | "trialing" | "paused"
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
  consultations_used: number
  plan?: SubscriptionPlan
}

export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const supabase = await createClient()

  if (!supabase) {
    console.error("[v0] Supabase client not initialized")
    return []
  }

  const { data, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .order("price_monthly", { ascending: true })

  if (error) {
    console.error("[v0] Error fetching subscription plans:", error)
    return []
  }

  return data || []
}

export async function getUserSubscription(userId: string): Promise<UserSubscription | null> {
  const supabase = await createClient()

  if (!supabase) {
    console.error("[v0] Supabase client not initialized")
    return null
  }

  const { data, error } = await supabase
    .from("user_subscriptions")
    .select(`
      *,
      plan:subscription_plans(*)
    `)
    .eq("user_id", userId)
    .eq("status", "active")
    .single()

  if (error) {
    if (error.code !== "PGRST116") {
      // Not found is ok
      console.error("[v0] Error fetching user subscription:", error)
    }
    return null
  }

  return data
}

export async function canUserBookConsultation(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return true // No subscription = pay per consultation
  }

  // Check if user has consultations remaining
  return subscription.consultations_used < subscription.plan!.consultations_per_month
}

export async function incrementConsultationCount(userId: string): Promise<void> {
  const supabase = await createClient()

  if (!supabase) {
    console.error("[v0] Supabase client not initialized")
    return
  }

  const subscription = await getUserSubscription(userId)

  if (!subscription) {
    return // No subscription, nothing to increment
  }

  await supabase
    .from("user_subscriptions")
    .update({ consultations_used: subscription.consultations_used + 1 })
    .eq("id", subscription.id)
}

export async function createSubscription(
  userId: string,
  planId: string,
  periodStart: Date,
  periodEnd: Date,
): Promise<UserSubscription | null> {
  const supabase = await createClient()

  if (!supabase) {
    console.error("[v0] Supabase client not initialized")
    return null
  }

  const { data, error } = await supabase
    .from("user_subscriptions")
    .insert({
      user_id: userId,
      plan_id: planId,
      status: "active",
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
      consultations_used: 0,
    })
    .select()
    .single()

  if (error) {
    console.error("[v0] Error creating subscription:", error)
    return null
  }

  return data
}

export async function cancelSubscription(subscriptionId: string): Promise<boolean> {
  const supabase = await createClient()

  if (!supabase) {
    console.error("[v0] Supabase client not initialized")
    return false
  }

  const { error } = await supabase
    .from("user_subscriptions")
    .update({
      cancel_at_period_end: true,
      status: "cancelled",
    })
    .eq("id", subscriptionId)

  if (error) {
    console.error("[v0] Error cancelling subscription:", error)
    return false
  }

  return true
}
