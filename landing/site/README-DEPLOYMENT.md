# AstroKalki Agentic Ops - Complete Build

This is a production-ready cosmic guidance platform with complete agentic operations.

## What's Included

### 1. Payment Infrastructure ✅
- PayPal Orders v2 integration
- UPI deep links (Razorpay/PhonePe)
- Webhook verification & security
- Order tracking in Supabase

### 2. Background Job Processing ✅
- BullMQ + Redis for reliable queuing
- Reading generation workers
- PDF & audio generation
- Email fulfillment pipeline

### 3. AI Agent Orchestration ✅
- Routing Agent (service tier selection)
- Analysis Agent (karmic deep-dive)
- OpenRouter for optimal LLM selection
- Multi-turn agent chat interface

### 4. Email & Fulfillment ✅
- Resend SMTP integration
- Beautiful HTML templates
- PDF & audio delivery
- Google Sheets analytics logging

### 5. Admin Dashboard ✅
- Real-time order tracking
- Revenue analytics & trends
- Service breakdown charts
- Order detail modals

### 6. Voice Integration ✅
- LiveKit real-time sessions
- Web Speech API transcription
- Voice → agent routing
- Session analytics

### 7. Full Deployment ✅
- Vercel configuration
- Docker worker setup
- Environment templates
- Deployment guide

## Quick Start

1. **Clone & Setup**
\`\`\`bash
git clone <repo>
cd astrokalki
pnpm install
cp .env.example .env.local
\`\`\`

2. **Configure Environment Variables**
- Supabase: Database URL + API keys
- OpenRouter: LLM API key
- LiveKit: API key + server URL
- Redis: Connection string
- Payment APIs: PayPal, UPI keys
- Email: Resend API key

3. **Deploy to Vercel**
\`\`\`bash
vercel --prod
\`\`\`

4. **Deploy Background Worker** (optional)
\`\`\`bash
# Via Railway, Render, or similar
pnpm run worker
\`\`\`

5. **Test**
- Homepage: https://your-domain.com
- Admin: https://your-domain.com/admin/orders
- Health: https://your-domain.com/api/health

## File Structure

\`\`\`
astrokalki/
├── app/
│   ├── api/
│   │   ├── orders/               # Order management
│   │   ├── payments/             # Payment processing
│   │   ├── webhooks/             # Payment webhooks
│   │   ├── agents/               # AI agents
│   │   ├── fulfillment/          # Email delivery
│   │   ├── livekit/              # Voice sessions
│   │   ├── admin/                # Admin APIs
│   │   └── health/               # Health checks
│   ├── admin/                    # Admin dashboard
│   └── page.tsx                  # Homepage
├── components/
│   ├── voice-entry-point.tsx     # Voice portal
│   ├── voice-session.tsx         # LiveKit room
│   ├── agent-chat.tsx            # Agent chat
│   └── [other components]
├── lib/
│   ├── agents/                   # AI agents
│   ├── workers/                  # BullMQ processors
│   ├── fulfillment/              # Email & fulfillment
│   ├── ai/                       # AI helpers
│   ├── livekit.ts                # LiveKit client
│   ├── redis.ts                  # Redis client
│   ├── order-service.ts          # Order CRUD
│   └── [other utilities]
├── worker/
│   └── index.ts                  # Background worker
├── DEPLOYMENT.md                 # Deployment guide
├── ARCHITECTURE.md               # System architecture
└── vercel.json                   # Vercel config
\`\`\`

## Key Features

- **Cosmic Guidance**: AI-powered karmic analysis using agents
- **Voice Portal**: Speak your question, get instant guidance
- **Multiple Services**: Flash K to Walk for Dharma (₹100 - ₹33,999)
- **Real-time Orders**: Admin dashboard with live updates
- **Intelligent Routing**: AI determines best service for each user
- **Fulfillment**: Automatic PDF, audio, and email delivery
- **Analytics**: Revenue tracking and service breakdown

## Cost Estimates (Monthly)

- Vercel: $20 (Pro plan)
- Supabase: $25 (Pro plan)
- Redis: $29 (Upstash Pro)
- OpenRouter: Variable ($0.001-0.01/req)
- LiveKit: Variable ($0.02/session min)
- Resend: $0.20/email after 100/day free

**Total: ~$100-200 + AI/voice usage**

## Support

For issues and questions:
1. Check DEPLOYMENT.md for troubleshooting
2. Review ARCHITECTURE.md for system design
3. Check logs in Vercel & Supabase dashboards
4. Run health check: `/api/health`

---

Built with Next.js 15, Supabase, OpenRouter, and Vercel.
`
</parameter>
