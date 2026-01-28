-- ============================================
-- JOBNACHBAR.COM - Anonymous Usage Tracking
-- ============================================
-- This migration adds tracking for anonymous users' AI feature usage
-- Allows 1 free use per feature per IP address per 24 hours

-- ============================================
-- ANONYMOUS USAGE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS anonymous_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ip_address TEXT NOT NULL,
  feature_type TEXT NOT NULL CHECK (feature_type IN ('resume', 'cover_letter', 'interview', 'salary')),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Index for efficient lookups by IP and feature type
CREATE INDEX IF NOT EXISTS idx_anonymous_usage_ip_feature ON anonymous_usage(ip_address, feature_type);

-- Index for time-based queries (checking usage in last 24 hours)
CREATE INDEX IF NOT EXISTS idx_anonymous_usage_used_at ON anonymous_usage(used_at DESC);

-- Composite index for the most common query pattern
CREATE INDEX IF NOT EXISTS idx_anonymous_usage_lookup ON anonymous_usage(ip_address, feature_type, used_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS
ALTER TABLE anonymous_usage ENABLE ROW LEVEL SECURITY;

-- Service role can do everything (for API routes using service key)
CREATE POLICY "Service role full access" ON anonymous_usage
  FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- CLEANUP FUNCTION
-- ============================================

-- Function to clean up old anonymous usage records (older than 7 days)
-- This helps keep the table size manageable
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_usage()
RETURNS void AS $$
BEGIN
  DELETE FROM anonymous_usage
  WHERE used_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE anonymous_usage IS 'Tracks AI feature usage for anonymous (non-logged-in) users by IP address';
COMMENT ON COLUMN anonymous_usage.ip_address IS 'Client IP address (from x-forwarded-for or x-real-ip header)';
COMMENT ON COLUMN anonymous_usage.feature_type IS 'Type of AI feature used: resume, cover_letter, interview, or salary';
COMMENT ON COLUMN anonymous_usage.used_at IS 'When the feature was used (for 24-hour limit checking)';
