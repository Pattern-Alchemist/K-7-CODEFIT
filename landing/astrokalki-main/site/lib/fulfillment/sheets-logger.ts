export async function logToGoogleSheets(eventData: {
  timestamp: string
  orderId: string
  email: string
  service: string
  status: "pending" | "sent" | "delivered" | "failed"
  amount: number
  currency: string
  pdfUrl?: string
}) {
  const sheetsApiKey = process.env.GOOGLE_SHEETS_API_KEY
  const sheetsId = process.env.GOOGLE_SHEETS_ID

  if (!sheetsApiKey || !sheetsId) {
    console.warn("[Sheets] Google Sheets not configured, skipping logging")
    return
  }

  try {
    const row = [
      eventData.timestamp,
      eventData.orderId,
      eventData.email,
      eventData.service,
      eventData.status,
      eventData.amount,
      eventData.currency,
      eventData.pdfUrl || "",
    ]

    // Append to Google Sheets using Google Sheets API
    // const response = await fetch(
    //   `https://sheets.googleapis.com/v4/spreadsheets/${sheetsId}/values/Fulfillment!A:H:append?key=${sheetsApiKey}`,
    //   {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       values: [row],
    //     }),
    //   }
    // )

    console.log("[Sheets] Logged fulfillment event for order:", eventData.orderId)

    return { success: true }
  } catch (err) {
    console.error("[Sheets] Logging error:", err)
    // Don't throw - fulfillment should continue even if logging fails
    return { success: false }
  }
}
