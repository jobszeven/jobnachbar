# JobNachbar - Projektstatus

**Letzte Aktualisierung:** 2026-02-16
**Branch:** main

---

## Aktueller Stand: 90% fertig

### Zuletzt erledigt (16.02.2026)
- i18n komplett implementiert (DE, EN, TR, PL, UK) fuer alle Seiten
- "KI" Rebranding zu "Bewerbungstools" / "JobNachbar Features" durchgefuehrt
- Pricing-Page Fix: t.raw() fuer HTML-Translations mit dangerouslySetInnerHTML
- Auth-Flow: Email-Verifizierung, Callback, RLS-Policy-Fixes

### Offene Punkte / Naechste Schritte
1. **KRITISCH: Gemini API-Key ungueltig** - Neuen Key von https://aistudio.google.com/apikey erstellen und in .env.local eintragen
2. Tools testen sobald API-Key funktioniert (Lebenslauf-Check, Anschreiben-Generator, Interview-Coach, Gehaltsverhandlung)
3. Offline-Fallback fuer Tools wenn API nicht verfuegbar
4. PDF-Export statt .txt fuer Tool-Ergebnisse
5. Echte Gehaltsdaten statt AI-generierte Schaetzungen

### Nicht committet (Staging)
- src/app/preise/page.tsx (t.raw() Fix)
- src/app/tools/* (KI -> Bewerbungstools Rebranding)
- src/i18n/messages/* (Alle 5 Sprachen: KI-Rebranding)
- Diverse andere i18n und Auth-Aenderungen

### Tech Stack
- Next.js 14 + TypeScript + Tailwind
- Supabase (Auth + DB)
- Stripe (Payments)
- Google Gemini (AI Tools)
- Vercel (Deployment)
- next-intl (i18n: DE, EN, TR, PL, UK)

### Wichtige Dateien
| Datei | Zweck |
|-------|-------|
| src/app/preise/page.tsx | Pricing-Seite (Arbeitgeber) |
| src/app/tools/* | 4 Bewerbungstools |
| src/app/api/ai/* | AI API Routes (Gemini) |
| src/i18n/messages/*.json | Uebersetzungen |
| src/middleware.ts | Locale-Detection |
| src/lib/supabase/client.ts | Supabase Client |
