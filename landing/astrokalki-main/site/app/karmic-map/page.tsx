'use client'
import { useState } from 'react'
export default function KarmicMapPage(){
  const [f, setF] = useState({ name:'', dob:'', tob:'', place:'' })
  const [text, setText] = useState('')
  async function preview(){ const r = await fetch('/api/karmic-map/preview', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(f) }); const j = await r.json(); setText(j.text) }
  return (<main className="min-h-screen pt-28 pb-16 px-6 max-w-3xl mx-auto"><h1 className="text-4xl font-semibold">Karmic Map</h1><p className="text-slate-300 mt-2">Pattern analysis preview. For a full map PDF, <a className="underline" href="/services#lead">book now</a>.</p><div className="mt-6 grid gap-3"><input placeholder="Full name" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" onChange={e=>setF({...f,name:e.target.value})}/><input placeholder="DOB (YYYY-MM-DD)" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" onChange={e=>setF({...f,dob:e.target.value})}/><input placeholder="TOB (hh:mm)" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" onChange={e=>setF({...f,tob:e.target.value})}/><input placeholder="Place of birth" className="px-3 py-2 rounded-xl bg-white/5 border border-white/10" onChange={e=>setF({...f,place:e.target.value})}/><button onClick={preview} className="mt-1 px-5 py-3 rounded-xl bg-teal-300 text-black font-semibold">Preview</button>{text && (<div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-4 text-slate-200 whitespace-pre-wrap">{text}</div>)}</div></main>)
}
