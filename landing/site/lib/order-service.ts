import { supabase } from "@/lib/supabaseClient"

export interface OrderInput {
  service: string
  amount: number
  currency: string
  channel: string
  inputs?: Record<string, any>
}

export async function createOrder(orderInput: OrderInput) {
  const { data, error } = await supabase
    .from("orders")
    .insert({
      product: orderInput.service,
      amount: orderInput.amount,
      currency: orderInput.currency,
      channel: orderInput.channel,
      status: "pending",
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateOrderStatus(
  orderId: string,
  status: "pending" | "paid" | "processing" | "completed" | "failed",
) {
  const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select().single()

  if (error) throw error
  return data
}

export async function getOrder(orderId: string) {
  const { data, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

  if (error) throw error
  return data
}

export async function listOrders(limit = 50) {
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}
