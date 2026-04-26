import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateKarmicSnapshot } from '@/lib/gemini'
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { order_id, name, dob, tob, place, intent } = body;
  const { text } = await generateKarmicSnapshot({ name, dob, tob, place, intent })
  const { data, error } = await supabase.from('readings').insert({ order_id, inputs:{ name, dob, tob, place, intent }, output:{ text } }).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ reading: data })
}
