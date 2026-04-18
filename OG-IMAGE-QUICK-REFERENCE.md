# OG-Image Quick Reference

## Schnellstart

### Standard-Implementierung (Seiten ohne Parameter)
```tsx
export const metadata: Metadata = {
  openGraph: {
    images: ['/og-image.svg'], // Statisches SVG
  },
}
```

### Dynamische Implementierung (Seiten mit Parametern)
```tsx
export const metadata: Metadata = {
  openGraph: {
    images: ['/api/og?title=Mein%20Titel&subtitle=Mein%20Untertitel'],
  },
}
```

### Mit generateMetadata (für dynamische Routen)
```tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await getData(params.id)

  return {
    openGraph: {
      images: [`/api/og?title=${encodeURIComponent(data.title)}&subtitle=${encodeURIComponent(data.subtitle)}`],
    },
  }
}
```

## API Parameter

| Parameter | Typ | Standard | Beschreibung |
|-----------|-----|----------|--------------|
| `title` | string | "JobNachbar" | Haupttitel des OG-Images |
| `subtitle` | string | "Jobs in deiner Nähe" | Untertitel des OG-Images |

## Dateien

| Datei | Zweck |
|-------|-------|
| `/src/app/api/og/route.tsx` | Dynamische OG-Image API |
| `/public/og-image.svg` | Statisches SVG |
| `/public/og-image-generator.html` | HTML Generator für PNG |
| `/OG-IMAGE-README.md` | Vollständige Dokumentation |
| `/BEISPIEL-DYNAMISCHE-OG-IMAGES.md` | Implementierungs-Beispiele |

## URLs

### Lokal
```
http://localhost:3000/api/og
http://localhost:3000/api/og?title=Test&subtitle=Test
```

### Production
```
https://jobnachbar.com/api/og
https://jobnachbar.com/api/og?title=Test&subtitle=Test
```

## Testing

| Tool | URL |
|------|-----|
| Facebook Debugger | https://developers.facebook.com/tools/debug/ |
| Twitter Validator | https://cards-dev.twitter.com/validator |
| LinkedIn Inspector | https://www.linkedin.com/post-inspector/ |

## Branding

```css
Brand Red:      #E63946
Red Dark:       #C62E3A
Red Light:      #FF4D5A
Dark:           #1D1D1F
White:          #F8F8F8
Gray:           #AEAEB2
```

## Maße

```
OG-Image:       1200x630px
Logo Icon:      80x80px
Border Radius:  20px
Font:           Inter
```

## Common Use Cases

### Job-Detailseite
```tsx
const title = "Verkäufer (m/w/d)"
const subtitle = "Vollzeit in Zeven"
const url = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`
```

### Standort-Seite
```tsx
const title = "Jobs in Zeven"
const subtitle = "42 offene Stellen"
const url = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`
```

### Branchen-Seite
```tsx
const title = "Handwerk Jobs"
const subtitle = "Finde deinen Job im Handwerk"
const url = `/api/og?title=${encodeURIComponent(title)}&subtitle=${encodeURIComponent(subtitle)}`
```

## Troubleshooting

| Problem | Lösung |
|---------|--------|
| Bild wird nicht angezeigt | Cache leeren (Meta Debugger) |
| Falsche URL | Absolute URL in Production verwenden |
| Fehler 500 | Console Logs in `/src/app/api/og/route.tsx` prüfen |
| Text zu lang | `substring()` oder CSS truncate verwenden |

## Checkliste Deploy

- [ ] OG-Image API Route deployed
- [ ] Statisches SVG hochgeladen
- [ ] Metadata in Layout aktualisiert
- [ ] Lokal getestet
- [ ] Production getestet
- [ ] Facebook Debugger OK
- [ ] Twitter Validator OK
- [ ] LinkedIn Inspector OK

## Support

Bei Fragen: Siehe `/OG-IMAGE-README.md`
