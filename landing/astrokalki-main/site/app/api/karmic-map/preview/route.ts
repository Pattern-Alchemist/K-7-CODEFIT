import { NextRequest, NextResponse } from 'next/server'
import { geminiText } from '@/lib/gemini'
export async function POST(req: NextRequest){
  const { name, dob, tob, place } = await req.json()
  const prompt = `Produce a concise karmic pattern preview (<=200 words) for ${name||'Seeker'} (DOB ${dob}, TOB ${tob||'NA'}, Place ${place||'NA'}). Include: 2 repeating patterns, 1 root cause hypothesis, 3 micro-actions.`
  const text = await geminiText(prompt)
  return NextResponse.json({ text })
}
