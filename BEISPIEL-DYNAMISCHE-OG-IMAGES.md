# Beispiel: Dynamische OG-Images für Job-Detailseiten

## Implementierung in /src/app/jobs/[id]/page.tsx

### 1. Metadata generieren

Füge diese Funktion OBERHALB der `JobDetailPage` Komponente ein:

```tsx
import { Metadata } from 'next'

// ... bestehende Imports ...

// Dynamische Metadata für OG-Images
export async function generateMetadata({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> {
  const job = await getJob(params.id)

  if (!job) {
    return {
      title: 'Job nicht gefunden',
    }
  }

  const title = job.title
  const subtitle = `${EMPLOYMENT_TYPES[job.employment_type] || job.employment_type} in ${job.city || 'der Nähe'}`
  const description = job.short_description || job.description?.substring(0, 160) || ''

  return {
    title: `${title} - ${subtitle}`,
    description,
    openGraph: {
      title,
      description,
      url: `https://www.jobnachbar.com/jobs/${params.id}`,
      type: 'article',
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`,
          width: 1200,
          height: 630,
          alt: `${title} - JobNachbar`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`],
    },
  }
}

// Deine bestehende JobDetailPage Komponente bleibt unverändert
export default async function JobDetailPage({ params }: { params: { id: string } }) {
  // ... bestehender Code ...
}
```

## Beispiel-Ausgaben

### Vollzeit Job
```
Title: "Verkäufer (m/w/d)"
Subtitle: "Vollzeit in Zeven"
URL: /api/og?title=Verkäufer%20(m%2Fw%2Fd)&subtitle=Vollzeit%20in%20Zeven
```

### Minijob
```
Title: "Aushilfe im Einzelhandel"
Subtitle: "Minijob in Rotenburg"
URL: /api/og?title=Aushilfe%20im%20Einzelhandel&subtitle=Minijob%20in%20Rotenburg
```

### Ausbildung
```
Title: "Ausbildung zum Mechatroniker"
Subtitle: "Ausbildung in Sittensen"
URL: /api/og?title=Ausbildung%20zum%20Mechatroniker&subtitle=Ausbildung%20in%20Sittensen
```

## Weitere Seiten

### Standort-Seiten (/jobs/zeven/page.tsx)

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Jobs in Zeven',
  openGraph: {
    images: ['/api/og?title=Jobs%20in%20Zeven&subtitle=Alle%20aktuellen%20Stellenangebote'],
  },
}
```

### Branchen-Seiten

```tsx
export const metadata: Metadata = {
  title: 'Handwerk Jobs',
  openGraph: {
    images: ['/api/og?title=Handwerk%20Jobs&subtitle=Finde%20deinen%20Job%20im%20Handwerk'],
  },
}
```

## Advanced: Mehrsprachige OG-Images

Falls du später Englisch oder andere Sprachen unterstützt:

```tsx
export async function generateMetadata({
  params,
}: {
  params: { id: string; locale?: string }
}): Promise<Metadata> {
  const job = await getJob(params.id)
  const locale = params.locale || 'de'

  const titles = {
    de: job.title,
    en: job.title_en || job.title,
  }

  const subtitles = {
    de: `${EMPLOYMENT_TYPES[job.employment_type]} in ${job.city}`,
    en: `${job.employment_type} in ${job.city}`,
  }

  return {
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(titles[locale])}&subtitle=${encodeURIComponent(subtitles[locale])}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}
```

## Testing

### Lokal testen
```bash
npm run dev
```

Öffne dann:
```
http://localhost:3000/jobs/[job-id]
```

Prüfe die OG-Image URL in:
- Browser DevTools > Elements > `<meta property="og:image">`
- Oder direkt: `http://localhost:3000/api/og?title=Test&subtitle=Test`

### Production Testing

1. **Facebook Debugger**
   ```
   https://developers.facebook.com/tools/debug/
   ```
   Eingeben: `https://jobnachbar.com/jobs/[job-id]`

2. **Twitter Card Validator**
   ```
   https://cards-dev.twitter.com/validator
   ```

3. **LinkedIn Inspector**
   ```
   https://www.linkedin.com/post-inspector/
   ```

## Performance-Tipps

### 1. Caching
Next.js cached automatisch die generierten Images. Für bessere Performance:

```tsx
// In /src/app/api/og/route.tsx
export const revalidate = 3600 // Cache für 1 Stunde
```

### 2. Fallback für alte Jobs
Wenn ein Job-Titel zu lang ist:

```tsx
const maxLength = 50
const truncatedTitle = job.title.length > maxLength
  ? job.title.substring(0, maxLength) + '...'
  : job.title
```

### 3. Error Handling
Falls die API fehlschlägt, verwende Fallback:

```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  try {
    const job = await getJob(params.id)
    // ... OG-Image generieren
  } catch (error) {
    return {
      openGraph: {
        images: ['/og-image.svg'], // Fallback zum statischen SVG
      },
    }
  }
}
```

## Checkliste

- [ ] `generateMetadata` in Job-Detailseite hinzugefügt
- [ ] Lokaler Test erfolgreich
- [ ] Production deployed
- [ ] Facebook Debugger getestet
- [ ] Twitter Card Validator getestet
- [ ] LinkedIn Inspector getestet
- [ ] Mobile Preview geprüft
- [ ] Cache funktioniert korrekt

## Nächste Schritte

1. Implementiere für alle relevanten Seiten
2. Überwache Performance (Next.js Analytics)
3. A/B Testing verschiedener Designs
4. Analytics: Tracking von Social Shares

## Support

Dokumentation:
- `/OG-IMAGE-README.md` - Hauptdokumentation
- `/BEISPIEL-DYNAMISCHE-OG-IMAGES.md` - Diese Datei
- `/src/app/api/og/route.tsx` - API Implementation
