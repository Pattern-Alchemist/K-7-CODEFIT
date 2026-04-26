-- LiveKit consultation schema
create table if not exists public.consultations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  service_type text not null, -- 'flash_k', 'cosmic_code', 'karma_level', 'karma_release', 'moksha_roadmap', 'walk_dharma'
  astrologer_id uuid,
  status text not null default 'pending', -- 'pending', 'scheduled', 'in_progress', 'completed', 'cancelled'
  scheduled_at timestamptz,
  duration_minutes integer,
  amount integer not null,
  payment_status text default 'pending', -- 'pending', 'completed', 'refunded'
  room_name text, -- LiveKit room identifier
  recording_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.consultation_slots (
  id uuid primary key default gen_random_uuid(),
  astrologer_id uuid references auth.users(id) on delete cascade,
  date_slot date not null,
  time_slot time not null,
  is_available boolean default true,
  consultation_id uuid references public.consultations(id),
  created_at timestamptz default now()
);

create table if not exists public.astrologers (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  bio text,
  expertise text[],
  hourly_rate integer,
  availability_timezone text,
  verified boolean default false,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.consultations enable row level security;
alter table public.consultation_slots enable row level security;
alter table public.astrologers enable row level security;

-- RLS Policies for consultations
create policy "users_can_view_own_consultations" on public.consultations 
  for select using (auth.uid() = user_id or auth.uid() = astrologer_id);

create policy "users_can_create_consultations" on public.consultations 
  for insert with check (auth.uid() = user_id);

create policy "users_can_update_own_consultations" on public.consultations 
  for update using (auth.uid() = user_id or auth.uid() = astrologer_id);

-- RLS Policies for slots
create policy "anyone_can_view_slots" on public.consultation_slots 
  for select using (true);

create policy "astrologers_can_manage_slots" on public.consultation_slots 
  for insert with check (auth.uid() = astrologer_id);

-- RLS Policies for astrologers
create policy "anyone_can_view_astrologers" on public.astrologers 
  for select using (true);
