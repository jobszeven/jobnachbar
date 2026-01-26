'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react'

interface CookieConsent {
  necessary: boolean
  statistics: boolean
  marketing: boolean
  timestamp: number
}

const COOKIE_CONSENT_KEY = 'jobnachbar_cookie_consent'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true, // Always required
    statistics: false,
    marketing: false,
    timestamp: 0,
  })
  const t = useTranslations('cookies')

  useEffect(() => {
    // Check if consent was already given
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent)
        // Check if consent is less than 1 year old
        if (Date.now() - parsed.timestamp < 365 * 24 * 60 * 60 * 1000) {
          setConsent(parsed)
          return
        }
      } catch (e) {
        // Invalid consent, show banner
      }
    }
    // Show banner after a short delay
    setTimeout(() => setIsVisible(true), 1000)
  }, [])

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = { ...newConsent, timestamp: Date.now() }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp))

    // Also set a cookie for server-side access
    document.cookie = `cookie_consent=${JSON.stringify(consentWithTimestamp)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`

    setConsent(consentWithTimestamp)
    setIsVisible(false)
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      statistics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      statistics: false,
      marketing: false,
      timestamp: Date.now(),
    })
  }

  const saveSettings = () => {
    saveConsent(consent)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 safe-area-bottom">
      <div className="max-w-4xl mx-auto bg-brand-dark-card border border-gray-700 rounded-xl shadow-2xl">
        {/* Main Content */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
              <Cookie className="w-5 h-5 text-brand-red" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2">{t('title')}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {t('description')}
              </p>

              {/* Settings Toggle */}
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="flex items-center gap-2 text-brand-red text-sm hover:underline mb-4"
              >
                {t('settings')}
                {showSettings ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {/* Cookie Settings */}
              {showSettings && (
                <div className="space-y-4 mb-4 p-4 bg-brand-dark rounded-lg">
                  {/* Necessary Cookies */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent.necessary}
                      disabled
                      className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-brand-red focus:ring-brand-red cursor-not-allowed"
                    />
                    <div>
                      <p className="text-white font-medium">{t('necessary')}</p>
                      <p className="text-gray-500 text-sm">{t('necessaryDesc')}</p>
                    </div>
                  </div>

                  {/* Statistics Cookies */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent.statistics}
                      onChange={(e) => setConsent({ ...consent, statistics: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-brand-red focus:ring-brand-red cursor-pointer"
                    />
                    <div>
                      <p className="text-white font-medium">{t('statistics')}</p>
                      <p className="text-gray-500 text-sm">{t('statisticsDesc')}</p>
                    </div>
                  </div>

                  {/* Marketing Cookies */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={consent.marketing}
                      onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-gray-600 bg-gray-700 text-brand-red focus:ring-brand-red cursor-pointer"
                    />
                    <div>
                      <p className="text-white font-medium">{t('marketing')}</p>
                      <p className="text-gray-500 text-sm">{t('marketingDesc')}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {showSettings ? (
                  <button
                    onClick={saveSettings}
                    className="btn-primary text-sm py-2.5"
                  >
                    {t('save')}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={acceptAll}
                      className="btn-primary text-sm py-2.5"
                    >
                      {t('acceptAll')}
                    </button>
                    <button
                      onClick={acceptNecessary}
                      className="btn-secondary text-sm py-2.5"
                    >
                      {t('acceptNecessary')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
