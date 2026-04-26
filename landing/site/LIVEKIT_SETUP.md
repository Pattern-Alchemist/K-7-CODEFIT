# LiveKit Consultation Setup Guide

This guide helps you set up LiveKit for video consultations on AstroKalki.

## Prerequisites

1. LiveKit Cloud Account (https://livekit.io)
2. Vercel Project with environment variables access

## Setup Steps

### 1. Create LiveKit Project

1. Sign up at https://livekit.io
2. Create a new project in the LiveKit console
3. You'll receive:
   - **LiveKit Server URL** (looks like: `wss://your-project.livekit.cloud`)
   - **API Key**
   - **API Secret**

### 2. Set Environment Variables

Add these to your Vercel project's environment variables:

\`\`\`
LIVEKIT_SERVER_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_api_key
LIVEKIT_API_SECRET=your_api_secret
NEXT_PUBLIC_LIVEKIT_SERVER_URL=wss://your-project.livekit.cloud
\`\`\`

### 3. Database Schema

Run the migration script to create consultation tables:

\`\`\`bash
npm run db:migrate
# or manually run scripts/livekit-migrations.sql in Supabase
\`\`\`

### 4. Test the Flow

1. Sign up/Login at `/auth/signup`
2. View profile at `/profile`
3. Book a consultation from homepage
4. Join session at `/consultations/[id]`

## Features

- **Video/Audio Rooms**: Real-time consultation with LiveKit
- **Recording**: Sessions are recorded for astrologer reference
- **Transcription**: Real-time transcript during calls
- **Payment Integration**: UPI and PayPal support
- **Admin Panel**: Manage consultations and track payments

## Troubleshooting

### "Failed to generate token"
- Check `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set correctly
- Verify they're not exposed in client-side code

### "Connection refused"
- Verify `LIVEKIT_SERVER_URL` is correct
- Check network connectivity to LiveKit servers
- Ensure URL uses `wss://` (WebSocket Secure)

### Sessions not appearing in admin panel
- Run migration: `scripts/livekit-migrations.sql`
- Check Supabase RLS policies are properly set
- Verify user authentication is working

## Architecture

\`\`\`
User Consultation Flow:
1. Login/Register → /auth/signup
2. View Profile → /profile
3. Book Session → /consultations (calendar UI)
4. Select Time → /api/bookings/available-slots
5. Process Payment → /api/consultations/payment
6. Join Room → /consultations/[id] (LiveKit)
7. Admin View → /admin/dashboard (consultations tab)
\`\`\`

## Security Notes

- API keys are server-only (never exposed to client)
- JWT tokens are generated server-side for each session
- Room names are unique and timestamped
- Payment verification happens server-side
- RLS policies protect user data in Supabase

## API Endpoints

- `POST /api/consultations/room-token` - Get LiveKit token for joining
- `POST /api/consultations/list` - Get user's consultations
- `POST /api/bookings/create` - Create booking
- `POST /api/bookings/available-slots` - Get available times
- `POST /api/consultations/payment` - Initiate payment
- `POST /api/consultations/payment/verify` - Verify payment
