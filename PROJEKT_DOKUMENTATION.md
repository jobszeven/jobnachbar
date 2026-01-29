# JobNachbar - Projekt Dokumentation

## Projektübersicht

**JobNachbar** ist ein regionales Jobportal für Zeven und Umgebung (Deutschland), das Arbeitssuchende mit lokalen Arbeitgebern verbindet. Die Plattform bietet innovative KI-gestützte Bewerbungstools und unterstützt mehrere Sprachen.

### Technologie-Stack

- **Framework:** Next.js 14 (App Router)
- **Sprache:** TypeScript
- **Styling:** Tailwind CSS
- **Authentifizierung:** Supabase Auth
- **Datenbank:** Supabase (PostgreSQL)
- **KI-Integration:** Google Gemini API
- **Internationalisierung:** next-intl (5 Sprachen)
- **PDF-Verarbeitung:** pdf-parse v2.4.5
- **Payment:** Stripe Integration
- **E-Mail:** Resend API
- **PWA:** Progressive Web App Support

---

## Struktur

```
src/
├── app/                    # Next.js App Router Seiten
│   ├── api/               # API Routes
│   │   ├── ai/            # KI-Tools APIs
│   │   │   ├── analyze-resume/
│   │   │   ├── generate-cover-letter/
│   │   │   ├── interview-prep/
│   │   │   └── salary-negotiation/
│   │   ├── extract-text/  # PDF Text-Extraktion
│   │   └── jobs/          # Job-Management
│   ├── bewerbungstipps/   # Bewerbungstipps-Seiten
│   ├── branchen/          # Branchen-Übersicht
│   ├── fuer-arbeitgeber/  # Arbeitgeber-Seiten
│   ├── jobs/              # Jobsuche
│   ├── preise/            # Preise & Pakete
│   ├── tools/             # KI-Tools Übersicht
│   └── ueber-uns/         # Über uns
├── components/            # React Komponenten
├── i18n/                  # Internationalisierung
│   └── messages/          # Übersetzungsdateien
│       ├── de.json        # Deutsch (Standard)
│       ├── en.json        # Englisch
│       ├── tr.json        # Türkisch
│       ├── pl.json        # Polnisch
│       └── uk.json        # Ukrainisch
├── lib/                   # Hilfsfunktionen
└── types/                 # TypeScript Typen
```

---

## KI-Tools

### Übersicht

JobNachbar bietet 4 KI-gestützte Tools für Bewerber:

1. **Lebenslauf-Check** (`/tools/lebenslauf-check`)
   - PDF-Upload und Analyse
   - Detailliertes Feedback zu Stärken und Verbesserungsvorschlägen
   - API: `/api/ai/analyze-resume`

2. **Anschreiben-Generator** (`/tools/anschreiben`)
   - Generiert personalisierte Anschreiben
   - Basierend auf Lebenslauf und Stellenbeschreibung
   - API: `/api/ai/generate-cover-letter`

3. **Interview-Coach** (`/tools/interview-coach`)
   - Simuliert Vorstellungsgespräche
   - Branchenspezifische Fragen
   - API: `/api/ai/interview-prep`

4. **Gehaltsverhandlung** (`/tools/gehaltsverhandlung`)
   - Strategien und Tipps
   - Marktdatenbasierte Empfehlungen
   - API: `/api/ai/salary-negotiation`

### Nutzungslimits

- **Eingeloggte Benutzer:** Unbegrenzte Nutzung
- **Anonyme Benutzer:** 1 kostenlose Nutzung pro Tool pro 24 Stunden (IP-basiert)

### Technische Details

Die KI-Tools nutzen die Google Gemini API (`gemini-1.5-flash` Modell). Die PDF-Textextraktion erfolgt über die `pdf-parse` Bibliothek mit klassenbasierter API:

```typescript
import { PDFParse } from 'pdf-parse'

const parser = new PDFParse({ data: uint8Array })
const textResult = await parser.getText()
await parser.destroy()
```

---

## Internationalisierung (i18n)

### Unterstützte Sprachen

| Code | Sprache    | Status |
|------|------------|--------|
| de   | Deutsch    | ✅ Vollständig |
| en   | Englisch   | ✅ Vollständig |
| tr   | Türkisch   | ✅ Vollständig |
| pl   | Polnisch   | ✅ Vollständig |
| uk   | Ukrainisch | ✅ Vollständig |

### Implementierung

**Client Components:**
```typescript
import { useTranslations } from 'next-intl'

export default function Component() {
  const t = useTranslations('namespace')
  return <h1>{t('title')}</h1>
}
```

**Server Components:**
```typescript
import { getTranslations } from 'next-intl/server'

export default async function Page() {
  const t = await getTranslations('namespace')
  return <h1>{t('title')}</h1>
}
```

### Übersetzungs-Namespaces

- `nav` - Navigation
- `home` - Homepage
- `jobsPage` - Jobsuche
- `forEmployersPage` - Für Arbeitgeber
- `forApplicantsPage` - Für Bewerber
- `pricingPage` - Preise
- `testimonials` - Kundenstimmen
- `aboutPage` - Über uns
- `applicationTips` - Bewerbungstipps
- `industriesPage` - Branchen
- `resumeCheck` - Lebenslauf-Check
- `tools` - KI-Tools Übersicht
- `login` - Anmeldeseite
- `register` - Registrierung
- `premium` - Premium-Seite
- `legal` - Impressum
- `privacy` - Datenschutz
- `terms` - AGB
- `appInstall` - App-Installation (PWA)
- `appBanner` - Mobile App Banner
- `cookies` - Cookie Banner
- `footer` - Footer
- `common` - Gemeinsame Texte

---

## Datenbank

### Tabellen

**jobs** - Stellenanzeigen
- id, title, company, location, description, requirements
- salary_min, salary_max, employment_type, industry
- created_at, expires_at, user_id

**profiles** - Benutzerprofile
- id, email, full_name, company_name, user_type
- created_at, updated_at

**anonymous_usage** - Anonyme Tool-Nutzung
- id, ip_address, tool_name, used_at
- Für Rate-Limiting der KI-Tools

### Migration für anonyme Nutzung

```sql
-- database/migrations/002_anonymous_usage.sql
CREATE TABLE IF NOT EXISTS anonymous_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_anonymous_usage_ip_tool
  ON anonymous_usage(ip_address, tool_name);

CREATE INDEX idx_anonymous_usage_used_at
  ON anonymous_usage(used_at);
```

---

## Umgebungsvariablen

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Google Gemini AI
GOOGLE_GEMINI_API_KEY=xxx

# App
NEXT_PUBLIC_APP_URL=https://jobnachbar.de
```

---

## Seiten-Übersicht

### Öffentliche Seiten

| Pfad | Beschreibung | i18n |
|------|--------------|------|
| `/` | Homepage | ✅ |
| `/jobs` | Jobsuche | ✅ |
| `/jobs/[id]` | Job-Details | ✅ |
| `/fuer-arbeitgeber` | Für Arbeitgeber | ✅ |
| `/fuer-bewerber` | Für Bewerber | ✅ |
| `/preise` | Preise & Pakete | ✅ |
| `/ueber-uns` | Über uns | ✅ |
| `/branchen` | Branchen-Übersicht | ✅ |
| `/bewerbungstipps` | Bewerbungstipps | ✅ |
| `/bewerbungstipps/anschreiben` | Anschreiben-Tipps | ✅ |
| `/bewerbungstipps/gehalt` | Gehalts-Tipps | ✅ |
| `/bewerbungstipps/vorstellungsgespraech` | Interview-Tipps | ✅ |

### KI-Tools

| Pfad | Beschreibung | i18n |
|------|--------------|------|
| `/tools` | KI-Tools Übersicht | ✅ |
| `/tools/lebenslauf-check` | Lebenslauf-Analyse | ✅ |
| `/tools/anschreiben` | Anschreiben-Generator | ✅ |
| `/tools/interview-coach` | Interview-Vorbereitung | ✅ |
| `/tools/gehaltsverhandlung` | Gehaltsverhandlung | ✅ |

### Rechtliche Seiten

| Pfad | Beschreibung | i18n |
|------|--------------|------|
| `/impressum` | Impressum | ✅ |
| `/datenschutz` | Datenschutzerklärung | ✅ |
| `/agb` | Allgemeine Geschäftsbedingungen | ✅ |

### Premium & Registrierung

| Pfad | Beschreibung | i18n |
|------|--------------|------|
| `/premium` | Premium-Mitgliedschaft | ✅ |
| `/login` | Anmeldung | ✅ |
| `/registrieren` | Registrierungs-Auswahl | ✅ |
| `/registrieren/bewerber` | Bewerber-Registrierung | ✅ |
| `/registrieren/arbeitgeber` | Arbeitgeber-Registrierung | ✅ |
| `/app-installieren` | PWA-Installation | ✅ |

### Authentifizierte Seiten

| Pfad | Beschreibung |
|------|--------------|
| `/dashboard/arbeitgeber` | Arbeitgeber-Dashboard |
| `/dashboard/bewerber` | Bewerber-Dashboard |
| `/dashboard/arbeitgeber/stelle-erstellen` | Neue Stelle erstellen |
| `/dashboard/arbeitgeber/bewerbungen` | Bewerbungen verwalten |
| `/dashboard/bewerber/favoriten` | Gemerkte Jobs |
| `/dashboard/bewerber/profil` | Profil bearbeiten |

---

## Deployment

### Build

```bash
npm run build
```

### Entwicklung

```bash
npm run dev
```

### Produktions-Checklist

- [ ] Umgebungsvariablen in Vercel/Hosting setzen
- [ ] Supabase-Tabellen erstellen (inkl. anonymous_usage)
- [ ] Google Gemini API-Key aktivieren
- [ ] Domain konfigurieren
- [ ] SSL-Zertifikat aktiv
- [ ] Meta-Tags und OG-Images prüfen

---

## Progressive Web App (PWA)

### App-Installation

JobNachbar ist als PWA installierbar. Die Installations-Seite `/app-installieren` bietet:

- **Geräte-Erkennung:** Automatische Erkennung von iOS, Android, Desktop
- **Plattform-spezifische Anleitungen:** 3 Schritte pro Plattform
- **Vorteile-Sektion:** Schnell, Offline, Push-Benachrichtigungen, Homescreen

### Mobile App Banner

Component: `src/components/MobileAppBanner.tsx`

- Zeigt sich nur auf Mobilgeräten
- Prüft ob PWA bereits installiert ist
- Dismissable mit 7-Tage Cookie (`jobnachbar_app_banner_dismissed`)

---

## Cookie & GDPR Compliance

### Cookie Banner

Component: `src/components/CookieBanner.tsx`

Kategorien:
- **Notwendig:** Immer aktiv (Session, Auth)
- **Funktional:** Spracheinstellungen
- **Statistik:** Google Analytics
- **Marketing:** Meta Pixel

### Consent-Speicherung

```javascript
// localStorage
const consent = {
  necessary: true,
  functional: boolean,
  analytics: boolean,
  marketing: boolean,
  timestamp: number
}
```

### Tracking-Integration

```env
# .env.local
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX
```

Scripts werden nur bei Zustimmung geladen:
- Google Analytics: `consent.analytics === true`
- Meta Pixel: `consent.marketing === true`

### Cookie-Einstellungen ändern

Footer-Link ruft `openCookieSettings()` auf:
```typescript
import { openCookieSettings } from '@/components/CookieBanner'
```

---

## Benutzerrollen

### Übersicht der Rollen

| Rolle | Beschreibung | Zugang |
|-------|--------------|--------|
| **Bewerber** (jobseeker) | Arbeitssuchende, die sich auf Stellen bewerben | `/dashboard/bewerber` |
| **Arbeitgeber** (employer) | Unternehmen, die Stellen ausschreiben | `/dashboard/arbeitgeber` |
| **Admin** | Systemadministratoren mit vollem Zugriff | `/admin` |

### Benutzer-Felder in Supabase

```sql
-- users Tabelle
id UUID PRIMARY KEY
auth_id UUID (Referenz zu auth.users)
email TEXT
user_type TEXT ('jobseeker' | 'employer')
is_admin BOOLEAN DEFAULT false
is_premium BOOLEAN DEFAULT false
```

### Admin-Zugang einrichten

1. **User registrieren** über `/registrieren`
2. **In Supabase** die `users` Tabelle öffnen
3. **Benutzer finden** und `is_admin` auf `true` setzen

```sql
UPDATE users SET is_admin = true WHERE email = 'admin@example.com';
```

4. **Einloggen** unter `/login`
5. **Admin-Dashboard** aufrufen unter `/admin`

---

## CRM & Admin

### Admin Dashboard

Pfad: `/admin`

**Voraussetzung:** Benutzer muss `is_admin = true` in der Datenbank haben.

**Verfügbare Admin-Routen:**

| Pfad | Beschreibung |
|------|--------------|
| `/admin` | Haupt-Dashboard mit Statistiken |
| `/admin/crm` | CRM-System für Kundenmanagement |
| `/admin/crm/companies/[id]` | Einzelne Firma verwalten |
| `/admin/crm/invoices` | Rechnungsverwaltung |
| `/admin/subscriptions` | Abonnements verwalten |
| `/admin/abo-anfragen` | Neue Abo-Anfragen bearbeiten |
| `/admin/einstellungen` | Admin-Einstellungen |

### Admin-Funktionen

- **Statistiken:** Benutzer, Jobs, Bewerbungen, Umsatz
- **CRM:** Firmen verwalten, Notizen hinzufügen, Kontakthistorie
- **Rechnungen:** Erstellen, versenden, Status verfolgen
- **Subscriptions:** Genehmigen, aktivieren, kündigen

---

## Stripe Integration

### Erforderliche Umgebungsvariablen

```env
# Stripe Payment
# Aus dem Stripe Dashboard: https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY=sk_live_xxxxx          # oder sk_test_xxxxx für Testmodus
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx     # oder pk_test_xxxxx für Testmodus

# Webhook Secret aus: https://dashboard.stripe.com/webhooks
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Stripe Webhook einrichten

1. **Stripe Dashboard** öffnen → Developers → Webhooks
2. **Endpoint hinzufügen:** `https://jobnachbar.de/api/stripe/webhook`
3. **Events auswählen:**
   - `checkout.session.completed`
   - `invoice.paid`
   - `payment_intent.succeeded`
4. **Webhook Secret** kopieren und in `.env.local` eintragen

### Zahlungsablauf

1. Nutzer wählt Abo-Paket auf `/preise`
2. Klick auf "Jetzt kaufen" → Stripe Checkout Session
3. Bezahlung über Stripe (Karte oder SEPA)
4. Webhook empfängt `checkout.session.completed`
5. Automatische Aktivierung des Abos in der Datenbank
6. Bestätigungs-Email an den Kunden

### Preise (in Cent)

| Paket | 1 Monat | 3 Monate | 6 Monate |
|-------|---------|----------|----------|
| Basic | 49,00 € | 139,00 € | 249,00 € |
| Premium | 99,00 € | 279,00 € | 549,00 € |

---

## Umgebungsvariablen (Erweitert)

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Google Gemini AI
GEMINI_API_KEY=xxx

# Stripe
STRIPE_SECRET_KEY=xxx
STRIPE_WEBHOOK_SECRET=xxx

# Resend (E-Mail)
RESEND_API_KEY=xxx

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=xxx
NEXT_PUBLIC_META_PIXEL_ID=xxx

# App
NEXT_PUBLIC_SITE_URL=https://jobnachbar.com
```

---

## Kontakt & Support

**JobNachbar** - Regionales Jobportal für Zeven und Umgebung

Website: [jobnachbar.de](https://jobnachbar.de)

---

*Dokumentation aktualisiert: Januar 2026*
