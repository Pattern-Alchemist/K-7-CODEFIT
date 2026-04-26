# AstroKalki Agentic Ops - Deployment Guide

## Architecture Overview

AstroKalki is built with a complete agentic operations system:

- **Frontend**: Next.js 15 on Vercel (web + voice entry points)
- **Backend APIs**: Vercel Functions (payments, webhooks, agents, fulfillment)
- **Worker**: BullMQ + Redis for background job processing
- **Database**: Supabase PostgreSQL for orders, readings, fulfillment tracking
- **AI/LLM**: OpenRouter (auto-selects best model)
- **Voice**: LiveKit for real-time sessions
- **Storage**: Vercel Blob (PDFs, audio files)
- **Email**: Resend for fulfillment delivery
- **Analytics**: Google Sheets logging

## Prerequisites

1. **Accounts & Keys**
   - Vercel (deployment platform)
   - Supabase (database)
   - OpenRouter (LLM)
   - LiveKit Cloud (voice sessions)
   - Redis/Upstash (background jobs)
   - Resend (email delivery)
   - PayPal API (payments)
   - Google Sheets API (analytics)

2. **Environment Variables** (see `.env.example`)

## Deployment Steps

### 1. Vercel Frontend Deployment

\`\`\`bash
# Login to Vercel
vercel login

# Deploy the web app
vercel --prod

# Add environment variables in Vercel dashboard:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - OPENROUTER_API_KEY
# - LIVEKIT_API_KEY, LIVEKIT_API_SECRET
# - PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET
# - All other keys from .env.example
\`\`\`

### 2. Supabase Database Setup

\`\`\`bash
# Install Supabase CLI
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Push database migrations
supabase db push
\`\`\`

The SQL migrations in `SUPABASE.sql` will create:
- `orders` - Payment orders and fulfillment tracking
- `readings` - Generated karmic readings and AI outputs
- `leads` - User information from forms and voice
- `fulfillment_events` - Email delivery and fulfillment logs
- `email_log` - SMTP delivery tracking
- `voice_sessions` - LiveKit session analytics

### 3. Redis/BullMQ Setup

\`\`\`bash
# Option A: Upstash (serverless Redis)
# 1. Create free account at upstash.com
# 2. Create new database
# 3. Copy REDIS_URL to environment variables

# Option B: Self-hosted Redis
# 1. Deploy Redis server (Docker, AWS ElastiCache, etc.)
# 2. Set REDIS_URL environment variable
\`\`\`

### 4. Background Worker Deployment

The BullMQ worker processes reading generation and email jobs.

**Option A: Vercel Cron Functions**
\`\`\`typescript
// app/api/cron/process-jobs/route.ts
// Triggers every minute to process queued jobs
export const config = {
  api: {
    maxDuration: 300,
  },
}
\`\`\`

**Option B: Dedicated Worker Service**

Deploy worker as separate service:

\`\`\`bash
# Build worker
pnpm build

# Deploy to:
# - Railway (easiest)
# - Render
# - AWS EC2
# - DigitalOcean

# Running:
pnpm run worker
\`\`\`

### 5. Payment Webhooks

Configure webhook endpoints in payment dashboards:

**PayPal**:
- Webhook URL: `https://your-domain.com/api/webhooks/payments/paypal/verify`
- Events: `CHECKOUT.ORDER.COMPLETED`, `CHECKOUT.ORDER.APPROVED`

**UPI Gateway**:
- Webhook URL: `https://your-domain.com/api/webhooks/payments/upi/verify`
- Events: `payment.success`, `payment.failed`

### 6. LiveKit Setup

\`\`\`bash
# Create LiveKit Cloud project at livekit.cloud
# 1. Get API Key and Secret
# 2. Get server URL (wss://your-livekit-server.com)
# 3. Add to environment variables:
#    - LIVEKIT_API_KEY
#    - LIVEKIT_API_SECRET
#    - LIVEKIT_SERVER_URL
\`\`\`

### 7. OpenRouter Configuration

\`\`\`bash
# 1. Sign up at openrouter.ai
# 2. Create API key
# 3. Add OPENROUTER_API_KEY to environment variables
# 4. Select preferred model routing in lib/agents/*
\`\`\`

## Monitoring & Logging

### Order Status Tracking
\`\`\`bash
# Check order status:
curl https://your-domain.com/api/orders?id=order-uuid

# Check fulfillment status:
curl https://your-domain.com/api/fulfillment/status?id=order-uuid
\`\`\`

### Admin Dashboard
\`\`\`
https://your-domain.com/admin/orders    # Real-time orders
https://your-domain.com/admin/analytics # Revenue metrics
\`\`\`

### Logs
- Supabase: fulfillment_events, email_log tables
- Google Sheets: Automatic logging via Sheets API
- Vercel: Function logs dashboard

## Cost Optimization

- **Vercel**: ~$20/month for hobby tier functions
- **Supabase**: Free tier (~500MB storage)
- **Redis**: Upstash free tier (10GB/month)
- **OpenRouter**: Pay per API call (~$0.001-0.01 per request)
- **LiveKit**: Pay per session minute
- **Resend**: Free for first 100 emails/day, then $0.20/email

## Troubleshooting

### Orders Stuck in "Pending"
1. Check payment webhook logs in Supabase
2. Verify webhook URLs in payment dashboard
3. Check Redis connection: `redis-cli ping`

### Reading Generation Fails
1. Check OpenRouter API key in Vercel env vars
2. Check Redis connectivity
3. Review worker logs

### Email Not Sending
1. Verify Resend API key
2. Check SMTP configuration
3. Review email_log table for bounces

### Voice Sessions Disconnecting
1. Check LiveKit server status
2. Verify network connectivity
3. Check client browser console for errors

## Production Checklist

- [ ] All environment variables configured in Vercel
- [ ] Supabase Row Level Security (RLS) policies reviewed
- [ ] Payment webhooks verified and tested
- [ ] Email templates tested with real addresses
- [ ] BullMQ worker running and processing jobs
- [ ] Redis connection stable and monitored
- [ ] OpenRouter API limits configured
- [ ] LiveKit Cloud project created and configured
- [ ] Admin dashboard accessible with authentication
- [ ] Google Sheets logging working for analytics
- [ ] Error monitoring (Sentry/LogRocket) configured
- [ ] Database backups configured in Supabase

## Scaling Considerations

1. **High Volume Orders**: Increase worker concurrency in BullMQ
2. **Large Readings**: Optimize PDF generation, use async processing
3. **Voice Sessions**: Scale LiveKit with dedicated server or multi-region
4. **Database**: Enable Supabase vector search for semantic analysis
5. **Caching**: Add Redis caching for frequently accessed readings

## Support & Documentation

- Supabase: https://supabase.com/docs
- OpenRouter: https://openrouter.ai/docs
- LiveKit: https://docs.livekit.io
- BullMQ: https://docs.bullmq.io
- Vercel: https://vercel.com/docs
`
</parameter>
