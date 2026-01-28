'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, Users, Zap, Clock, Euro, MapPin, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslations } from 'next-intl'

export default function FuerArbeitgeberPage() {
  const t = useTranslations('forEmployersPage')

  const benefits = [
    { icon: MapPin, titleKey: 'benefits.regional.title', descKey: 'benefits.regional.desc' },
    { icon: Euro, titleKey: 'benefits.affordable.title', descKey: 'benefits.affordable.desc' },
    { icon: Clock, titleKey: 'benefits.fast.title', descKey: 'benefits.fast.desc' },
    { icon: Zap, titleKey: 'benefits.matching.title', descKey: 'benefits.matching.desc' },
    { icon: Users, titleKey: 'benefits.qualified.title', descKey: 'benefits.qualified.desc' },
    { icon: TrendingUp, titleKey: 'benefits.effective.title', descKey: 'benefits.effective.desc' },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-red rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-red/20 text-brand-red text-sm font-semibold px-4 py-1 rounded-full mb-6">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('hero.title')}<br /><span className="text-brand-red">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrieren/arbeitgeber" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              {t('hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/preise" className="btn-secondary inline-flex items-center justify-center">
              {t('hero.viewPrices')}
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">{t('benefits.title')}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="card hover:border-brand-red/50 transition-colors">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t(benefit.titleKey)}</h3>
                <p className="text-gray-400">{t(benefit.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">{t('howItWorks.title')}</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', titleKey: 'howItWorks.step1.title', descKey: 'howItWorks.step1.desc' },
              { num: '2', titleKey: 'howItWorks.step2.title', descKey: 'howItWorks.step2.desc' },
              { num: '3', titleKey: 'howItWorks.step3.title', descKey: 'howItWorks.step3.desc' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{t(step.titleKey)}</h3>
                <p className="text-gray-400">{t(step.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-gradient-to-r from-brand-red/20 to-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('pricing.title')}</h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('pricing.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="card text-center">
              <p className="text-gray-400">{t('pricing.starter.name')}</p>
              <p className="text-4xl font-bold text-white">{t('pricing.starter.price')}</p>
              <p className="text-gray-400 text-sm">{t('pricing.starter.desc')}</p>
            </div>
            <div className="card border-brand-red text-center">
              <p className="text-brand-red">{t('pricing.basic.name')}</p>
              <p className="text-4xl font-bold text-white">{t('pricing.basic.price')}<span className="text-lg text-gray-400">{t('pricing.perMonth')}</span></p>
              <p className="text-gray-400 text-sm">{t('pricing.basic.desc')}</p>
            </div>
            <div className="card text-center">
              <p className="text-yellow-400">{t('pricing.premium.name')}</p>
              <p className="text-4xl font-bold text-white">{t('pricing.premium.price')}<span className="text-lg text-gray-400">{t('pricing.perMonth')}</span></p>
              <p className="text-gray-400 text-sm">{t('pricing.premium.desc')}</p>
            </div>
          </div>
          <Link href="/preise" className="inline-flex items-center text-brand-red mt-8 hover:underline">
            {t('pricing.compare')} <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.subtitle')}
          </p>
          <Link href="/registrieren/arbeitgeber" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
            {t('cta.button')}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
