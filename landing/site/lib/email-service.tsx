interface EmailOptions {
  to: string
  name: string
  pdfUrl: string
  audioUrl?: string
  analysisText: string
  orderId: string
}

export async function sendReadingEmail(options: EmailOptions) {
  const { to, name, pdfUrl, audioUrl, analysisText, orderId } = options

  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS

  if (!smtpHost || !smtpUser) {
    console.warn("[EmailService] SMTP not configured, would send to:", to)
    return { success: true, messageId: "mock-" + orderId }
  }

  // Email template
  const emailHTML = `
    <html>
      <body style="font-family: Inter, sans-serif; background-color: #0d0b1e; color: #ffffff;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #67e8f9; text-align: center;">Your Karmic Reading is Ready</h1>
          
          <p>Dear ${name},</p>
          
          <p>Your personalized karmic reading has been generated. Find your complete analysis below:</p>
          
          <div style="background: rgba(255,255,255,0.08); padding: 20px; border-radius: 10px; margin: 20px 0;">
            ${analysisText
              .split("\n")
              .map((line) => `<p>${line}</p>`)
              .join("")}
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${pdfUrl}" style="background-color: #67e8f9; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block;">
              Download Full PDF Report
            </a>
          </p>
          
          ${audioUrl ? `<p style="text-align: center;"><a href="${audioUrl}">Listen to Audio Version</a></p>` : ""}
          
          <p style="margin-top: 40px; font-size: 12px; color: #999;">
            Order ID: ${orderId}<br/>
            This reading is for entertainment and guidance purposes.
          </p>
        </div>
      </body>
    </html>
  `

  // In production, integrate with Resend, SendGrid, or AWS SES
  console.log(`[EmailService] Would send email to ${to}`)

  return {
    success: true,
    messageId: "msg-" + Date.now(),
  }
}
