const INDEXNOW_URL = "https://api.indexnow.org/indexnow"
const INDEXNOW_KEY = process.env.INDEXNOW_KEY || "your-indexnow-key"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.astrokalki.com"

async function submitToIndexNow(urls: string[]) {
  try {
    const response = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/indexnow.txt`,
        urlList: urls,
      }),
    })

    if (response.ok) {
      console.log(`✓ IndexNow: Submitted ${urls.length} URLs`)
    } else {
      console.error(`✗ IndexNow failed:`, await response.text())
    }
  } catch (error) {
    console.error("IndexNow submission error:", error)
  }
}

// URLs to index
const urlsToIndex = [`${SITE_URL}/`, `${SITE_URL}/seo-content`, `${SITE_URL}/#pricing`, `${SITE_URL}/#services`]

submitToIndexNow(urlsToIndex)
