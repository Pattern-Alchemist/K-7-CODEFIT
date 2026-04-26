import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Flag to indicate if Supabase is properly configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export function isSupabaseAvailable(): boolean {
  return isSupabaseConfigured && supabase !== null
}
