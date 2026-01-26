export const locales = ['de', 'en', 'tr', 'pl', 'uk'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'de'

export const localeNames: Record<Locale, string> = {
  de: 'Deutsch',
  en: 'English',
  tr: 'Türkçe',
  pl: 'Polski',
  uk: 'Українська'
}

export const localeFlags: Record<Locale, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  tr: '🇹🇷',
  pl: '🇵🇱',
  uk: '🇺🇦'
}

// Map browser language codes to our locales
export function getLocaleFromBrowser(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  const languages = acceptLanguage.split(',').map(lang => {
    const [code] = lang.trim().split(';')
    return code.toLowerCase().split('-')[0]
  })

  for (const lang of languages) {
    if (locales.includes(lang as Locale)) {
      return lang as Locale
    }
  }

  return defaultLocale
}
