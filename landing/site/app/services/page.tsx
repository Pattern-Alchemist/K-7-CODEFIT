import ServicesGrid from '@/components/ServicesGrid'
import LeadForm from '@/components/LeadForm'
export const dynamic = 'force-static'
export default function ServicesPage(){
  return (<main className="min-h-screen bg-[#050508] text-white"><section className="pt-28 pb-10"><div className="mx-auto max-w-6xl px-4"><h1 className="text-4xl font-semibold">Services</h1><p className="mt-2 text-slate-300">Healing consultations by Karmic Alchemist — Kaustubh (pre‑booking only)</p><div className="mt-8"><ServicesGrid/></div></div></section><section className="pb-24"><div className="mx-auto max-w-4xl px-4"><h2 className="text-2xl font-semibold mb-4">Book your session</h2><LeadForm /></div></section></main>)
}
