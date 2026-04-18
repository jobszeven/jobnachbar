# JobNachbar OG-Image Design

## Visuelles Layout (1200x630px)

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║  <- Top Accent Bar (#E63946 → #FF4D5A)
║                                                                                      ║
║                                                                                      ║
║                          ╭────────╮                                                 ║
║                          │        │                                                 ║
║                          │   💼   │  JobNachbar                                     ║  <- Logo + Brand
║                          │        │                                                 ║
║                          ╰────────╯                                                 ║
║                                                                                      ║
║                                                                                      ║
║                          Jobs in deiner Nähe                                        ║  <- Title (52px)
║                                                                                      ║
║                  Die lokale Jobbörse für Zeven und Umgebung                        ║  <- Subtitle (32px)
║                                                                                      ║
║                                                                                      ║
║                          ╭──────────────────────────────╮                          ║
║                          │  📍 Zeven & Landkreis Rotenburg │                          ║  <- Location Badge
║                          ╰──────────────────────────────╯                          ║
║                                                                                      ║
║                                                                                      ║
║ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ ║  <- Bottom Accent Bar
╚══════════════════════════════════════════════════════════════════════════════════════╝

Background: Dark (#1D1D1F) mit subtilen roten Radial Gradients
```

## Komponenten-Breakdown

### 1. Background
```
- Base: #1D1D1F (Dark)
- Pattern: 2x Radial Gradients (#E63946, 5% opacity)
- Position: 20% left, 80% right
```

### 2. Accent Bars
```
- Height: 8px
- Gradient: Linear (#E63946 → #FF4D5A)
- Position: Top + Bottom
```

### 3. Logo Icon
```
- Size: 80x80px
- Border Radius: 20px
- Background: Linear Gradient (#E63946 → #C62E3A)
- Icon: Briefcase (48x48px, white)
- Shadow: 0 20px 40px rgba(230, 57, 70, 0.3)
```

### 4. Brand Name
```
- Font: Inter, 72px, 800 weight
- Color: #F8F8F8
- Letter Spacing: -0.02em
- Position: Right of logo
```

### 5. Title
```
- Font: Inter, 52px, 700 weight
- Color: #F8F8F8
- Max Width: 900px
- Line Height: 1.2
- Margin Bottom: 24px
```

### 6. Subtitle
```
- Font: Inter, 32px, 400 weight
- Color: #AEAEB2 (Gray)
- Max Width: 800px
- Line Height: 1.4
```

### 7. Location Badge
```
- Padding: 16px 32px
- Border Radius: 12px
- Background: rgba(230, 57, 70, 0.15)
- Border: 2px solid rgba(230, 57, 70, 0.3)
- Icon: Map Pin (24x24px, #E63946)
- Text: 24px, 600 weight, #E63946
```

## Farbpalette

```
Primary Colors:
┌─────────┬─────────┬─────────┐
│ #E63946 │ #C62E3A │ #FF4D5A │
│  Red    │Red Dark │Red Light│
└─────────┴─────────┴─────────┘

Background Colors:
┌─────────┬─────────┬─────────┐
│ #1D1D1F │ #2D2D2F │ #252527 │
│  Dark   │  Lighter│  Card   │
└─────────┴─────────┴─────────┘

Text Colors:
┌─────────┬─────────┬─────────┐
│ #F8F8F8 │ #F5F5F5 │ #AEAEB2 │
│  White  │  Cream  │  Gray   │
└─────────┴─────────┴─────────┘
```

## Spacing

```
Vertical Spacing:
  Logo Container → 48px → Title → 24px → Subtitle → 48px → Badge

Horizontal Spacing:
  Content Padding: 80px (left/right)
  Logo → Brand Name: 24px
  Icon → Text (Badge): 12px
```

## Icons

### Logo Icon (Briefcase)
```svg
<svg viewBox="0 0 24 24">
  <path d="M20 7H16V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7H4C2.9 7 2 7.9 2 9V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V9C22 7.9 21.1 7 20 7ZM10 5H14V7H10V5ZM20 20H4V9H20V20Z"/>
  <circle cx="17" cy="14" r="2.5"/>
</svg>
```

### Location Icon (Map Pin)
```svg
<svg viewBox="0 0 24 24">
  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/>
</svg>
```

## Responsive Considerations

### Text Truncation
Falls Titel zu lang:
```tsx
const maxLength = 60
const title = originalTitle.length > maxLength
  ? originalTitle.substring(0, maxLength) + '...'
  : originalTitle
```

### Multi-Line Title
Falls Titel mehrere Zeilen benötigt:
```css
max-width: 900px
line-height: 1.2
text-align: center
```

## Variations

### Variante 1: Standard (wie oben)
```
Title: "JobNachbar"
Subtitle: "Jobs in deiner Nähe"
```

### Variante 2: Job-Detail
```
Title: "Verkäufer (m/w/d)"
Subtitle: "Vollzeit in Zeven"
```

### Variante 3: Standort
```
Title: "Jobs in Rotenburg"
Subtitle: "42 offene Stellen"
```

### Variante 4: Branche
```
Title: "Handwerk Jobs"
Subtitle: "Finde deinen Job im Handwerk"
```

## Export-Formate

1. **Dynamische API** (route.tsx)
   - Format: PNG
   - Größe: ~50-100KB
   - Vorteile: Flexible, kein Build nötig

2. **Statisches SVG** (og-image.svg)
   - Format: SVG
   - Größe: ~5KB
   - Vorteile: Klein, skalierbar

3. **Statisches PNG** (von HTML Generator)
   - Format: PNG
   - Größe: ~80-150KB
   - Vorteile: Beste Kompatibilität

## Best Practices

### Text Lesbarkeit
- Immer heller Text auf dunklem Hintergrund
- Mindestens 4.5:1 Kontrastverhältnis (WCAG AA)
- Font-Size mindestens 32px für gute Lesbarkeit

### Mobile Preview
- Text sollte auch auf kleinen Displays lesbar sein
- WhatsApp Preview: ~400x200px
- Instagram: ~400x400px (zentriert)

### Brand Consistency
- Immer JobNachbar Brand Colors verwenden
- Logo immer mit Gradient
- Accent Bars für Wiedererkennungswert

## Testing Checklist

- [ ] Desktop Preview (Facebook, LinkedIn)
- [ ] Mobile Preview (WhatsApp, Twitter)
- [ ] Text-Längen getestet (kurz, mittel, lang)
- [ ] Sonderzeichen getestet (Umlaute, etc.)
- [ ] Alle Plattformen (FB, Twitter, LinkedIn, WhatsApp)
- [ ] Light/Dark Mode (falls relevant)

## Performance

### Optimierungen
1. Edge Runtime (schnelle Generation)
2. Keine externe Font-Loading
3. Inline SVG Icons
4. Cache-Control Headers

### Monitoring
```tsx
// In route.tsx
console.log(`Generated OG image: ${title} - ${subtitle}`)
```

## Future Enhancements

1. **Dynamische Statistiken**
   - "42 neue Jobs diese Woche"
   - Company Logos einblenden

2. **Saisonale Designs**
   - Weihnachten, Sommer, etc.
   - Regionale Events

3. **A/B Testing**
   - Verschiedene Layouts
   - CTA Buttons

4. **Personalisierung**
   - User-spezifische OG-Images
   - Empfehlungen

## Zusammenfassung

Das OG-Image Design ist:
- ✅ On-Brand (JobNachbar Colors)
- ✅ Professional (Clean, modern)
- ✅ Readable (Gute Kontraste)
- ✅ Scalable (Verschiedene Anwendungsfälle)
- ✅ Performance (Klein, schnell)
- ✅ Accessible (WCAG konform)

Perfekt für Social Media Shares auf allen Plattformen.
