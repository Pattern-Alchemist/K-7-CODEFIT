import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { getUserSubscription } from "@/lib/subscription-service"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Sparkles } from "lucide-react"
import Link from "next/link"

async function SubscriptionSuccessContent() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Database Not Configured</CardTitle>
          <CardDescription>Please set up your database connection.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Please Sign In</CardTitle>
          <CardDescription>You need to be signed in to view your subscription.</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const subscription = await getUserSubscription(user.id)

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl">Welcome to Your Cosmic Journey!</CardTitle>
        <CardDescription className="text-lg">Your subscription has been activated successfully</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {subscription && (
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Your Plan</p>
              <p className="text-2xl font-bold">{subscription.plan?.name}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Consultations Remaining</p>
                <p className="text-xl font-semibold">
                  {(subscription.plan?.consultations_per_month || 0) - subscription.consultations_used}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Renews On</p>
                <p className="text-xl font-semibold">
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            What's Next?
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Book your first video consultation from your dashboard</li>
            <li>• Generate personalized AI horoscopes anytime</li>
            <li>• Access exclusive cosmic insights and guidance</li>
            <li>• Receive priority support from our astrology team</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button asChild className="flex-1">
            <Link href="/consultations">Book Consultation</Link>
          </Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href="/profile">View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SubscriptionSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <SubscriptionSuccessContent />
      </Suspense>
    </div>
  )
}
