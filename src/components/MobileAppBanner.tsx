'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Smartphone, X } from 'lucide-react'

const BANNER_DISMISSED_KEY = 'jobnachbar_app_banner_dismissed'

export default function MobileAppBanner() {
  const t = useTranslations('appBanner')
  const [showBanner, setShowBanner] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check if mobile device
    const checkMobile = () => {
      const userAgent = navigator.userAgent.toLowerCase()
      return /iphone|ipad|ipod|android/.test(userAgent) && window.innerWidth < 768
    }

    // Check if already installed as PWA
    const checkInstalled = () => {
      return window.matchMedia('(display-mode: standalone)').matches ||
             (window.navigator as any).standalone === true
    }

    // Check if banner was dismissed
    const checkDismissed = () => {
      const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY)
      if (dismissed) {
        const dismissedTime = parseInt(dismissed)
        // Show again after 7 days
        return Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000
      }
      return false
    }

    setIsMobile(checkMobile())
    setIsInstalled(checkInstalled())

    // Show banner if mobile, not installed, and not dismissed
    if (checkMobile() && !checkInstalled() && !checkDismissed()) {
      // Delay showing banner
      setTimeout(() => setShowBanner(true), 2000)
    }
  }, [])

  const dismissBanner = () => {
    localStorage.setItem(BANNER_DISMISSED_KEY, Date.now().toString())
    setShowBanner(false)
  }

  if (!showBanner || !isMobile || isInstalled) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-brand-red to-orange-500 text-white safe-area-top">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          href="/app-installieren"
          className="flex items-center gap-2 text-sm font-medium flex-1"
        >
          <Smartphone className="w-4 h-4" />
          <span>{t('text')}</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/app-installieren"
            className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-full text-xs font-semibold transition-colors"
          >
            {t('install')}
          </Link>
          <button
            onClick={dismissBanner}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Banner schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
