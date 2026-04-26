import { NextRequest, NextResponse } from 'next/server'
import { geminiText } from '@/lib/gemini'
export async function POST(req: NextRequest){
  const { a, b, goal } = await req.json()
  const prompt = `Two profiles A=${JSON.stringify(a)} and B=${JSON.stringify(b)}. Goal: ${goal||'heal'}. Return JSON with keys: radar (five dims: trust,intimacy,communication,stability,growth each 0-100), friction (3 short bullets), leverage (3 bullets), plan (7 daily micro-actions). Output only JSON.`
  const text = await geminiText(prompt)
  return NextResponse.json({ analysis: text })
}
