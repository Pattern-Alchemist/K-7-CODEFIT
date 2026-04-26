export const dynamic = "force-dynamic"

import { createClient } from "@/lib/supabase/server"
import { getUserSubscription } from "@/lib/subscription-service"
import ProfileContent from "@/components/profile-content"
import { redirect } from "next/navigation"

const ProfilePage = async () => {
  const supabase = await createClient()

  // Get current user on server
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch profile on server
  const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Fetch subscription on server
  const subscription = await getUserSubscription(user.id)

  // Pass data to client component
  return <ProfileContent initialProfile={profileData} initialSubscription={subscription} />
}

export default ProfilePage
