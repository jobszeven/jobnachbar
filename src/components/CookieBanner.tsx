'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { Cookie, X, ChevronDown, ChevronUp, Shield, BarChart3, Target, Settings2 } from 'lucide-react'

interface CookieConsent {
  necessary: boolean
  functional: boolean
  analytics: boolean
  marketing: boolean
  timestamp: number
}

const COOKIE_CONSENT_KEY = 'jobnachbar_cookie_consent'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [consent, setConsent] = useState<CookieConsent>({
    necessary: true,
    functional: false,
    analytics: false,
    marketing: false,
    timestamp: 0,
  })
  const t = useTranslations('cookies')

  useEffect(() => {
    const savedConsent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent)
        if (Date.now() - parsed.timestamp < 365 * 24 * 60 * 60 * 1000) {
          setConsent(parsed)
          loadScripts(parsed)
          return
        }
      } catch (e) {
        // Invalid consent
      }
    }
    setTimeout(() => setIsVisible(true), 1000)
  }, [])

  // Listen for cookie settings event from footer
  useEffect(() => {
    const handleOpenSettings = () => {
      setIsVisible(true)
      setShowSettings(true)
    }
    window.addEventListener('openCookieSettings', handleOpenSettings)
    return () => window.removeEventListener('openCookieSettings', handleOpenSettings)
  }, [])

  function loadScripts(consent: CookieConsent) {
    // Load Google Analytics if consented
    if (consent.analytics) {
      loadGoogleAnalytics()
    }
    // Load Meta Pixel if consented
    if (consent.marketing) {
      loadMetaPixel()
    }
  }

  function loadGoogleAnalytics() {
    const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
    if (!gaId || typeof window === 'undefined') return
    if (document.getElementById('ga-script')) return

    const script = document.createElement('script')
    script.id = 'ga-script'
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      (window as any).dataLayer = (window as any).dataLayer || []
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args)
      }
      gtag('js', new Date())
      gtag('config', gaId)
    }
  }

  function loadMetaPixel() {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
    if (!pixelId || typeof window === 'undefined') return
    if ((window as any).fbq) return

    const script = document.createElement('script')
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
      fbq('track', 'PageView');
    `
    document.head.appendChild(script)
  }

  const saveConsent = (newConsent: CookieConsent) => {
    const consentWithTimestamp = { ...newConsent, timestamp: Date.now() }
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consentWithTimestamp))
    document.cookie = `cookie_consent=${JSON.stringify(consentWithTimestamp)}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`
    setConsent(consentWithTimestamp)
    loadScripts(consentWithTimestamp)
    setIsVisible(false)
    setShowSettings(false)
  }

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
      timestamp: Date.now(),
    })
  }

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false,
      timestamp: Date.now(),
    })
  }

  const saveSettings = () => {
    saveConsent(consent)
  }

  if (!isVisible) return null

  return (
    <>
      {/* Overlay for settings modal */}
      {showSettings && (
        <div
          className="fixed inset-0 bg-black/50 z-[9998]"
          onClick={() => setShowSettings(false)}
        />
      )}

      <div className={`fixed z-[9999] ${showSettings ? 'inset-0 flex items-center justify-center p-4' : 'bottom-0 left-0 right-0 p-4 safe-area-bottom'}`}>
        <div className={`bg-brand-dark-card border border-gray-700 rounded-xl shadow-2xl ${showSettings ? 'w-full max-w-2xl max-h-[90vh] overflow-y-auto' : 'max-w-4xl mx-auto'}`}>
          <div className="p-5">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-brand-red" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{t('title')}</h3>
                  {showSettings && (
                    <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-700 rounded-lg">
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-2">{t('description')}</p>
              </div>
            </div>

            {/* Settings Button (when not expanded) */}
            {!showSettings && (
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 text-brand-red text-sm hover:underline mb-4"
              >
                <Settings2 className="w-4 h-4" />
                {t('settings')}
              </button>
            )}

            {/* Cookie Categories (expanded settings) */}
            {showSettings && (
              <div className="space-y-3 mb-6">
                {/* Necessary */}
                <div className="p-4 bg-brand-dark rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-white font-medium">{t('necessary')}</p>
                        <p className="text-gray-500 text-xs">{t('necessaryDesc')}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">{t('alwaysOn')}</span>
                  </div>
                </div>

                {/* Functional */}
                <div className="p-4 bg-brand-dark rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Cookie className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-white font-medium">{t('functional')}</p>
                        <p className="text-gray-500 text-xs">{t('functionalDesc')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.functional}
                        onChange={(e) => setConsent({ ...consent, functional: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-brand-red/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                    </label>
                  </div>
                </div>

                {/* Analytics */}
                <div className="p-4 bg-brand-dark rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-white font-medium">{t('statistics')}</p>
                        <p className="text-gray-500 text-xs">{t('statisticsDesc')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.analytics}
                        onChange={(e) => setConsent({ ...consent, analytics: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-brand-red/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                    </label>
                  </div>
                </div>

                {/* Marketing */}
                <div className="p-4 bg-brand-dark rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Target className="w-5 h-5 text-orange-500" />
                      <div>
                        <p className="text-white font-medium">{t('marketing')}</p>
                        <p className="text-gray-500 text-xs">{t('marketingDesc')}</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={consent.marketing}
                        onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:ring-2 peer-focus:ring-brand-red/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {showSettings ? (
                <>
                  <button onClick={acceptNecessary} className="btn-secondary text-sm py-2.5 flex-1">
                    {t('acceptNecessary')}
                  </button>
                  <button onClick={saveSettings} className="btn-primary text-sm py-2.5 flex-1">
                    {t('save')}
                  </button>
                </>
              ) : (
                <>
                  <button onClick={acceptNecessary} className="btn-secondary text-sm py-2.5">
                    {t('acceptNecessary')}
                  </button>
                  <button onClick={acceptAll} className="btn-primary text-sm py-2.5">
                    {t('acceptAll')}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// Function to open cookie settings from footer
export function openCookieSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('openCookieSettings'))
  }
}
