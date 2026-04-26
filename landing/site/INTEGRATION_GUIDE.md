# AstroKalki Complete Integration Guide

## Overview
This is a production-ready implementation of the AstroKalki ₹99 Auto-Reading system with:
- PayPal Orders v2 integration with verified webhook signatures
- UPI payment flow with QR codes and manual verification
- LiveKit voice demo top-of-funnel
- OpenAI TTS + Claude text generation
- Puppeteer PDF generation
- Email delivery with Resend
- Google Sheets logging
- Serverless fulfillment using `waitUntil()`

## Payment Flows

### PayPal Flow
1. User clicks "Pay with PayPal" on `/checkout`
2. Frontend calls `/api/payments/paypal/create` → returns order ID
3. PayPal buttons render and user completes payment
4. Frontend calls `/api/payments/paypal/capture` → captures order
5. PayPal webhook fires → `/api/webhooks/paypal` verifies signature
6. Fulfillment triggered with `waitUntil()` → async processing

### UPI Flow
1. User clicks "Generate UPI QR"
2. Frontend calls `/api/upi/create-intent` → returns UPI URI + QR SVG
3. User scans QR or taps deep link → makes payment via UPI app
4. User enters UTR (bank reference) and clicks "Mark Paid"
5. Frontend calls `/api/admin/mark-upi-paid` → triggers fulfillment
6. Fulfillment processes with `waitUntil()` → async

## Fulfillment Pipeline

When either payment method completes:
1. **Text Generation**: Claude 3.5 Sonnet composes ethical, actionable karmic reading
2. **Audio**: OpenAI TTS converts text to MP3
3. **PDF**: Puppeteer renders styled HTML → A4 PDF
4. **Email**: Resend sends email with MP3 + PDF attachments
5. **Logging**: Google Sheets records transaction
6. **Status**: Supabase order marked "completed"

All steps run asynchronously via `waitUntil()` on serverless.

## Environment Variables

See `.env.example` for full list. Critical vars:
- `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`
- `LIVEKIT_SERVER_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`
- `OPENAI_API_KEY`
- `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `SHEETS_SPREADSHEET_ID`
- `RESEND_API_KEY`

## Deployment Checklist

- [ ] Set all env vars in Vercel project settings
- [ ] Configure PayPal webhook to point to `/api/webhooks/paypal`
- [ ] Ensure `/public/assets/audio` and `/public/assets/pdf` folders exist
- [ ] Test PayPal sandbox flow end-to-end
- [ ] Test UPI flow (create intent → mark paid)
- [ ] Verify emails are received with attachments
- [ ] Check Google Sheets logs for transactions
- [ ] Monitor Vercel function logs for errors
- [ ] Set `PUBLIC_BASE_URL` to production domain

## Local Testing

1. Start dev server: `npm run dev`
2. Create `.env.local` with sandbox credentials
3. Visit `http://localhost:3000/checkout`
4. Test PayPal with sandbox account
5. Test UPI with mock UTR entry
6. Check terminal logs for fulfillment progress

## Troubleshooting

**PayPal webhook not firing?**
- Verify webhook ID in env vars
- Check PayPal Dashboard > Webhooks for delivery logs
- Ensure `/api/webhooks/paypal` is publicly accessible

**Emails not received?**
- Verify Resend API key is correct
- Check Resend dashboard for bounce/suppression
- Ensure sender email is verified in Resend

**PDF not generating?**
- Puppeteer requires Chrome/Chromium
- Vercel has built-in Chromium support (no extra setup needed)
- Check logs for browser launch errors

**TTS audio not generated?**
- Verify OpenAI API key is valid
- Check OpenAI usage in dashboard
- Ensure `/public/assets/audio` is writable

## Production Notes

- Response returned immediately; fulfillment happens via `waitUntil()`
- Webhook verification is cryptographically signed (PayPal)
- All errors logged to Supabase + console
- Retries: Configure via Vercel dashboard or implement manually
- Rate limiting: Consider adding to checkout endpoint

## Next Steps

- Add user profiles to collect DOB/TOB/place for more personalized readings
- Implement subscription tier (monthly ₹299 vs. one-time ₹99)
- Add admin dashboard to view all transactions
- Implement retry logic for failed fulfillments
- Add SMS notifications alongside email
