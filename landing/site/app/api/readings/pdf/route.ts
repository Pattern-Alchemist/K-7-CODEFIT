import { NextRequest } from 'next/server'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
export async function POST(req: NextRequest) {
  const { text, name } = await req.json()
  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage([595.28, 841.89])
  const { width, height } = page.getSize()
  const margin = 50
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const titleFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
  const title = `AstroKalki — Karmic Snapshot for ${name || 'Seeker'}`
  page.drawText(title, { x: margin, y: height - margin - 20, size: 16, font: titleFont, color: rgb(0.34, 0.70, 0.66) })
  const words = String(text || '').split(/\s+/)
  let y = height - margin - 50
  const size = 11
  const lineWidth = width - margin*2
  let line = ''
  function textWidth(s:string){ return font.widthOfTextAtSize(s, size) }
  words.forEach((w)=>{ const trial = line ? line + ' ' + w : w; if(textWidth(trial) > lineWidth){ page.drawText(line, { x: margin, y, size, font, color: rgb(0.85,0.87,0.9) }); y -= 14; line = w } else { line = trial } })
  if(line){ page.drawText(line, { x: margin, y, size, font, color: rgb(0.85,0.87,0.9) }) }
  const bytes = await pdfDoc.save()
  return new Response(Buffer.from(bytes), { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="AstroKalki-Reading.pdf"' } })
}
