import { Resend } from "resend"

// Resend is now instantiated inside each function at request time

export interface BookingConfirmationEmailData {
  to: string
  userName: string
  serviceName: string
  scheduledFor: string
  amount: number
  consultationId: string
}

export interface BookingReminderEmailData {
  to: string
  userName: string
  serviceName: string
  scheduledFor: string
  consultationId: string
}

export async function sendBookingConfirmationEmail(data: BookingConfirmationEmailData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { to, userName, serviceName, scheduledFor, amount, consultationId } = data

    const formattedDate = new Date(scheduledFor).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    })

    const response = await resend.emails.send({
      from: "AstroKalki <bookings@astrokalki.com>",
      to,
      subject: `Consultation Confirmed: ${serviceName}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #67e8f9 0%, #56b3a8 100%);
                padding: 30px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .header h1 {
                color: #0d0b1e;
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .detail-box {
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #67e8f9;
              }
              .detail-row {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #e5e7eb;
              }
              .detail-row:last-child {
                border-bottom: none;
              }
              .label {
                font-weight: 600;
                color: #6b7280;
              }
              .value {
                color: #111827;
                font-weight: 500;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #67e8f9 0%, #56b3a8 100%);
                color: #0d0b1e;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 14px;
                border-top: 1px solid #e5e7eb;
                margin-top: 20px;
              }
              .tips {
                background: #fef3c7;
                padding: 15px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #f59e0b;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>✨ Consultation Confirmed</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p>Your cosmic consultation has been successfully booked! We're excited to guide you on your journey.</p>
              
              <div class="detail-box">
                <div class="detail-row">
                  <span class="label">Service:</span>
                  <span class="value">${serviceName}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Date & Time:</span>
                  <span class="value">${formattedDate}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Amount Paid:</span>
                  <span class="value">₹${amount}</span>
                </div>
                <div class="detail-row">
                  <span class="label">Consultation ID:</span>
                  <span class="value">${consultationId}</span>
                </div>
              </div>

              <div class="tips">
                <strong>📝 Preparation Tips:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>Have your birth details ready (DOB, time, location)</li>
                  <li>Prepare your questions in advance</li>
                  <li>Find a quiet space for the session</li>
                  <li>Test your camera and microphone beforehand</li>
                </ul>
              </div>

              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://astrokalki.com"}/consultations/${consultationId}" class="cta-button">
                  View Consultation Details
                </a>
              </center>

              <p style="margin-top: 30px;">You'll receive a reminder 24 hours before your session. If you need to reschedule, please contact us at least 48 hours in advance.</p>
              
              <p>Looking forward to connecting with you!</p>
              <p><strong>The AstroKalki Team</strong><br>
              <small>Karma. Cosmos. Dharma.</small></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AstroKalki. All rights reserved.</p>
              <p>Questions? Reply to this email or visit our <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://astrokalki.com"}">website</a></p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true, data: response }
  } catch (error) {
    console.error("Error sending booking confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendBookingReminderEmail(data: BookingReminderEmailData) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { to, userName, serviceName, scheduledFor, consultationId } = data

    const formattedDate = new Date(scheduledFor).toLocaleString("en-IN", {
      dateStyle: "full",
      timeStyle: "short",
    })

    const response = await resend.emails.send({
      from: "AstroKalki <bookings@astrokalki.com>",
      to,
      subject: `Reminder: Your ${serviceName} consultation is tomorrow`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #e879f9 0%, #67e8f9 100%);
                padding: 30px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .header h1 {
                color: #0d0b1e;
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .reminder-box {
                background: #fef3c7;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border-left: 4px solid #f59e0b;
                text-align: center;
              }
              .time-display {
                font-size: 24px;
                font-weight: 700;
                color: #0d0b1e;
                margin: 10px 0;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #e879f9 0%, #67e8f9 100%);
                color: #0d0b1e;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 20px 0;
              }
              .checklist {
                background: #f9fafb;
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 14px;
                border-top: 1px solid #e5e7eb;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>⏰ Consultation Reminder</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p>This is a friendly reminder that your cosmic consultation is scheduled for tomorrow!</p>
              
              <div class="reminder-box">
                <div style="font-size: 18px; font-weight: 600; color: #6b7280;">Your Session:</div>
                <div class="time-display">${formattedDate}</div>
                <div style="font-size: 16px; color: #6b7280;">${serviceName}</div>
              </div>

              <div class="checklist">
                <strong>✅ Pre-Session Checklist:</strong>
                <ul style="margin: 10px 0; padding-left: 20px;">
                  <li>✓ Birth details ready (DOB, time, location)</li>
                  <li>✓ Questions prepared and prioritized</li>
                  <li>✓ Quiet, comfortable space arranged</li>
                  <li>✓ Camera and microphone tested</li>
                  <li>✓ Stable internet connection verified</li>
                </ul>
              </div>

              <center>
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://astrokalki.com"}/consultations/${consultationId}" class="cta-button">
                  Join Consultation Room
                </a>
              </center>

              <p style="margin-top: 30px;">The consultation room will be available 10 minutes before your scheduled time. If you need to reschedule, please contact us immediately.</p>
              
              <p>We look forward to connecting with you!</p>
              <p><strong>The AstroKalki Team</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AstroKalki. All rights reserved.</p>
              <p>Need help? Reply to this email or contact support</p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true, data: response }
  } catch (error) {
    console.error("Error sending booking reminder email:", error)
    return { success: false, error }
  }
}

export async function sendConsultationCompletedEmail(data: {
  to: string
  userName: string
  serviceName: string
  consultationId: string
  recordingUrl?: string
}) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { to, userName, serviceName, consultationId, recordingUrl } = data

    const response = await resend.emails.send({
      from: "AstroKalki <bookings@astrokalki.com>",
      to,
      subject: `Your ${serviceName} consultation recording & report`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background: linear-gradient(135deg, #56b3a8 0%, #67e8f9 100%);
                padding: 30px;
                text-align: center;
                border-radius: 12px 12px 0 0;
              }
              .header h1 {
                color: #0d0b1e;
                margin: 0;
                font-size: 28px;
              }
              .content {
                background: #ffffff;
                padding: 30px;
                border: 1px solid #e5e7eb;
                border-top: none;
              }
              .cta-button {
                display: inline-block;
                background: linear-gradient(135deg, #56b3a8 0%, #67e8f9 100%);
                color: #0d0b1e;
                padding: 14px 32px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 10px 5px;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 14px;
                border-top: 1px solid #e5e7eb;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>🌟 Thank You!</h1>
            </div>
            <div class="content">
              <p>Dear ${userName},</p>
              <p>Thank you for your ${serviceName} consultation. It was a pleasure guiding you on your cosmic journey.</p>
              
              <p>Your consultation materials are now available:</p>

              <center>
                ${recordingUrl ? `<a href="${recordingUrl}" class="cta-button">Download Recording</a>` : ""}
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "https://astrokalki.com"}/consultations/${consultationId}" class="cta-button">
                  View Full Report
                </a>
              </center>

              <p style="margin-top: 30px;">We hope the insights shared will illuminate your path forward. If you have any follow-up questions, feel free to reach out.</p>
              
              <p><strong>The AstroKalki Team</strong><br>
              <small>Karma. Cosmos. Dharma.</small></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} AstroKalki. All rights reserved.</p>
            </div>
          </body>
        </html>
      `,
    })

    return { success: true, data: response }
  } catch (error) {
    console.error("Error sending consultation completed email:", error)
    return { success: false, error }
  }
}
