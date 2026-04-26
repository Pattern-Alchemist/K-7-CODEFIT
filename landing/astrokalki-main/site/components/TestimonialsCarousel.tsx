'use client'
import { useEffect, useRef, useState } from 'react'
const TESTIMONIALS = [
  { name: 'Anita, NYC', quote: 'I felt seen. The 7‑day plan actually changed my week.' },
  { name: 'Ravi, Pune', quote: 'Accurate patterns, simple remedies. Booked again for my partner.' },
  { name: 'Maya, London', quote: 'No fluff, only truth. PDF is clear and actionable.' },
  { name: 'Dev, SF', quote: 'Worth every rupee. The calm after our call—priceless.' },
]
export default function TestimonialsCarousel(){
  const [idx, setIdx] = useState(0)
  const timer = useRef<NodeJS.Timeout | null>(null)
  useEffect(()=>{ timer.current && clearInterval(timer.current); timer.current = setInterval(()=> setIdx(i => (i+1) % TESTIMONIALS.length), 4000); return () => { if (timer.current) clearInterval(timer.current) } }, [])
  return (<section className="py-20"><div className="mx-auto max-w-5xl px-6"><h2 className="text-3xl font-semibold text-center mb-8">What seekers say</h2><div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"><div className="flex transition-transform duration-700" style={{ transform:`translateX(-${idx*100}%)` }}>{TESTIMONIALS.map((t,i)=>(<div key={i} className="min-w-full p-10"><blockquote className="text-center text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto">“{t.quote}”</blockquote><p className="text-center mt-4 text-teal-200">{t.name}</p></div>))}</div><div className="flex items-center justify-center gap-2 p-4">{TESTIMONIALS.map((_,i)=>(<button key={i} aria-label={`go to ${i+1}`} onClick={()=>setIdx(i)} className={`h-2 w-2 rounded-full ${i===idx?'bg-teal-300':'bg-white/30'}`} />))}</div></div></div></section>)
}
