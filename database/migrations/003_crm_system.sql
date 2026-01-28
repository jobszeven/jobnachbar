-- ============================================
-- JOBNACHBAR CRM SYSTEM - Database Schema
-- ============================================
-- Run this in Supabase SQL Editor

-- ============================================
-- INVOICES (Rechnungen)
-- ============================================

CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Invoice Number (e.g., JN-2026-0001)
  invoice_number TEXT UNIQUE NOT NULL,

  -- Customer (Company)
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,

  -- Customer Info (snapshot at invoice time)
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_address TEXT,
  customer_city TEXT,
  customer_zip TEXT,
  customer_country TEXT DEFAULT 'Deutschland',

  -- Invoice Details
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,

  -- Amounts (in cents to avoid floating point issues)
  subtotal_cents INTEGER NOT NULL DEFAULT 0,
  tax_rate DECIMAL(5,2) DEFAULT 19.00,
  tax_cents INTEGER NOT NULL DEFAULT 0,
  total_cents INTEGER NOT NULL DEFAULT 0,

  -- Status
  status TEXT NOT NULL DEFAULT 'draft', -- draft, sent, paid, overdue, cancelled

  -- Payment
  paid_at TIMESTAMPTZ,
  payment_method TEXT, -- bank_transfer, stripe, paypal
  payment_reference TEXT,

  -- PDF
  pdf_url TEXT,

  -- Notes
  notes TEXT,
  internal_notes TEXT
);

-- ============================================
-- INVOICE ITEMS (Rechnungspositionen)
-- ============================================

CREATE TABLE IF NOT EXISTS invoice_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  -- Item Details
  description TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price_cents INTEGER NOT NULL,
  total_cents INTEGER NOT NULL,

  -- Optional: Link to subscription/service
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,

  -- Order
  position INTEGER DEFAULT 0
);

-- ============================================
-- CRM ACTIVITIES (Aktivitäten/Timeline)
-- ============================================

CREATE TABLE IF NOT EXISTS crm_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Related entity
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

  -- Activity Info
  activity_type TEXT NOT NULL, -- email_sent, invoice_created, payment_received, note_added, subscription_started, subscription_cancelled
  title TEXT NOT NULL,
  description TEXT,

  -- Who performed the action
  performed_by TEXT -- admin email or 'system'
);

-- ============================================
-- CRM NOTES (Notizen zu Kunden)
-- ============================================

CREATE TABLE IF NOT EXISTS crm_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Related entity
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,

  -- Note content
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,

  -- Author
  author TEXT NOT NULL
);

-- ============================================
-- EMAIL TEMPLATES (E-Mail Vorlagen)
-- ============================================

CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Template Info
  name TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  body_text TEXT,

  -- Variables available in this template
  variables TEXT[], -- e.g., ['customer_name', 'invoice_number', 'amount']

  -- Status
  is_active BOOLEAN DEFAULT true
);

-- ============================================
-- EMAIL LOG (Gesendete E-Mails)
-- ============================================

CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sent_at TIMESTAMPTZ DEFAULT NOW(),

  -- Recipient
  to_email TEXT NOT NULL,
  to_name TEXT,

  -- Related entities
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,

  -- Email content
  template_name TEXT,
  subject TEXT NOT NULL,
  body_preview TEXT,

  -- Status
  status TEXT DEFAULT 'sent', -- sent, delivered, bounced, failed
  error_message TEXT,

  -- Resend tracking
  resend_id TEXT
);

-- ============================================
-- PAYMENT REMINDERS (Zahlungserinnerungen)
-- ============================================

CREATE TABLE IF NOT EXISTS payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,

  -- Reminder level (1st, 2nd, 3rd...)
  reminder_level INTEGER DEFAULT 1,

  -- Sent info
  sent_at TIMESTAMPTZ,
  email_log_id UUID REFERENCES email_log(id),

  -- Next reminder scheduled
  next_reminder_date DATE
);

-- ============================================
-- SEQUENCE FOR INVOICE NUMBERS
-- ============================================

CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1;

-- Function to generate invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  seq_num INTEGER;
BEGIN
  year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
  seq_num := nextval('invoice_number_seq');
  RETURN 'JN-' || year || '-' || LPAD(seq_num::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_date ON invoices(invoice_date DESC);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON invoice_items(invoice_id);

CREATE INDEX IF NOT EXISTS idx_crm_activities_company_id ON crm_activities(company_id);
CREATE INDEX IF NOT EXISTS idx_crm_activities_created_at ON crm_activities(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_crm_notes_company_id ON crm_notes(company_id);

CREATE INDEX IF NOT EXISTS idx_email_log_company_id ON email_log(company_id);
CREATE INDEX IF NOT EXISTS idx_email_log_sent_at ON email_log(sent_at DESC);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at for invoices
CREATE OR REPLACE FUNCTION update_invoice_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION update_invoice_updated_at();

-- Auto-create CRM activity when invoice is created
CREATE OR REPLACE FUNCTION log_invoice_activity()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO crm_activities (company_id, invoice_id, activity_type, title, description, performed_by)
  VALUES (
    NEW.company_id,
    NEW.id,
    'invoice_created',
    'Rechnung erstellt',
    'Rechnung ' || NEW.invoice_number || ' über ' || (NEW.total_cents / 100.0)::TEXT || ' EUR erstellt',
    'system'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_invoice_creation
  AFTER INSERT ON invoices
  FOR EACH ROW EXECUTE FUNCTION log_invoice_activity();

-- Auto-create activity when payment received
CREATE OR REPLACE FUNCTION log_payment_activity()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status != 'paid' AND NEW.status = 'paid' THEN
    INSERT INTO crm_activities (company_id, invoice_id, activity_type, title, description, performed_by)
    VALUES (
      NEW.company_id,
      NEW.id,
      'payment_received',
      'Zahlung erhalten',
      'Zahlung für Rechnung ' || NEW.invoice_number || ' erhalten',
      'system'
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_payment
  AFTER UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION log_payment_activity();

-- ============================================
-- DEFAULT EMAIL TEMPLATES
-- ============================================

INSERT INTO email_templates (name, subject, body_html, variables) VALUES
(
  'invoice_new',
  'Ihre Rechnung {{invoice_number}} von JobNachbar',
  '<h2>Hallo {{customer_name}},</h2>
<p>vielen Dank für Ihre Bestellung bei JobNachbar!</p>
<p>Im Anhang finden Sie Ihre Rechnung <strong>{{invoice_number}}</strong> über <strong>{{amount}}</strong>.</p>
<p><strong>Zahlungsziel:</strong> {{due_date}}</p>
<p><strong>Bankverbindung:</strong><br>
IBAN: DE89 3704 0044 0532 0130 00<br>
BIC: COBADEFFXXX<br>
Verwendungszweck: {{invoice_number}}</p>
<p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
<p>Mit freundlichen Grüßen,<br>Ihr JobNachbar Team</p>',
  ARRAY['customer_name', 'invoice_number', 'amount', 'due_date']
),
(
  'invoice_reminder_1',
  'Zahlungserinnerung: Rechnung {{invoice_number}}',
  '<h2>Hallo {{customer_name}},</h2>
<p>wir möchten Sie freundlich daran erinnern, dass die Rechnung <strong>{{invoice_number}}</strong> über <strong>{{amount}}</strong> noch offen ist.</p>
<p><strong>Fälligkeitsdatum:</strong> {{due_date}}</p>
<p>Falls Sie die Zahlung bereits veranlasst haben, betrachten Sie diese E-Mail bitte als gegenstandslos.</p>
<p>Mit freundlichen Grüßen,<br>Ihr JobNachbar Team</p>',
  ARRAY['customer_name', 'invoice_number', 'amount', 'due_date']
),
(
  'invoice_reminder_2',
  'Zweite Mahnung: Rechnung {{invoice_number}}',
  '<h2>Hallo {{customer_name}},</h2>
<p>leider konnten wir bisher keinen Zahlungseingang für die Rechnung <strong>{{invoice_number}}</strong> über <strong>{{amount}}</strong> feststellen.</p>
<p>Bitte überweisen Sie den Betrag innerhalb der nächsten 7 Tage, um weitere Mahngebühren zu vermeiden.</p>
<p>Mit freundlichen Grüßen,<br>Ihr JobNachbar Team</p>',
  ARRAY['customer_name', 'invoice_number', 'amount', 'due_date']
),
(
  'subscription_welcome',
  'Willkommen bei JobNachbar Premium!',
  '<h2>Hallo {{customer_name}},</h2>
<p>herzlichen Glückwunsch! Ihr Premium-Abo ist jetzt aktiv.</p>
<p><strong>Abo-Details:</strong><br>
Plan: {{plan_name}}<br>
Laufzeit: {{duration}}<br>
Gültig bis: {{end_date}}</p>
<p>Sie können jetzt alle Premium-Features nutzen:</p>
<ul>
<li>Unbegrenzte Stellenanzeigen</li>
<li>Bewerbungen direkt einsehen</li>
<li>Premium-Support</li>
</ul>
<p>Viel Erfolg bei der Mitarbeitersuche!</p>
<p>Ihr JobNachbar Team</p>',
  ARRAY['customer_name', 'plan_name', 'duration', 'end_date']
),
(
  'subscription_expiring',
  'Ihr JobNachbar Premium läuft bald ab',
  '<h2>Hallo {{customer_name}},</h2>
<p>Ihr Premium-Abo läuft am <strong>{{end_date}}</strong> ab.</p>
<p>Verlängern Sie jetzt, um weiterhin alle Vorteile zu nutzen:</p>
<p><a href="{{renewal_link}}" style="background-color: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Jetzt verlängern</a></p>
<p>Mit freundlichen Grüßen,<br>Ihr JobNachbar Team</p>',
  ARRAY['customer_name', 'end_date', 'renewal_link']
)
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- RLS POLICIES (Admin only)
-- ============================================

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_reminders ENABLE ROW LEVEL SECURITY;

-- For now, allow service role full access (admin APIs use service role)
-- In production, add more granular policies

CREATE POLICY "Service role full access to invoices" ON invoices
  FOR ALL USING (true);

CREATE POLICY "Service role full access to invoice_items" ON invoice_items
  FOR ALL USING (true);

CREATE POLICY "Service role full access to crm_activities" ON crm_activities
  FOR ALL USING (true);

CREATE POLICY "Service role full access to crm_notes" ON crm_notes
  FOR ALL USING (true);

CREATE POLICY "Service role full access to email_templates" ON email_templates
  FOR ALL USING (true);

CREATE POLICY "Service role full access to email_log" ON email_log
  FOR ALL USING (true);

CREATE POLICY "Service role full access to payment_reminders" ON payment_reminders
  FOR ALL USING (true);
