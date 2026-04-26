import ServiceCard from './ServiceCard'
const services = [
  { title:'Flash K – Quick Insight', price:'₹100', features:['1 specific question (Career/Love/Money/Health)','Personal voice mail: 5–10 mins','1 simple remedy you can apply immediately'] },
  { title:'Cosmic Code – Astrology + Numerology', price:'₹777', features:['Life Path + near‑term events','Alignment guidance + purpose','Name vibration tips','Audio call: 20 mins','Complete PDF report'] },
  { title:'KARMA Level', price:'₹1,500', badge:'Most Popular', features:['3 questions in depth','Tailored remedy outline','Audio call: 25–30 mins','7‑day follow‑up chat/voice','Complete PDF report'] },
  { title:'KARMA RELEASE', price:'₹4,500', features:['Past‑Present‑Future with validation','Karmic analysis + transits','Expose karmic relationships','Detailed remedy plan','Audio/Video: 45–60 mins + 30‑day follow‑up','Complete PDF report'] },
  { title:'THE MOKSHA ROADMAP', price:'₹8,888', features:['Full chart + 12–18 month roadmap','Future events decoding','Step‑by‑step remedy path','Video: 60–75 mins + two follow‑ups','Complete PDF report'] },
  { title:'WALK for DHARMA (Mentorship)', price:'₹33,999', features:['Personal soul blueprint decoded','Custom sadhana + realignment','Shadow integration','Priority 1‑on‑1 access (3 months) + tools','WhatsApp guidance + early access content'] },
]
export default function ServicesGrid(){
  return (<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{services.map((s,i)=>(<ServiceCard key={i} title={s.title} price={s.price} badge={(s as any).badge} features={s.features} ctaHref="#lead" />))}</div>)
}
