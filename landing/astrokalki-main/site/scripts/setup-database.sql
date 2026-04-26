-- Database schema and setup script

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  dob DATE,
  location TEXT,
  sun_sign TEXT,
  moon_sign TEXT,
  life_path_number INTEGER,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Orders/Payments table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  product TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT DEFAULT 'INR',
  channel TEXT NOT NULL,
  external_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Consultations/Bookings table
CREATE TABLE IF NOT EXISTS consultations (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  astrologer_id TEXT NOT NULL DEFAULT 'astrokalki-main',
  service_type TEXT NOT NULL,
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'scheduled',
  room_name TEXT UNIQUE,
  duration INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Readings table
CREATE TABLE IF NOT EXISTS readings (
  id UUID DEFAULT uuid_generate_v4() NOT NULL PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES consultations(id),
  service_type TEXT,
  content TEXT,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled ON consultations(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_readings_user_id ON readings(user_id);

-- Row Level Security (RLS) Policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE readings ENABLE ROW LEVEL SECURITY;

-- Profiles RLS
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Orders RLS
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

-- Consultations RLS
CREATE POLICY "Users can view own consultations" ON consultations
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create consultations" ON consultations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Readings RLS
CREATE POLICY "Users can view own readings" ON readings
  FOR SELECT USING (auth.uid() = user_id);
