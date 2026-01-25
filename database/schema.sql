-- ============================================
-- JOBNACHBAR.COM - Supabase Database Schema
-- ============================================
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE employment_type AS ENUM (
  'vollzeit',
  'teilzeit',
  'minijob',
  'ausbildung',
  'praktikum',
  'werkstudent',
  'freelance'
);

CREATE TYPE industry_type AS ENUM (
  'handwerk',
  'pflege_gesundheit',
  'gastro_hotel',
  'einzelhandel',
  'logistik_transport',
  'industrie_produktion',
  'buero_verwaltung',
  'it_technik',
  'bau_architektur',
  'landwirtschaft',
  'bildung_soziales',
  'sonstiges'
);

CREATE TYPE subscription_tier AS ENUM (
  'free',
  'basic',
  'premium'
);

CREATE TYPE application_status AS ENUM (
  'new',
  'viewed',
  'accepted',
  'rejected'
);

CREATE TYPE job_status AS ENUM (
  'active',
  'paused',
  'filled',
  'expired'
);

CREATE TYPE user_status AS ENUM (
  'active',
  'inactive',
  'hired'
);

-- ============================================
-- USERS (Bewerber)
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Auth (managed by Supabase Auth, but we store profile data here)
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  
  -- Personal Info
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  birthdate DATE,
  
  -- Location
  zip_code TEXT NOT NULL,
  city TEXT NOT NULL,
  radius_km INT DEFAULT 30,
  
  -- Job Preferences
  job_title_wanted TEXT,
  experience_years INT DEFAULT 0,
  qualifications TEXT[],
  industries industry_type[],
  employment_types employment_type[],
  available_from DATE,
  salary_expectation TEXT,
  
  -- Profile
  about_me TEXT,
  cv_url TEXT,
  profile_image_url TEXT,
  
  -- Status & Settings
  status user_status DEFAULT 'active',
  email_notifications BOOLEAN DEFAULT true,
  whatsapp_notifications BOOLEAN DEFAULT false,
  whatsapp_number TEXT
);

-- ============================================
-- COMPANIES (Unternehmen)
-- ============================================

CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Auth
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  
  -- Company Info
  company_name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  phone TEXT,
  
  -- Address
  street TEXT,
  zip_code TEXT NOT NULL,
  city TEXT NOT NULL,
  
  -- Details
  website TEXT,
  industry industry_type,
  company_size TEXT, -- '1-10', '11-50', '51-200', '200+'
  logo_url TEXT,
  about_company TEXT,
  
  -- Verification & Subscription
  verified BOOLEAN DEFAULT false,
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires DATE,
  
  -- Limits tracking
  jobs_posted_this_month INT DEFAULT 0,
  applications_received_this_month INT DEFAULT 0
);

-- ============================================
-- JOBS (Stellenanzeigen)
-- ============================================

CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Job Info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  
  -- Categories
  industry industry_type NOT NULL,
  employment_type employment_type NOT NULL,
  
  -- Location
  zip_code TEXT NOT NULL,
  city TEXT NOT NULL,
  
  -- Salary (optional)
  salary_min INT,
  salary_max INT,
  salary_type TEXT, -- 'hourly', 'monthly', 'yearly'
  
  -- Dates
  start_date DATE,
  application_deadline DATE,
  
  -- Status & Stats
  status job_status DEFAULT 'active',
  views INT DEFAULT 0,
  
  -- Boost
  is_boosted BOOLEAN DEFAULT false,
  boosted_until DATE
);

-- ============================================
-- APPLICATIONS (Bewerbungen)
-- ============================================

CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Application Data
  cover_letter TEXT,
  status application_status DEFAULT 'new',
  
  -- Payment (for pay-per-lead model)
  is_paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMPTZ,
  price_paid DECIMAL(10,2),
  
  -- Prevent duplicate applications
  UNIQUE(user_id, job_id)
);

-- ============================================
-- SUBSCRIPTIONS (Abonnements)
-- ============================================

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
  
  -- Subscription Info
  tier subscription_tier NOT NULL,
  price_monthly DECIMAL(10,2) NOT NULL,
  
  -- Dates
  started_at DATE NOT NULL DEFAULT CURRENT_DATE,
  expires_at DATE NOT NULL,
  cancelled_at DATE,
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
  
  -- Invoicing
  invoices_sent INT DEFAULT 0,
  last_invoice_sent_at DATE
);

-- ============================================
-- MATCHES (Automatisches Matching)
-- ============================================

CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Relations
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  
  -- Match Data
  match_score INT NOT NULL, -- 0-100
  
  -- Notification
  notified BOOLEAN DEFAULT false,
  notified_at TIMESTAMPTZ,
  notification_type TEXT, -- 'email', 'whatsapp'
  
  -- Prevent duplicate matches
  UNIQUE(user_id, job_id)
);

-- ============================================
-- INDEXES for Performance
-- ============================================

-- Users
CREATE INDEX idx_users_zip_code ON users(zip_code);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_industries ON users USING GIN(industries);
CREATE INDEX idx_users_employment_types ON users USING GIN(employment_types);

-- Companies
CREATE INDEX idx_companies_zip_code ON companies(zip_code);
CREATE INDEX idx_companies_subscription_tier ON companies(subscription_tier);

-- Jobs
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_industry ON jobs(industry);
CREATE INDEX idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX idx_jobs_zip_code ON jobs(zip_code);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);

-- Applications
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_company_id ON applications(company_id);
CREATE INDEX idx_applications_status ON applications(status);

-- Matches
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_job_id ON matches(job_id);
CREATE INDEX idx_matches_score ON matches(match_score DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Users can read/update their own profile
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Companies can read/update their own profile
CREATE POLICY "Companies can view own profile" ON companies
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Companies can update own profile" ON companies
  FOR UPDATE USING (auth.uid() = auth_id);

-- Jobs are publicly readable, but only company can edit
CREATE POLICY "Jobs are publicly readable" ON jobs
  FOR SELECT USING (status = 'active');

CREATE POLICY "Companies can manage own jobs" ON jobs
  FOR ALL USING (
    company_id IN (SELECT id FROM companies WHERE auth_id = auth.uid())
  );

-- Applications: users see their own, companies see applications to their jobs
CREATE POLICY "Users can view own applications" ON applications
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

CREATE POLICY "Companies can view applications to their jobs" ON applications
  FOR SELECT USING (
    company_id IN (SELECT id FROM companies WHERE auth_id = auth.uid())
  );

-- Users can create applications
CREATE POLICY "Users can create applications" ON applications
  FOR INSERT WITH CHECK (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Matches: users see their own matches
CREATE POLICY "Users can view own matches" ON matches
  FOR SELECT USING (user_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at
  BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- MATCHING FUNCTION
-- ============================================

CREATE OR REPLACE FUNCTION calculate_match_score(
  p_user_id UUID,
  p_job_id UUID
) RETURNS INT AS $$
DECLARE
  v_score INT := 0;
  v_user RECORD;
  v_job RECORD;
  v_distance FLOAT;
BEGIN
  -- Get user and job data
  SELECT * INTO v_user FROM users WHERE id = p_user_id;
  SELECT * INTO v_job FROM jobs WHERE id = p_job_id;
  
  -- 1. Industry match (25 points)
  IF v_job.industry = ANY(v_user.industries) THEN
    v_score := v_score + 25;
  END IF;
  
  -- 2. Employment type match (20 points)
  IF v_job.employment_type = ANY(v_user.employment_types) THEN
    v_score := v_score + 20;
  END IF;
  
  -- 3. Location / ZIP code proximity (30 points)
  -- Simple check: same first 2 digits of ZIP = nearby
  IF LEFT(v_user.zip_code, 2) = LEFT(v_job.zip_code, 2) THEN
    v_score := v_score + 30;
  ELSIF LEFT(v_user.zip_code, 1) = LEFT(v_job.zip_code, 1) THEN
    v_score := v_score + 15;
  END IF;
  
  -- 4. Experience (15 points)
  -- If job doesn't require specific experience, give full points
  v_score := v_score + 15;
  
  -- 5. Availability (10 points)
  IF v_user.available_from IS NULL OR v_user.available_from <= COALESCE(v_job.start_date, CURRENT_DATE) THEN
    v_score := v_score + 10;
  END IF;
  
  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- AUTO-MATCHING TRIGGER
-- ============================================

-- When a new job is created, find matching users
CREATE OR REPLACE FUNCTION create_matches_for_new_job()
RETURNS TRIGGER AS $$
DECLARE
  v_user RECORD;
  v_score INT;
BEGIN
  -- Find all active users and calculate match scores
  FOR v_user IN SELECT id FROM users WHERE status = 'active' LOOP
    v_score := calculate_match_score(v_user.id, NEW.id);
    
    -- Only create match if score >= 50
    IF v_score >= 50 THEN
      INSERT INTO matches (user_id, job_id, match_score)
      VALUES (v_user.id, NEW.id, v_score)
      ON CONFLICT (user_id, job_id) DO NOTHING;
    END IF;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_matches_for_new_job
  AFTER INSERT ON jobs
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION create_matches_for_new_job();

-- ============================================
-- INITIAL DATA (optional)
-- ============================================

-- Add some test data for development
-- (Remove this section in production)

/*
INSERT INTO companies (email, company_name, contact_person, zip_code, city, industry, verified)
VALUES 
  ('test@autofix-zeven.de', 'AutoFix Zeven', 'Max Mustermann', '27404', 'Zeven', 'handwerk', true);
*/
