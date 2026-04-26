const fs = require("fs")
const path = require("path")

interface UrlEntry {
  loc: string
  lastmod: string
  changefreq: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never"
  priority: number
}

const baseUrl = "https://www.astrokalki.com"

const pages: UrlEntry[] = [
  { loc: "", lastmod: new Date().toISOString().split("T")[0], changefreq: "daily", priority: 1.0 },
  { loc: "seo-content", lastmod: "2025-01-01", changefreq: "weekly", priority: 0.8 },
  { loc: "about/kaustubh", lastmod: "2025-01-01", changefreq: "monthly", priority: 0.7 },
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (page) => `  <url>
    <loc>${baseUrl}/${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`

const publicDir = path.join(__dirname, "../public")
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true })
}

fs.writeFileSync(path.join(publicDir, "sitemap.xml"), xml)
console.log("✓ Sitemap generated at public/sitemap.xml")
