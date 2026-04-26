create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  email text,
  created_at timestamptz default now()
);
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  product text not null default 'karmic_snapshot',
  currency text not null default 'INR',
  amount integer not null,
  status text not null default 'pending',
  channel text not null,
  external_id text,
  created_at timestamptz default now()
);
create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  inputs jsonb not null,
  output jsonb,
  pdf_url text,
  created_at timestamptz default now()
);
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  dob text not null,
  tob text,
  birth_location text not null,
  country text,
  email text not null,
  source text default 'services',
  created_at timestamptz default now()
);
-- Add fulfillment tracking tables
create table if not exists public.fulfillment_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  event_type text not null, -- 'email_sent', 'pdf_generated', 'audio_generated', 'delivered', 'failed'
  status text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

create table if not exists public.email_log (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  recipient_email text not null,
  message_id text,
  status text not null, -- 'sent', 'delivered', 'bounced', 'failed'
  sent_at timestamptz default now()
);

-- Add voice session tracking table
create table if not exists public.voice_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  room_name text,
  event_type text not null,
  duration integer, -- in seconds
  metadata jsonb,
  created_at timestamptz default now()
);

alter table public.orders enable row level security;
alter table public.readings enable row level security;
alter table public.leads enable row level security;
alter table public.fulfillment_events enable row level security;
alter table public.email_log enable row level security;
alter table public.voice_sessions enable row level security;
create policy "insert_any_order" on public.orders for insert with check (true);
create policy "read_orders" on public.orders for select using (true);
create policy "insert_reading" on public.readings for insert with check (true);
create policy "read_readings" on public.readings for select using (true);
create policy "insert_leads" on public.leads for insert with check (true);
create policy "read_leads" on public.leads for select using (true);
create policy "insert_fulfillment_events" on public.fulfillment_events for insert with check (true);
create policy "read_fulfillment_events" on public.fulfillment_events for select using (true);
create policy "insert_email_log" on public.email_log for insert with check (true);
create policy "read_email_log" on public.email_log for select using (true);
create policy "insert_voice_sessions" on public.voice_sessions for insert with check (true);
create policy "read_voice_sessions" on public.voice_sessions for select using (true);
