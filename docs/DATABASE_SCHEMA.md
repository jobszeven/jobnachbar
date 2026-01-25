# JobNachbar.com – Datenbank-Schema

## Übersicht

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│  BEWERBER   │       │    JOBS     │       │ UNTERNEHMEN │
│  (users)    │       │   (jobs)    │       │ (companies) │
└──────┬──────┘       └──────┬──────┘       └──────┬──────┘
       │                     │                     │
       │    ┌────────────────┴────────────────┐    │
       │    │                                 │    │
       ▼    ▼                                 ▼    ▼
┌─────────────────┐                   ┌─────────────────┐
│   BEWERBUNGEN   │                   │      ABOS       │
│ (applications)  │                   │ (subscriptions) │
└─────────────────┘                   └─────────────────┘
```

---

## Tabellen

### 1. `users` (Bewerber)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Primärschlüssel |
| created_at | TIMESTAMP | Registrierungsdatum |
| email | TEXT | E-Mail (unique) |
| password_hash | TEXT | Verschlüsseltes Passwort |
| first_name | TEXT | Vorname |
| last_name | TEXT | Nachname |
| phone | TEXT | Telefonnummer |
| zip_code | TEXT | PLZ |
| city | TEXT | Wohnort |
| radius_km | INT | Suchradius in km (default: 30) |
| birthdate | DATE | Geburtsdatum |
| job_title_wanted | TEXT | Gewünschter Job / Berufsbezeichnung |
| experience_years | INT | Berufserfahrung in Jahren |
| qualifications | TEXT[] | Qualifikationen (Array) |
| industries | TEXT[] | Branchen (Array) |
| employment_type | TEXT[] | Vollzeit/Teilzeit/Minijob/Ausbildung |
| available_from | DATE | Verfügbar ab |
| salary_expectation | TEXT | Gehaltsvorstellung |
| about_me | TEXT | Freitext: Über mich |
| cv_url | TEXT | Link zum Lebenslauf (optional) |
| status | TEXT | active / inactive / hired |
| email_notifications | BOOLEAN | Job-Alerts per E-Mail? |
| whatsapp_notifications | BOOLEAN | Job-Alerts per WhatsApp? |

---

### 2. `companies` (Unternehmen)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Primärschlüssel |
| created_at | TIMESTAMP | Registrierungsdatum |
| email | TEXT | E-Mail (unique) |
| password_hash | TEXT | Verschlüsseltes Passwort |
| company_name | TEXT | Firmenname |
| contact_person | TEXT | Ansprechpartner |
| phone | TEXT | Telefonnummer |
| street | TEXT | Straße + Hausnummer |
| zip_code | TEXT | PLZ |
| city | TEXT | Ort |
| website | TEXT | Website (optional) |
| industry | TEXT | Branche |
| company_size | TEXT | 1-10 / 11-50 / 51-200 / 200+ |
| logo_url | TEXT | Logo (optional) |
| about_company | TEXT | Über das Unternehmen |
| verified | BOOLEAN | Verifiziert durch Admin |
| subscription_tier | TEXT | free / basic / premium |
| subscription_expires | DATE | Abo gültig bis |

---

### 3. `jobs` (Stellenanzeigen)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Primärschlüssel |
| created_at | TIMESTAMP | Erstellungsdatum |
| company_id | UUID | FK → companies |
| title | TEXT | Jobtitel |
| description | TEXT | Beschreibung |
| requirements | TEXT | Anforderungen |
| benefits | TEXT | Was wir bieten |
| industry | TEXT | Branche |
| employment_type | TEXT | Vollzeit/Teilzeit/Minijob/Ausbildung |
| zip_code | TEXT | PLZ des Arbeitsorts |
| city | TEXT | Arbeitsort |
| salary_min | INT | Gehalt von (optional) |
| salary_max | INT | Gehalt bis (optional) |
| salary_type | TEXT | hourly / monthly / yearly |
| start_date | DATE | Startdatum |
| application_deadline | DATE | Bewerbungsfrist (optional) |
| status | TEXT | active / paused / filled / expired |
| views | INT | Anzahl Aufrufe |
| is_boosted | BOOLEAN | Premium-Platzierung? |
| boosted_until | DATE | Boost gültig bis |

---

### 4. `applications` (Bewerbungen)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Primärschlüssel |
| created_at | TIMESTAMP | Bewerbungsdatum |
| user_id | UUID | FK → users |
| job_id | UUID | FK → jobs |
| company_id | UUID | FK → companies |
| status | TEXT | new / viewed / accepted / rejected |
| cover_letter | TEXT | Anschreiben (optional) |
| is_paid | BOOLEAN | Hat Unternehmen bezahlt? |
| paid_at | TIMESTAMP | Zahlungsdatum |
| price_paid | DECIMAL | Gezahlter Betrag |

---

### 5. `subscriptions` (Abonnements)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Primärschlüssel |
| created_at | TIMESTAMP | Abschluss-Datum |
| company_id | UUID | FK → companies |
| tier | TEXT | basic / premium |
| price_monthly | DECIMAL | Monatlicher Preis |
| started_at | DATE | Abo-Start |
| expires_at | DATE | Abo-Ende |
| status | TEXT | active / cancelled / expired |
| invoices_sent | INT | Anzahl versendeter Rechnungen |

---

### 6. `matches` (Automatisches Matching)

| Feld | Typ | Beschreibung |
|------|-----|--------------|
| id | UUID | Primärschlüssel |
| created_at | TIMESTAMP | Match-Datum |
| user_id | UUID | FK → users |
| job_id | UUID | FK → jobs |
| match_score | INT | Matching-Score (0-100) |
| notified | BOOLEAN | Bewerber benachrichtigt? |
| notified_at | TIMESTAMP | Benachrichtigungszeitpunkt |

---

## Branchen (Enum)

```
- Handwerk
- Pflege & Gesundheit
- Gastro & Hotel
- Einzelhandel
- Logistik & Transport
- Industrie & Produktion
- Büro & Verwaltung
- IT & Technik
- Bau & Architektur
- Landwirtschaft
- Bildung & Soziales
- Sonstiges
```

---

## Beschäftigungsarten (Enum)

```
- Vollzeit
- Teilzeit
- Minijob
- Ausbildung
- Praktikum
- Werkstudent
- Freelance
```

---

## Matching-Algorithmus (Logik)

Der Match-Score berechnet sich aus:

| Kriterium | Gewichtung |
|-----------|------------|
| Entfernung (PLZ) | 30% |
| Branche passt | 25% |
| Beschäftigungsart passt | 20% |
| Erfahrung passt | 15% |
| Gehalt passt | 10% |

**Score ≥ 70** → Automatische Benachrichtigung an Bewerber

---

## Preismodell

| Paket | Preis/Monat | Jobs | Bewerbungen | Features |
|-------|-------------|------|-------------|----------|
| Free | 0€ | 1 | 3/Monat | Basis |
| Basic | 49€ | 5 | 10/Monat | + Matching |
| Premium | 99€ | ∞ | ∞ | + Boost + WhatsApp |

**Einzelkauf:** 19€ pro Bewerbung (für Nicht-Abonnenten)
