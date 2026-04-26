import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { CreditCard, TrendingUp, Users, DollarSign } from "lucide-react"

interface OverviewProps {
  orders: any[]
  leads: any[]
  stats: {
    totalOrders: number
    completedOrders: number
    totalRevenue: number
    totalLeads: number
    totalUsers: number
  }
}

export default function DashboardOverview({ orders, leads, stats }: OverviewProps) {
  // Calculate weekly data from orders
  const weeklyData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dayOrders = orders.filter(
      (o: any) => new Date(o.created_at).toLocaleDateString() === date.toLocaleDateString(),
    )
    return {
      date: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()],
      bookings: dayOrders.length,
      revenue: dayOrders.reduce((sum, o: any) => sum + (o.amount || 0), 0),
    }
  })

  const statCards = [
    { label: "Total Orders", value: stats.totalOrders, icon: CreditCard, color: "text-cyan-400" },
    { label: "Completed", value: stats.completedOrders, icon: TrendingUp, color: "text-teal-400" },
    { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-fuchsia-400" },
    {
      label: "Revenue",
      value: `₹${(stats.totalRevenue / 100).toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-400",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="glass glow rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">{stat.label}</p>
                  <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
                </div>
                <Icon className={`h-10 w-10 ${stat.color}`} strokeWidth={1.5} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass glow rounded-2xl p-6">
          <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Weekly Activity</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(13,11,30,0.8)", border: "1px solid rgba(103,232,249,0.3)" }}
              />
              <Legend />
              <Bar dataKey="bookings" fill="#67e8f9" name="Bookings" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass glow rounded-2xl p-6">
          <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{ backgroundColor: "rgba(13,11,30,0.8)", border: "1px solid rgba(103,232,249,0.3)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#e879f9" name="Revenue (₹)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="glass glow rounded-2xl p-6">
        <h3 className="font-cinzel text-xl font-semibold text-white mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-4 text-white/70">ID</th>
                <th className="text-left py-3 px-4 text-white/70">Channel</th>
                <th className="text-left py-3 px-4 text-white/70">Amount</th>
                <th className="text-left py-3 px-4 text-white/70">Status</th>
                <th className="text-left py-3 px-4 text-white/70">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map((order: any) => (
                <tr key={order.id} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-3 px-4 text-cyan-300 font-mono text-xs">{order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-white">{order.channel || "—"}</td>
                  <td className="py-3 px-4 text-white font-semibold">
                    {order.currency === "INR" ? "₹" : "$"}
                    {(order.amount / 100).toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === "paid"
                          ? "bg-green-500/20 text-green-300"
                          : order.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-300"
                            : "bg-red-500/20 text-red-300"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-white/70">{new Date(order.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
