export default function RadioPage(){
  const episodes = [
    { title: 'Ep 1 — Begin Again', desc: 'Reset your nervous system and start clean.', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
    { title: 'Ep 2 — Karmic Patterns', desc: 'Notice, name, and navigate repeating loops.', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { title: 'Ep 3 — Dharma Walk', desc: 'Micro-actions that restore alignment.', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
  ]
  return (<main className="min-h-screen pt-28 pb-16 px-6 max-w-4xl mx-auto"><h1 className="text-4xl font-semibold">Radio</h1><p className="text-slate-300 mt-2">Listen while you realign.</p><div className="mt-6 grid gap-4">{episodes.map((e,i)=>(<div key={i} className="rounded-2xl border border-white/10 bg-white/5 p-4"><h3 className="font-semibold">{e.title}</h3><p className="text-slate-300 text-sm">{e.desc}</p><audio className="mt-3 w-full" controls src={e.src} /></div>))}</div></main>)
}
