import { getRequestConfig } from 'next-intl/server'
import { cookies, headers } from 'next/headers'
import { defaultLocale, locales, type Locale, getLocaleFromBrowser } from './config'

export default getRequestConfig(async () => {
  // Check cookie first
  const cookieStore = await cookies()
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined

  // Check if cookie value is valid
  let locale: Locale = defaultLocale

  if (localeCookie && locales.includes(localeCookie)) {
    locale = localeCookie
  } else {
    // Fallback to browser language detection
    const headersList = await headers()
    const acceptLanguage = headersList.get('accept-language')
    locale = getLocaleFromBrowser(acceptLanguage)
  }

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
    timeZone: 'Europe/Berlin'
  }
})
