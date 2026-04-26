const fetch = require("node-fetch")

const INDEXNOW_URL = "https://api.indexnow.org/indexnow"
const YOUR_API_KEY = process.env.INDEXNOW_KEY || "your-indexnow-key"
const SITE_URL = "https://www.astrokalki.com"

async function submitToIndexNow(url: string) {
  try {
    const response = await fetch(INDEXNOW_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: new URL(SITE_URL).hostname,
        key: YOUR_API_KEY,
        keyLocation: `${SITE_URL}/indexnow.txt`,
        urlList: [url],
      }),
    })

    if (response.ok) {
      console.log(`✓ Indexed: ${url}`)
    } else {
      console.error(`✗ Failed to index: ${url}`, response.statusText)
    }
  } catch (error) {
    console.error("IndexNow error:", error)
  }
}

// Usage: call this after publishing new content
export async function notifyNewContent(urls: string[]) {
  for (const url of urls) {
    await submitToIndexNow(url)
  }
}
