import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getSubscriptionPlans, getUserSubscription } from "@/lib/subscription-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles } from "lucide-react"
import Link from "next/link"

async function SubscriptionPlansContent() {
  const supabase = await createClient()
  const plans = await getSubscriptionPlans()

  let currentSubscription = null
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      currentSubscription = await getUserSubscription(user.id)
    }
  }

  if (plans.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Subscription plans are not configured yet. Please run the database migrations.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {plans.map((plan) => {
        const isCurrentPlan = currentSubscription?.plan_id === plan.id
        const features = Array.isArray(plan.features) ? plan.features : []

        return (
          <Card key={plan.id} className={isCurrentPlan ? "border-primary" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{plan.name}</CardTitle>
                {isCurrentPlan && <Badge>Current Plan</Badge>}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">₹{plan.price_monthly}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                {plan.price_yearly && (
                  <p className="text-sm text-muted-foreground mt-1">
                    or ₹{plan.price_yearly}/year (save{" "}
                    {Math.round((1 - plan.price_yearly / (plan.price_monthly * 12)) * 100)}%)
                  </p>
                )}
              </div>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              {isCurrentPlan ? (
                <Button variant="outline" className="w-full bg-transparent" disabled>
                  Current Plan
                </Button>
              ) : (
                <form action="/api/subscriptions/create-checkout" method="POST" className="w-full">
                  <input type="hidden" name="planId" value={plan.id} />
                  <input type="hidden" name="billingPeriod" value="monthly" />
                  <Button type="submit" className="w-full">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Subscribe Now
                  </Button>
                </form>
              )}
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}

export default async function SubscriptionPlansPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Cosmic Path</h1>
          <p className="text-xl text-muted-foreground">
            Unlock unlimited spiritual guidance with our subscription plans
          </p>
        </div>

        <Suspense fallback={<div className="text-center">Loading plans...</div>}>
          <SubscriptionPlansContent />
        </Suspense>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Not ready to subscribe? You can still book individual consultations.
          </p>
          <Button variant="outline" asChild>
            <Link href="/#booking">Book Single Consultation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
