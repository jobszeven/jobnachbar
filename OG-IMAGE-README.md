# JobNachbar OG-Image System

## Übersicht

Das OG-Image System für JobNachbar bietet drei verschiedene Möglichkeiten, um professionelle Social Media Preview-Bilder zu generieren:

1. **Dynamische Next.js API** - Automatische Generierung mit Parametern
2. **Statisches SVG** - Für einfache Verwendung ohne Build
3. **HTML Generator** - Zum manuellen Erstellen von PNG-Bildern

## Branding

### Farben
- **Brand Red**: `#E63946`
- **Red Dark**: `#C62E3A`
- **Red Light**: `#FF4D5A`
- **Dark Background**: `#1D1D1F`
- **Text White**: `#F8F8F8`
- **Text Gray**: `#AEAEB2`

### Maße
- **OG-Image**: 1200x630px
- **Logo Icon**: 80x80px mit 20px border-radius
- **Font**: Inter (Sans-serif)

## 1. Dynamische Next.js API (Empfohlen)

### Location
`/src/app/api/og/route.tsx`

### Verwendung

**Standard:**
```
https://jobnachbar.com/api/og
```

**Mit Parametern:**
```
https://jobnachbar.com/api/og?title=Dein%20Titel&subtitle=Dein%20Untertitel
```

### Parameter
- `title` - Haupttitel (Standard: "JobNachbar")
- `subtitle` - Untertitel (Standard: "Jobs in deiner Nähe")

### Beispiele

**Job-Detailseite:**
```tsx
export const metadata: Metadata = {
  openGraph: {
    images: ['/api/og?title=Verkäufer%20in%20Zeven&subtitle=Vollzeit%20·%20ab%20sofort'],
  },
}
```

**Standort-Seite:**
```tsx
export const metadata: Metadata = {
  openGraph: {
    images: ['/api/og?title=Jobs%20in%20Rotenburg&subtitle=20%20offene%20Stellen'],
  },
}
```

## 2. Statisches SVG

### Location
`/public/og-image.svg`

### Verwendung
Einfach direkt in Metadata einbinden:

```tsx
export const metadata: Metadata = {
  openGraph: {
    images: ['/og-image.svg'],
  },
}
```

### Vorteile
- Keine Build-Zeit benötigt
- Sehr klein (wenige KB)
- Skalierbar
- Browser-kompatibel

## 3. HTML Generator

### Location
`/public/og-image-generator.html`

### Verwendung
1. Öffne die Datei im Browser
2. Mache einen Screenshot (genau 1200x630px)
3. Speichere als `/public/og-image.png`

### Verwendung für Screenshots

**macOS:**
```bash
# Cmd + Shift + 4, dann Leerzeichen, dann Fenster klicken
```

**Browser DevTools:**
```javascript
// Console öffnen (F12) und eingeben:
document.querySelector('.og-image').style.zoom = 1;
// Dann Screenshot machen
```

## Integration in Metadata

### Root Layout
Bereits integriert in `/src/app/layout.tsx`:

```tsx
openGraph: {
  images: [
    {
      url: '/api/og?title=Jobs%20in%20Zeven%20und%20Umgebung&subtitle=Die%20lokale%20Jobbörse%20für%20den%20Landkreis%20Rotenburg',
      width: 1200,
      height: 630,
      alt: 'JobNachbar - Lokale Jobs in Zeven und Umgebung',
    },
  ],
},
```

### Individuelle Seiten

**Beispiel für Job-Detailseite:**
```tsx
import { Metadata } from 'next'

export async function generateMetadata({ params }): Promise<Metadata> {
  const job = await getJob(params.id)

  return {
    title: job.title,
    openGraph: {
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(job.title)}&subtitle=${encodeURIComponent(job.location)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}
```

## Design-Elemente

### Logo Icon
- Briefcase Icon mit Pin-Badge
- Gradient Background (Red → Red Dark)
- Box-Shadow für Tiefe

### Layout-Struktur
1. **Top Accent Bar** - 8px Red Gradient
2. **Background Pattern** - Subtile radiale Gradients
3. **Logo Container** - Icon + Brand Name
4. **Title** - Haupttitel (52px)
5. **Subtitle** - Untertitel (32px)
6. **Location Badge** - Mit Pin Icon
7. **Bottom Accent Bar** - 8px Red Gradient

## Testing

### Lokales Testen
```bash
npm run dev
```

Dann öffne:
```
http://localhost:3000/api/og
http://localhost:3000/api/og?title=Test&subtitle=Untertitel
```

### Social Media Debugger

**Facebook:**
https://developers.facebook.com/tools/debug/

**Twitter:**
https://cards-dev.twitter.com/validator

**LinkedIn:**
https://www.linkedin.com/post-inspector/

## Performance

### API Route
- Edge Runtime für schnelle Antwortzeiten
- Automatisches Caching durch Next.js
- Keine externe Font-Loading (System Fonts)

### SVG
- ~5KB Dateigröße
- Instant Loading
- Keine Build-Zeit

## Troubleshooting

### OG-Image wird nicht angezeigt
1. Cache leeren (Meta Debugger)
2. URL prüfen (muss absolute URL sein in Production)
3. Response Headers prüfen (`Content-Type: image/png`)

### Fehler bei ImageResponse
1. Next.js Version prüfen (mindestens 14.0)
2. Edge Runtime aktiviert?
3. Console-Logs in Route prüfen

### Falsche Farben/Layout
1. Tailwind Config prüfen
2. Brand Colors in Route hardcoded
3. Browser-Kompatibilität (moderne Browser)

## Nächste Schritte

1. **Job-Detailseiten** - Dynamische OG-Images für jedes Job-Inserat
2. **Standort-Seiten** - Spezifische Images für Zeven, Rotenburg, etc.
3. **Statistiken** - "X neue Jobs diese Woche" in OG-Image
4. **A/B Testing** - Verschiedene Designs testen

## Support

Bei Fragen oder Problemen:
- Dokumentation: `/OG-IMAGE-README.md`
- Test-HTML: `/public/og-image-generator.html`
- API Route: `/src/app/api/og/route.tsx`
