# AstroKalki Agentic Ops Architecture

## System Overview

\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    USER ENTRY POINTS                        │
├─────────────────┬──────────────────┬───────────────────────┤
│  Web Interface  │  Voice Portal    │   Agent Chat          │
│  (Homepage)     │  (WebRTC)        │   (Multi-turn)        │
└────────┬────────┴────────┬─────────┴──────────┬────────────┘
         │                 │                    │
         └─────────────────┼────────────────────┘
                           │
                  ┌────────▼─────────┐
                  │  Routing Agent   │
                  │ (Service Tier)   │
                  └────────┬─────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   ┌────▼────┐      ┌─────▼────┐    ┌───────▼──────┐
   │ Checkout│      │ Analysis │    │ Voice Session│
   │ (Payment)      │ Agent    │    │ (LiveKit)    │
   └────┬────┘      └─────┬────┘    └───────┬──────┘
        │                 │                  │
        └─────────────────┼──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │    Order Created (Supabase)        │
        │    status: pending                 │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │   Payment Processing (UPI/PayPal)  │
        │   Webhook Verification             │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │    Order Status: PAID              │
        │    Queue Reading Job (BullMQ)      │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │     Background Worker (BullMQ)     │
        ├────────────────────────────────────┤
        │ 1. Generate Reading (OpenRouter)   │
        │ 2. Generate PDF                    │
        │ 3. Generate Audio (TTS)            │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │  Queue Email Job (BullMQ)          │
        │  Email with PDF + Audio Links      │
        └─────────────────┬──────────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │   Order Status: COMPLETED          │
        │   Log to Google Sheets (Analytics) │
        └────────────────────────────────────┘
\`\`\`

## Service Tiers

| Service | Price | Duration | Includes |
|---------|-------|----------|----------|
| Flash K | ₹100 | 5-10 min | Quick answer, voice message |
| Karma Level | ₹1,500 | 25-30 min | 3 questions, 7-day follow-up |
| Cosmic Code | ₹777 | 20 min | Full astrology report |
| Karma Release | ₹4,500 | 45-60 min | Past-present-future deep dive |
| Moksha Roadmap | ₹8,888 | 60-75 min | 12-18 month roadmap |
| Walk for Dharma | ₹33,999 | Ongoing | 3-month mentorship |

## Agent Architecture

### Routing Agent
- Routes incoming requests to appropriate service tier
- Analyzes user input to determine life area
- Suggests follow-up questions needed
- Returns service recommendation with confidence score

### Analysis Agent
- Performs deep karmic analysis
- Generates 7-step breakthrough plans
- Identifies remedies and practices
- Calculates opportunity windows

### Response Formatter
- Converts AI outputs to user-friendly cosmic guidance
- Formats based on service tier
- Creates shareable content

## Job Processing Pipeline

\`\`\`
Order Paid
    ↓
ReadingJobData queued to Bull
    ↓
Worker processes reading:
    1. generateKarmicReading() → OpenRouter LLM
    2. generatePDF() → PDF-lib + Storage
    3. generateAudio() → TTS API
    4. Store in readings table
    ↓
EmailJobData queued to Bull
    ↓
Worker sends email:
    1. Build email template
    2. Attach/link PDF + audio
    3. Send via Resend SMTP
    4. Update order status: completed
    5. Log to Google Sheets
\`\`\`

## Database Schema

### Orders
\`\`\`sql
- id (uuid)
- user_id (uuid, nullable)
- product (text: service tier)
- amount (integer)
- currency (text: INR/USD)
- status (text: pending|paid|processing|completed|failed)
- channel (text: web|upi|paypal|voice)
- external_id (text: payment gateway ID)
- created_at
\`\`\`

### Readings
\`\`\`sql
- id (uuid)
- order_id (uuid, FK)
- inputs (jsonb: user question, DOB, location, etc.)
- output (jsonb: analysis, remedies, 7-day plan)
- pdf_url (text)
- created_at
\`\`\`

### Fulfillment Events
\`\`\`sql
- id (uuid)
- order_id (uuid, FK)
- event_type (text: email_sent, pdf_generated, etc.)
- status (text: sent|delivered|bounced|failed)
- metadata (jsonb)
- created_at
\`\`\`

### Voice Sessions
\`\`\`sql
- id (uuid)
- user_id (text)
- room_name (text: LiveKit room)
- event_type (text: participant_joined|left|recording_finished)
- duration (integer: seconds)
- metadata (jsonb)
- created_at
\`\`\`

## Webhook Flow

### PayPal Webhook
\`\`\`
PayPal Order Completed
    ↓
POST /api/webhooks/payments/paypal/verify
    ↓
Verify signature
    ↓
Update order status: paid
    ↓
Queue reading generation job
\`\`\`

### UPI Webhook
\`\`\`
UPI Payment Gateway Callback
    ↓
POST /api/webhooks/payments/upi/verify
    ↓
Verify transaction ID
    ↓
Update order status: paid
    ↓
Queue reading generation job
\`\`\`

## API Endpoints

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders?id=uuid` - Get order details
- `POST /api/orders/status` - Update order status

### Payments
- `POST /api/payments/paypal/pay` - Initiate PayPal payment
- `POST /api/payments/upi/pay` - Initiate UPI payment
- `POST /api/webhooks/payments/paypal/verify` - PayPal webhook
- `POST /api/webhooks/payments/upi/verify` - UPI webhook

### Agents
- `POST /api/agents/route` - Route user input to service
- `POST /api/agents/analyze` - Deep karmic analysis

### Fulfillment
- `POST /api/fulfillment/send` - Send reading to user
- `GET /api/fulfillment/status?id=uuid` - Check fulfillment status

### Admin
- `GET /api/admin/stats` - Business statistics

### LiveKit
- `POST /api/livekit/token` - Generate voice session token
- `POST /api/livekit/webhook` - LiveKit events

## Performance Considerations

- Reading generation: ~2-5s (OpenRouter API latency)
- PDF generation: ~1s
- Audio generation: ~3-10s (depends on text length)
- Email delivery: ~100ms
- Total fulfillment time: ~10-20s end-to-end

For high volume, use:
- Caching for repeated prompts
- Async PDF/audio generation
- Multiple worker processes
- Rate limiting on API endpoints
`
</parameter>
