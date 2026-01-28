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
- `pricingPage` - Preise
- `testimonials` - Kundenstimmen
- `aboutPage` - Über uns
- `applicationTips` - Bewerbungstipps
- `industriesPage` - Branchen
- `resumeCheck` - Lebenslauf-Check
- `footer` - Footer

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

### Authentifizierte Seiten

| Pfad | Beschreibung |
|------|--------------|
| `/dashboard` | Benutzer-Dashboard |
| `/dashboard/jobs` | Meine Jobs (Arbeitgeber) |
| `/dashboard/profile` | Profil bearbeiten |
| `/auth/login` | Anmeldung |
| `/auth/register` | Registrierung |

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

## Kontakt & Support

**JobNachbar** - Regionales Jobportal für Zeven und Umgebung

Website: [jobnachbar.de](https://jobnachbar.de)

---

*Dokumentation erstellt: Januar 2026*
