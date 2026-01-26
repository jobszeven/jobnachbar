'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'

interface LanguageSwitcherProps {
  variant?: 'header' | 'footer' | 'mobile'
}

export default function LanguageSwitcher({ variant = 'header' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const switchLocale = (newLocale: Locale) => {
    // Set cookie for locale preference
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Refresh the page to apply new locale
    router.refresh()
    setIsOpen(false)
  }

  if (variant === 'mobile') {
    return (
      <div className="space-y-2">
        <p className="text-sm text-gray-400 px-3">Sprache / Language</p>
        <div className="grid grid-cols-5 gap-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                locale === loc
                  ? 'bg-brand-red/20 text-brand-red'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              title={localeNames[loc]}
            >
              <span className="text-2xl">{localeFlags[loc]}</span>
              <span className="text-xs mt-1 uppercase">{loc}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className="flex flex-wrap gap-2">
        {locales.map((loc) => (
          <button
            key={loc}
            onClick={() => switchLocale(loc)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
              locale === loc
                ? 'bg-brand-red/20 text-brand-red'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <span>{localeFlags[loc]}</span>
            <span>{localeNames[loc]}</span>
          </button>
        ))}
      </div>
    )
  }

  // Default header variant
  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
        aria-label="Sprache wählen"
      >
        <span className="text-lg">{localeFlags[locale]}</span>
        <span className="hidden sm:inline text-sm uppercase">{locale}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-brand-dark-card border border-gray-700 rounded-lg shadow-xl z-50 py-1">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => switchLocale(loc)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                locale === loc
                  ? 'bg-brand-red/10 text-brand-red'
                  : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <span className="text-lg">{localeFlags[loc]}</span>
              <span className="flex-1">{localeNames[loc]}</span>
              {locale === loc && (
                <span className="w-2 h-2 bg-brand-red rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
