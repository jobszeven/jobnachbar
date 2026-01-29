'use client'

import Link from 'next/link'
import { Check, Crown, Sparkles, FileText, MessageSquare, Euro, Zap, Star, ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PremiumPage() {
  const t = useTranslations('premium')

  const features = [
    {
      icon: FileText,
      key: 'resumeChecks',
    },
    {
      icon: Sparkles,
      key: 'coverLetterGenerator',
    },
    {
      icon: MessageSquare,
      key: 'interviewCoach',
    },
    {
      icon: Euro,
      key: 'salaryTips',
    },
    {
      icon: Zap,
      key: 'jobMatches',
    },
    {
      icon: Star,
      key: 'premiumBadge',
    },
  ]

  const testimonials = [
    {
      name: 'Lisa T.',
      location: 'Sittensen',
      key: 'testimonial1',
      rating: 5,
    },
    {
      name: 'Markus K.',
      location: 'Rotenburg',
      key: 'testimonial2',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6">
              <Crown className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-yellow-500 text-sm font-medium">{t('badge')}</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t.rich('hero.title', {
                highlight: (chunks) => <span className="text-brand-red">{chunks}</span>
              })}
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Price Card */}
            <div className="max-w-sm mx-auto">
              <div className="card bg-gradient-to-br from-brand-dark-card to-yellow-500/10 border-yellow-500/30 text-center">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">{t('priceCard.title')}</h2>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">{t('priceCard.price')}</span>
                  <span className="text-gray-400">{t('priceCard.period')}</span>
                </div>
                <p className="text-gray-400 mb-6">{t('priceCard.cancelAnytime')}</p>
                <Link
                  href="/premium/checkout"
                  className="btn-primary w-full inline-flex items-center justify-center"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  {t('priceCard.upgradeNow')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {t('features.title')}
            </h2>

            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.key}
                  className="card grid md:grid-cols-3 gap-4 items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{t(`features.${feature.key}.title`)}</h3>
                      <p className="text-gray-400 text-sm">{t(`features.${feature.key}.description`)}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-1">{t('features.freeLabel')}</p>
                    <p className="text-gray-400">{t(`features.${feature.key}.free`)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-500 text-sm mb-1">{t('features.premiumLabel')}</p>
                    <p className="text-white font-semibold flex items-center justify-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      {t(`features.${feature.key}.premium`)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-brand-dark-lighter">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {t('testimonials.title')}
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="card">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-4">&ldquo;{t(`testimonials.${testimonial.key}`)}&rdquo;</p>
                  <p className="text-white font-medium">— {testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              {t('faq.title')}
            </h2>

            <div className="space-y-4">
              <div className="card">
                <h3 className="font-semibold text-white mb-2">{t('faq.cancelAnytime.question')}</h3>
                <p className="text-gray-400">
                  {t('faq.cancelAnytime.answer')}
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-white mb-2">{t('faq.payment.question')}</h3>
                <p className="text-gray-400">
                  {t('faq.payment.answer')}
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-white mb-2">{t('faq.freeUsage.question')}</h3>
                <p className="text-gray-400">
                  {t('faq.freeUsage.answer')}
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-white mb-2">{t('faq.trial.question')}</h3>
                <p className="text-gray-400">
                  {t('faq.trial.answer')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-yellow-500/20 to-brand-red/20">
          <div className="max-w-4xl mx-auto text-center">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              {t('cta.subtitle')}
            </p>
            <Link
              href="/premium/checkout"
              className="btn-primary inline-flex items-center text-lg px-8 py-4"
            >
              <Crown className="w-5 h-5 mr-2" />
              {t('cta.button')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
