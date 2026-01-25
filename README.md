# JobNachbar.com

Die lokale Jobbörse für Zeven, Rotenburg (Wümme) und Umgebung.

## 🚀 Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Hosting:** Vercel
- **Domain:** Netcup

## 📦 Setup

### 1. Repository klonen

```bash
git clone https://github.com/YOUR_USERNAME/jobnachbar.git
cd jobnachbar
npm install
```

### 2. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) und erstelle ein neues Projekt
2. Warte bis das Projekt initialisiert ist
3. Gehe zu **Project Settings** → **API**
4. Kopiere die `URL` und den `anon/public` Key

### 3. Datenbank einrichten

1. In Supabase, gehe zu **SQL Editor**
2. Kopiere den Inhalt von `database/schema.sql`
3. Führe das SQL aus (klick auf "Run")

### 4. Environment Variables

1. Kopiere `.env.local.example` zu `.env.local`
2. Füge deine Supabase Credentials ein:

```bash
cp .env.local.example .env.local
```

Dann in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx...
```

### 5. Entwicklungsserver starten

```bash
npm run dev
```

Öffne [http://localhost:3000](http://localhost:3000)

## 🚀 Deployment

### Vercel (empfohlen)

1. Pushe deinen Code zu GitHub
2. Gehe zu [vercel.com](https://vercel.com)
3. Importiere dein GitHub Repository
4. Füge die Environment Variables hinzu:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Deploy!

### Custom Domain (Netcup)

1. In Vercel: Settings → Domains → Add
2. Füge `jobnachbar.com` hinzu
3. In Netcup DNS-Einstellungen:
   - A Record: `@` → Vercel IP
   - CNAME: `www` → `cname.vercel-dns.com`

## 📁 Projektstruktur

```
jobnachbar/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # Landing Page
│   │   ├── layout.tsx          # Root Layout
│   │   ├── globals.css         # Global Styles
│   │   ├── jobs/               # Job Listings
│   │   ├── registrieren/       # Registration
│   │   │   ├── bewerber/       # Job Seeker Registration
│   │   │   └── arbeitgeber/    # Employer Registration
│   │   └── dashboard/          # User Dashboards
│   ├── components/             # Reusable Components
│   └── lib/
│       └── supabase/           # Supabase Client
├── database/
│   └── schema.sql              # Database Schema
├── docs/
│   └── DATABASE_SCHEMA.md      # Schema Documentation
└── public/                     # Static Assets
```

## 💰 Preismodell

| Plan | Preis | Jobs | Bewerbungen |
|------|-------|------|-------------|
| Starter | 0€ | 1 | 3/Monat |
| Basic | 49€/Monat | 5 | 10/Monat |
| Premium | 99€/Monat | ∞ | ∞ |

Einzelne Bewerbungen: 19€

## 🔧 Nächste Schritte

- [ ] Bewerber-Registrierungsformular
- [ ] Arbeitgeber-Registrierungsformular
- [ ] Job-Listing Seite
- [ ] Dashboard für Bewerber
- [ ] Dashboard für Arbeitgeber
- [ ] Matching-Algorithmus aktivieren
- [ ] E-Mail Benachrichtigungen
- [ ] Zahlungsintegration

## 📞 Support

Bei Fragen: [deine-email@domain.de]
