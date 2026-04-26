import { NextRequest, NextResponse } from 'next/server'
import { geminiText } from '@/lib/gemini'
export async function POST(req: NextRequest){
  const { name, dob, tob, place } = await req.json()
  const prompt = `Create a 120-180 word daily horoscope preview for ${name||'Seeker'} born ${dob} ${tob?('at '+tob):''} in ${place||'unknown place'}. Tone: truthful, gentle, practical. Include 1 focus and 1 simple action.`
  const text = await geminiText(prompt)
  return NextResponse.json({ text })
}
