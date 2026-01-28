'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Smartphone,
  Monitor,
  Share,
  Plus,
  MoreVertical,
  Download,
  Wifi,
  WifiOff,
  Bell,
  Zap,
  CheckCircle,
  Apple,
  Chrome
} from 'lucide-react'

type DeviceType = 'ios' | 'android' | 'desktop' | 'unknown'

export default function AppInstallPage() {
  const t = useTranslations('appInstall')
  const [device, setDevice] = useState<DeviceType>('unknown')
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent.toLowerCase()
    const isIOS = /iphone|ipad|ipod/.test(userAgent)
    const isAndroid = /android/.test(userAgent)
    const isMobile = isIOS || isAndroid

    if (isIOS) {
      setDevice('ios')
    } else if (isAndroid) {
      setDevice('android')
    } else {
      setDevice('desktop')
    }

    // Check if already installed as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }
  }, [])

  const benefits = [
    { icon: Zap, title: t('benefits.fast.title'), description: t('benefits.fast.description') },
    { icon: WifiOff, title: t('benefits.offline.title'), description: t('benefits.offline.description') },
    { icon: Bell, title: t('benefits.notifications.title'), description: t('benefits.notifications.description') },
    { icon: Smartphone, title: t('benefits.homescreen.title'), description: t('benefits.homescreen.description') },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-brand-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Smartphone className="w-10 h-10 text-brand-red" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </div>

          {/* Already Installed Message */}
          {isInstalled && (
            <div className="card bg-green-500/10 border-green-500/30 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-6 h-6 text-green-500" />
                <p className="text-green-400 font-medium">{t('alreadyInstalled')}</p>
              </div>
            </div>
          )}

          {/* Device Tabs */}
          <div className="flex justify-center gap-2 mb-8">
            <button
              onClick={() => setDevice('ios')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                device === 'ios'
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Apple className="w-5 h-5" />
              iPhone/iPad
            </button>
            <button
              onClick={() => setDevice('android')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                device === 'android'
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-5 h-5" />
              Android
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                device === 'desktop'
                  ? 'bg-brand-red text-white'
                  : 'bg-gray-800 text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-5 h-5" />
              Desktop
            </button>
          </div>

          {/* Installation Steps */}
          <div className="card mb-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Download className="w-5 h-5 text-brand-red" />
              {t('steps.title')}
            </h2>

            {/* iOS Steps */}
            {device === 'ios' && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('ios.step1.title')}</h3>
                    <p className="text-gray-400 text-sm mb-3">{t('ios.step1.description')}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                      <Share className="w-5 h-5" />
                      <span>{t('ios.step1.button')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('ios.step2.title')}</h3>
                    <p className="text-gray-400 text-sm mb-3">{t('ios.step2.description')}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg">
                      <Plus className="w-5 h-5" />
                      <span>{t('ios.step2.button')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('ios.step3.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('ios.step3.description')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Android Steps */}
            {device === 'android' && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('android.step1.title')}</h3>
                    <p className="text-gray-400 text-sm mb-3">{t('android.step1.description')}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg">
                      <MoreVertical className="w-5 h-5" />
                      <span>{t('android.step1.button')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('android.step2.title')}</h3>
                    <p className="text-gray-400 text-sm mb-3">{t('android.step2.description')}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg">
                      <Download className="w-5 h-5" />
                      <span>{t('android.step2.button')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('android.step3.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('android.step3.description')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Desktop Steps */}
            {device === 'desktop' && (
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('desktop.step1.title')}</h3>
                    <p className="text-gray-400 text-sm mb-3">{t('desktop.step1.description')}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg">
                      <Chrome className="w-5 h-5" />
                      <span>Chrome, Edge, Brave</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('desktop.step2.title')}</h3>
                    <p className="text-gray-400 text-sm mb-3">{t('desktop.step2.description')}</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg">
                      <Download className="w-5 h-5" />
                      <span>{t('desktop.step2.button')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{t('desktop.step3.title')}</h3>
                    <p className="text-gray-400 text-sm">{t('desktop.step3.description')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white text-center mb-8">
              {t('benefits.title')}
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <benefit.icon className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-1">{benefit.title}</h3>
                      <p className="text-gray-400 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <div className="card">
            <h2 className="text-xl font-bold text-white mb-6">{t('faq.title')}</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">{t('faq.q1.question')}</h3>
                <p className="text-gray-400 text-sm">{t('faq.q1.answer')}</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">{t('faq.q2.question')}</h3>
                <p className="text-gray-400 text-sm">{t('faq.q2.answer')}</p>
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">{t('faq.q3.question')}</h3>
                <p className="text-gray-400 text-sm">{t('faq.q3.answer')}</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
