import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminDashboardClient from "@/components/admin/dashboard-client"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const supabase = await createClient()

  if (!supabase) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="glass glow rounded-2xl p-8 max-w-md text-center">
          <h2 className="font-cinzel text-2xl font-bold text-white mb-4">Database Not Connected</h2>
          <p className="text-white/70 mb-4">
            Supabase environment variables are not configured. Please set up your database connection.
          </p>
          <a href="/" className="btn inline-block">
            Return Home
          </a>
        </div>
      </div>
    )
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  const { data: orders } = await supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(50)

  const { data: leads } = await supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(50)

  const { data: profiles } = await supabase.from("profiles").select("*").limit(100)

  const stats = {
    totalOrders: orders?.length || 0,
    completedOrders: orders?.filter((o: any) => o.status === "paid").length || 0,
    totalRevenue:
      orders?.filter((o: any) => o.status === "paid").reduce((sum, o: any) => sum + (o.amount || 0), 0) || 0,
    totalLeads: leads?.length || 0,
    totalUsers: profiles?.length || 0,
  }

  return (
    <div className="min-h-screen bg-ink">
      {/* Aurora Background */}
      <div aria-hidden="true" className="fixed inset-0 -z-10 aurora" />

      <AdminDashboardClient
        user={user}
        orders={orders || []}
        leads={leads || []}
        profiles={profiles || []}
        stats={stats}
      />
    </div>
  )
}
