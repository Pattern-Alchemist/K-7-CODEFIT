export async function sendFulfillmentEmail(options: {
  to: string
  name: string
  orderId: string
  service: string
  pdfUrl?: string
  audioUrl?: string
  readingText: string
}) {
  const { to, name, orderId, service, pdfUrl, audioUrl, readingText } = options

  // Build email template based on service tier
  const emailTemplate = buildEmailTemplate({
    name,
    service,
    pdfUrl,
    audioUrl,
    readingText,
    orderId,
  })

  try {
    // In production, integrate with Resend, SendGrid, or AWS SES
    console.log(`[Resend] Sending fulfillment email to ${to}`)

    // Example with Resend API:
    // const response = await resend.emails.send({
    //   from: "readings@astrokalki.com",
    //   to,
    //   subject: `Your ${service} Reading is Ready`,
    //   html: emailTemplate,
    //   attachments: pdfUrl ? [{ filename: "reading.pdf", path: pdfUrl }] : undefined,
    // })

    return {
      success: true,
      messageId: "mock-" + Date.now(),
      email: to,
    }
  } catch (err) {
    console.error("[Resend] Email send error:", err)
    throw err
  }
}

function buildEmailTemplate(options: {
  name: string
  service: string
  pdfUrl?: string
  audioUrl?: string
  readingText: string
  orderId: string
}): string {
  const { name, service, pdfUrl, audioUrl, readingText, orderId } = options

  const serviceTitles: Record<string, string> = {
    "flash-k": "Flash K - Quick Insight",
    "karma-level": "KARMA Level - Karmic Reading",
    "cosmic-code": "Cosmic Code - Astrology Revelation",
    "karma-release": "Karma Release - Deep Dive",
    "moksha-roadmap": "Moksha Roadmap - 12-18 Month Guide",
    "dharma-walk": "Walk for Dharma - 3-Month Mentorship",
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Inter, sans-serif; background: #0d0b1e; color: #e6f0ff; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; color: #67e8f9; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
    .content { background: rgba(255,255,255,0.08); padding: 20px; border-radius: 12px; margin: 20px 0; }
    .reading { white-space: pre-wrap; line-height: 1.6; }
    .cta { text-align: center; margin: 30px 0; }
    .button { background: #67e8f9; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; }
    .footer { font-size: 12px; color: #999; text-align: center; margin-top: 40px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Your ${serviceTitles[service] || service} is Ready</div>
    
    <p>Dear ${name},</p>
    
    <p>Your personalized cosmic reading has been generated. Your complete analysis is below:</p>
    
    <div class="content">
      <div class="reading">${readingText}</div>
    </div>
    
    ${
      pdfUrl
        ? `
    <div class="cta">
      <a href="${pdfUrl}" class="button">Download Full PDF Report</a>
    </div>
    `
        : ""
    }
    
    ${
      audioUrl
        ? `
    <div class="cta">
      <a href="${audioUrl}">Listen to Audio Version (${Math.round(readingText.split(" ").length / 130)} min)</a>
    </div>
    `
        : ""
    }
    
    <div class="footer">
      <p>Order ID: ${orderId}</p>
      <p>This reading is for your personal guidance and entertainment. Keep an open heart to the cosmic insights.</p>
      <p>© ${new Date().getFullYear()} AstroKalki. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `
}
