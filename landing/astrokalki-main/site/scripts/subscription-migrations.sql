-- Subscription Plans and User Subscriptions Schema
-- Run this in your Supabase SQL Editor after setting up Stripe

-- Subscription plans table
CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly DECIMAL(10,2) NOT NULL,
  price_yearly DECIMAL(10,2),
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  consultations_per_month INTEGER DEFAULT 0,
  priority_support BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES subscription_plans(id),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'paused')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  consultations_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, plan_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_customer ON user_subscriptions(stripe_customer_id);

-- RLS Policies
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

-- Everyone can view subscription plans
CREATE POLICY "Anyone can view subscription plans"
  ON subscription_plans FOR SELECT
  USING (true);

-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON user_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, price_yearly, features, consultations_per_month, priority_support)
VALUES 
  ('Cosmic Starter', 'Perfect for exploring your spiritual journey', 99.00, 999.00, 
   '["1 video consultation per month", "AI horoscope generator", "Email support", "Monthly cosmic insights"]'::jsonb, 
   1, false),
  
  ('Karmic Explorer', 'Deep dive into your karmic patterns', 299.00, 2999.00, 
   '["3 video consultations per month", "AI horoscope generator", "Priority email support", "Weekly cosmic insights", "Karmic map analysis"]'::jsonb, 
   3, true),
  
  ('Dharma Master', 'Complete spiritual transformation package', 777.00, 7777.00, 
   '["Unlimited video consultations", "AI horoscope generator", "24/7 priority support", "Daily cosmic insights", "Personalized dharma roadmap", "Exclusive workshops"]'::jsonb, 
   999, true)
ON CONFLICT DO NOTHING;

-- Function to reset monthly consultation count
CREATE OR REPLACE FUNCTION reset_monthly_consultations()
RETURNS void AS $$
BEGIN
  UPDATE user_subscriptions
  SET consultations_used = 0
  WHERE current_period_end < NOW()
    AND status = 'active';
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
  BEFORE UPDATE ON user_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
