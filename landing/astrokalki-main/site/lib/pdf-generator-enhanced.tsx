import puppeteer from "puppeteer"
import path from "node:path"
import fs from "node:fs/promises"

function getPublicBase(): string {
  return (process.env.PUBLIC_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "")
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true })
}

function generateReadingHtml(name: string, text: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: -apple-system, Segoe UI, Inter, sans-serif; color: #0b1220; background: #fff; }
          .page { width: 210mm; height: 297mm; padding: 40px; display: flex; flex-direction: column; }
          .brand { color: #0d9488; font-weight: 700; font-size: 12px; letter-spacing: 1px; margin-bottom: 24px; }
          h1 { font-size: 28px; font-weight: 700; margin-bottom: 24px; color: #0b1220; }
          .reading { font-size: 14px; line-height: 1.8; white-space: pre-wrap; color: #374151; margin-bottom: 32px; }
          .footer { margin-top: auto; font-size: 11px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px; }
          .timestamp { font-size: 10px; color: #d1d5db; }
        </style>
      </head>
      <body>
        <div class="page">
          <div class="brand">ASTROKALKI — KARMA BALANCE</div>
          <h1>Personal Reading for ${name}</h1>
          <div class="reading">${text}</div>
          <div class="footer">
            <p>Generated on ${new Date().toLocaleDateString()}</p>
            <div class="timestamp">${new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </body>
    </html>
  `
}

export async function htmlToPdf(name: string, text: string): Promise<{ url: string; path: string }> {
  const browser = await puppeteer.launch({ headless: "new" })
  const page = await browser.newPage()

  const html = generateReadingHtml(name, text)
  await page.setContent(html, { waitUntil: "networkidle0" })

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
  })

  await browser.close()

  const relativePath = `/assets/pdf/${Date.now()}-${Math.random().toString(36).slice(2)}.pdf`
  const absolutePath = path.join(process.cwd(), "public", relativePath)

  await ensureDir(path.dirname(absolutePath))
  await fs.writeFile(absolutePath, pdfBuffer)

  return { url: getPublicBase() + relativePath, path: absolutePath }
}
