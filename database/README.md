# JobNachbar Database Setup

Diese Anleitung erklärt, wie du die Datenbank für JobNachbar in Supabase einrichtest.

## Voraussetzungen

1. Ein Supabase-Projekt (erstelle eins unter https://supabase.com)
2. Die Projekt-URL und den Anon-Key (findest du unter Settings > API)

## Setup-Schritte

### 1. Umgebungsvariablen konfigurieren

Erstelle eine `.env.local` Datei im Root-Verzeichnis:

```env
NEXT_PUBLIC_SUPABASE_URL=https://dein-projekt.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
SUPABASE_SERVICE_ROLE_KEY=dein-service-role-key

# Google AI (Gemini) für KI-Features
GOOGLE_GENERATIVE_AI_API_KEY=dein-gemini-api-key
```

### 2. Basis-Schema erstellen

1. Gehe zu deinem Supabase Dashboard
2. Navigiere zu **SQL Editor**
3. Kopiere den Inhalt von `schema.sql` und führe ihn aus
4. Führe dann `migrations/001_extended_schema.sql` aus

### 3. Storage Bucket einrichten

1. Gehe zu **Storage** in Supabase
2. Erstelle einen neuen Bucket namens `uploads`
3. Setze die Bucket-Policy auf "Public" (für Profilbilder und Lebensläufe)

### 4. Admin-Benutzer erstellen

Nach der Registrierung eines normalen Benutzers, kannst du ihn zum Admin machen:

```sql
-- Ersetze 'admin@email.de' mit der E-Mail des Admin-Benutzers
UPDATE users
SET is_admin = true
WHERE email = 'admin@email.de';
```

### 5. RLS (Row Level Security) Policies

Die Policies sind bereits im Schema definiert. Stelle sicher, dass RLS für alle Tabellen aktiviert ist:

```sql
-- Überprüfe, ob RLS aktiviert ist
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

## Tabellen-Übersicht

| Tabelle | Beschreibung |
|---------|--------------|
| `users` | Bewerber-Profile |
| `companies` | Arbeitgeber-Profile |
| `jobs` | Stellenanzeigen |
| `applications` | Bewerbungen |
| `matches` | Automatisches Job-Matching |
| `subscriptions` | Abo-Verwaltung |
| `feedback` | Benutzer-Feedback |
| `subscription_requests` | Abo-Anfragen |

## AI-Usage Tracking

Die `users`-Tabelle enthält Felder zum Tracking der KI-Tool-Nutzung:

- `ai_resume_checks_used` - Lebenslauf-Checks
- `ai_cover_letters_used` - Anschreiben generiert
- `ai_interview_preps_used` - Interview-Coaching Sessions
- `ai_salary_tips_used` - Gehaltsverhandlungs-Tipps

Free-Nutzer haben ein Limit von 3 Nutzungen pro Monat pro Tool.

## Troubleshooting

### "Feedback konnte nicht gespeichert werden"

Führe die Migration `001_extended_schema.sql` aus, um die `feedback`-Tabelle zu erstellen:

```sql
CREATE TABLE IF NOT EXISTS feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  user_id UUID REFERENCES users(id),
  category TEXT NOT NULL,
  message TEXT NOT NULL,
  email TEXT,
  rating INTEGER,
  page_url TEXT,
  user_agent TEXT,
  status TEXT DEFAULT 'new'
);
```

### "Permission denied" Fehler

Stelle sicher, dass die RLS Policies korrekt sind:

```sql
-- Beispiel: Erlaube allen Benutzern, Feedback zu erstellen
CREATE POLICY "Anyone can create feedback" ON feedback
  FOR INSERT WITH CHECK (true);

-- Nur Admins können Feedback lesen
CREATE POLICY "Admins can read feedback" ON feedback
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE auth_id = auth.uid() AND is_admin = true)
  );
```

## Nützliche Queries

### Alle aktiven Jobs anzeigen

```sql
SELECT j.*, c.company_name
FROM jobs j
JOIN companies c ON j.company_id = c.id
WHERE j.status = 'active'
ORDER BY j.created_at DESC;
```

### Bewerber-Statistiken

```sql
SELECT
  COUNT(*) as total_users,
  COUNT(*) FILTER (WHERE is_premium) as premium_users,
  COUNT(*) FILTER (WHERE status = 'active') as active_users
FROM users;
```

### Bewerbungen pro Job

```sql
SELECT
  j.title,
  c.company_name,
  COUNT(a.id) as application_count
FROM jobs j
JOIN companies c ON j.company_id = c.id
LEFT JOIN applications a ON j.id = a.job_id
GROUP BY j.id, j.title, c.company_name
ORDER BY application_count DESC;
```
