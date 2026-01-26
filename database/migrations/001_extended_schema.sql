-- ============================================
-- JOBNACHBAR.COM - Extended Schema Migration
-- ============================================
-- Run this in Supabase SQL Editor after the initial schema

-- ============================================
-- FEEDBACK TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  category TEXT NOT NULL CHECK (category IN ('bug', 'improvement', 'praise', 'other')),
  message TEXT NOT NULL CHECK (length(message) >= 10),
  email TEXT,
  page_url TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Anyone can create feedback
CREATE POLICY "Anyone can create feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Users can view their own feedback
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT USING (
    user_id IS NOT NULL AND
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- ============================================
-- SUBSCRIPTION REQUESTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS subscription_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('bewerber', 'arbeitgeber')),
  plan TEXT NOT NULL,
  company_name TEXT,
  billing_name TEXT NOT NULL,
  billing_address TEXT NOT NULL,
  billing_email TEXT NOT NULL,
  vat_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invoice_created', 'invoice_sent', 'paid', 'cancelled')),
  invoice_number TEXT,
  invoice_pdf_url TEXT,
  amount_cents INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  invoice_created_at TIMESTAMPTZ,
  invoice_sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  valid_until TIMESTAMPTZ
);

-- Enable RLS
ALTER TABLE subscription_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own subscription requests" ON subscription_requests
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    company_id IN (SELECT id FROM companies WHERE auth_id = auth.uid())
  );

-- Users can create requests
CREATE POLICY "Users can create subscription requests" ON subscription_requests
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    company_id IN (SELECT id FROM companies WHERE auth_id = auth.uid())
  );

-- ============================================
-- ADMIN SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID
);

-- Insert default settings
INSERT INTO admin_settings (key, value) VALUES
  ('invoice_settings', '{"company_name": "", "address": "", "tax_number": "", "iban": "", "bic": "", "bank_name": "", "payment_terms_days": 14, "invoice_prefix": "JN"}'),
  ('next_invoice_number', '1')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- EMAIL VERIFICATION TOKENS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS email_verification_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user_id IS NOT NULL OR company_id IS NOT NULL)
);

-- ============================================
-- PASSWORD RESET TOKENS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- EXTEND USERS TABLE
-- ============================================

-- Premium features
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_until TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS premium_plan TEXT;

-- AI Usage tracking
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_usage_lebenslauf INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_usage_anschreiben INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_usage_interview INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_usage_chat INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_usage_reset_date DATE DEFAULT CURRENT_DATE;

-- AI usage tracking (alternative column names used by API routes)
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_resume_checks_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_cover_letters_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_interview_preps_used INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_salary_tips_used INTEGER DEFAULT 0;

-- Admin flag
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Onboarding
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS onboarding_step INTEGER DEFAULT 0;

-- Email verification
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;

-- Language preference
ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'de';

-- Role field for backward compatibility
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'jobseeker';

-- ============================================
-- EXTEND COMPANIES TABLE
-- ============================================

ALTER TABLE companies ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMPTZ;
ALTER TABLE companies ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'de';
ALTER TABLE companies ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'employer';

-- ============================================
-- EXTEND JOBS TABLE
-- ============================================

ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS expiry_reminder_sent BOOLEAN DEFAULT false;
ALTER TABLE jobs ADD COLUMN IF NOT EXISTS expired_notification_sent BOOLEAN DEFAULT false;

-- ============================================
-- EXTEND APPLICATIONS TABLE
-- ============================================

ALTER TABLE applications ADD COLUMN IF NOT EXISTS employer_notes TEXT;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS viewed_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS invited_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMPTZ;
ALTER TABLE applications ADD COLUMN IF NOT EXISTS is_priority BOOLEAN DEFAULT false;

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (user_id IS NOT NULL OR company_id IS NOT NULL)
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    company_id IN (SELECT id FROM companies WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) OR
    company_id IN (SELECT id FROM companies WHERE auth_id = auth.uid())
  );

-- ============================================
-- COOKIE CONSENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS cookie_consents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  necessary BOOLEAN DEFAULT true,
  statistics BOOLEAN DEFAULT false,
  marketing BOOLEAN DEFAULT false,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created_at ON feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscription_requests_status ON subscription_requests(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_company_id ON notifications(company_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_email_verification_tokens_token ON email_verification_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Reset AI usage monthly
CREATE OR REPLACE FUNCTION reset_ai_usage()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET
    ai_usage_lebenslauf = 0,
    ai_usage_anschreiben = 0,
    ai_usage_interview = 0,
    ai_usage_chat = 0,
    ai_usage_reset_date = CURRENT_DATE
  WHERE ai_usage_reset_date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Check and update premium status
CREATE OR REPLACE FUNCTION check_premium_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.premium_until IS NOT NULL AND NEW.premium_until < NOW() THEN
    NEW.is_premium := false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_premium_on_update
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION check_premium_status();

-- Update feedback updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
