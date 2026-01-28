'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, HelpCircle, X, Zap, TrendingUp, Clock, Users, Shield, Crown, Sparkles, Building2, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslations } from 'next-intl'

type Tab = 'arbeitgeber' | 'bewerber'

export default function PreisePage() {
  const t = useTranslations('pricingPage')
  const [activeTab, setActiveTab] = useState<Tab>('arbeitgeber')

  const freeFeatures = t.raw('applicant.free.features') as string[]
  const premiumFeatures = t.raw('applicant.premium.features') as string[]
  const employerStarterFeatures = t.raw('employer.plans.starter.features') as string[]
  const employerBasicFeatures = t.raw('employer.plans.basic.features') as string[]
  const employerPremiumFeatures = t.raw('employer.plans.premium.features') as string[]

  const spotsTotal = 50
  const spotsTaken = 34
  const spotsLeft = spotsTotal - spotsTaken
  const percentageFilled = (spotsTaken / spotsTotal) * 100

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Tab Selector */}
      <div className="border-b border-gray-800 bg-brand-dark sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('arbeitgeber')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'arbeitgeber'
                  ? 'text-brand-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              {t('tabs.forEmployers')}
              {activeTab === 'arbeitgeber' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bewerber')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'bewerber'
                  ? 'text-brand-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              {t('tabs.forApplicants')}
              {activeTab === 'bewerber' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'arbeitgeber' ? (
        // Employer Pricing
        <>
          {/* Launch Banner */}
          <div className="bg-gradient-to-r from-brand-red to-orange-500 py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="font-bold text-white">{t('employer.launchBanner.badge')}</span>
              </div>
              <span
                className="text-white/90"
                dangerouslySetInnerHTML={{
                  __html: t('employer.launchBanner.discount', { total: spotsTotal, left: spotsLeft })
                }}
              />
            </div>
          </div>

          {/* Hero */}
          <div className="text-center py-12 md:py-16 px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              {t('employer.hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              {t('employer.hero.subtitle')}
            </p>

            {/* Scarcity Bar */}
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">{t('employer.scarcity.label')}</span>
                <span className="text-brand-red font-semibold">{t('employer.scarcity.progress', { taken: spotsTaken, total: spotsTotal })}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-red to-red-400 rounded-full" style={{ width: `${percentageFilled}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-2">{t('employer.scarcity.note')}</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-6xl mx-auto px-4 pb-16">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

              {/* Starter */}
              <div className="card border-gray-700">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">{t('employer.plans.starter.name')}</h2>
                  <p className="text-gray-400">{t('employer.plans.starter.description')}</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-white">{t('employer.plans.starter.price')}</span>
                    <span className="text-gray-400">{t('employer.plans.starter.period')}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {employerStarterFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }} />
                    </li>
                  ))}
                </ul>

                <Link href="/registrieren/arbeitgeber?plan=free" className="block w-full text-center py-3 px-4 border-2 border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors">
                  {t('employer.plans.starter.cta')}
                </Link>
              </div>

              {/* Basic - Popular */}
              <div className="card border-brand-red relative md:scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-red text-white text-sm font-bold px-4 py-1 rounded-full">{t('employer.plans.basic.badge')}</span>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">{t('employer.plans.basic.name')}</h2>
                  <p className="text-gray-400">{t('employer.plans.basic.description')}</p>
                  <div className="mt-6">
                    <span className="text-gray-500 line-through text-lg">{t('employer.plans.basic.oldPrice')}</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold text-white">{t('employer.plans.basic.price')}</span>
                      <span className="text-gray-400">{t('employer.plans.basic.period')}</span>
                    </div>
                    <span className="inline-block mt-2 bg-brand-red/20 text-brand-red text-sm font-semibold px-3 py-1 rounded-full">{t('employer.plans.basic.discount')}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  {employerBasicFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }} />
                    </li>
                  ))}
                </ul>

                {/* Upsells */}
                <div className="border-t border-gray-700 pt-4 mb-6 text-sm">
                  <p className="text-gray-400 mb-2">{t('employer.plans.basic.upsells.title')}</p>
                  <div className="flex justify-between text-gray-400"><span>{t('employer.plans.basic.upsells.boost')}</span><span className="text-white">{t('employer.plans.basic.upsells.boostPrice')}</span></div>
                  <div className="flex justify-between text-gray-400"><span>{t('employer.plans.basic.upsells.facebook')}</span><span className="text-white">{t('employer.plans.basic.upsells.facebookPrice')}</span></div>
                </div>

                <Link href="/registrieren/arbeitgeber?plan=basic" className="btn-primary w-full text-center block">{t('employer.plans.basic.cta')}</Link>
              </div>

              {/* Premium */}
              <div className="card border-yellow-500/30 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-sm font-bold px-4 py-1 rounded-full">{t('employer.plans.premium.badge')}</span>
                </div>

                <div className="text-center mb-8 pt-2">
                  <h2 className="text-2xl font-bold text-white mb-2">{t('employer.plans.premium.name')}</h2>
                  <p className="text-gray-400">{t('employer.plans.premium.description')}</p>
                  <div className="mt-6">
                    <span className="text-gray-500 line-through text-lg">{t('employer.plans.premium.oldPrice')}</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold text-white">{t('employer.plans.premium.price')}</span>
                      <span className="text-gray-400">{t('employer.plans.premium.period')}</span>
                    </div>
                    <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full">{t('employer.plans.premium.discount')}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {employerPremiumFeatures.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300" dangerouslySetInnerHTML={{ __html: feature }} />
                    </li>
                  ))}
                </ul>

                <Link href="/registrieren/arbeitgeber?plan=premium" className="block w-full text-center py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-brand-dark font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors">{t('employer.plans.premium.cta')}</Link>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{t('employer.comparison.title')}</h2>
                <p className="text-gray-400" dangerouslySetInnerHTML={{ __html: t('employer.comparison.subtitle') }} />
              </div>

              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">{t('employer.comparison.headers.feature')}</th>
                      <th className="py-3 px-2 text-brand-red font-bold">{t('employer.comparison.headers.jobnachbar')}</th>
                      <th className="py-3 px-2 text-gray-400">{t('employer.comparison.headers.stepstone')}</th>
                      <th className="py-3 px-2 text-gray-400">{t('employer.comparison.headers.indeed')}</th>
                      <th className="py-3 px-2 text-gray-400">{t('employer.comparison.headers.arbeitsagentur')}</th>
                      <th className="py-3 px-2 text-gray-400">{t('employer.comparison.headers.meinestadt')}</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr className="border-b border-gray-800">
                      <td className="text-left py-3 px-2 text-gray-300">{t('employer.comparison.rows.price')}</td>
                      <td className="py-3 px-2 text-brand-red font-bold">{t('employer.comparison.values.jobnachbar.price')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.values.stepstone.price')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.values.indeed.price')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.values.arbeitsagentur.price')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.values.meinestadt.price')}</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="text-left py-3 px-2 text-gray-300">{t('employer.comparison.rows.localApplicants')}</td>
                      <td className="py-3 px-2"><CheckCircle className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><CheckCircle className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="text-left py-3 px-2 text-gray-300">{t('employer.comparison.rows.findApplicants')}</td>
                      <td className="py-3 px-2"><CheckCircle className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2 text-gray-500 text-xs">{t('employer.comparison.rows.poor')}</td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="text-left py-3 px-2 text-gray-300">{t('employer.comparison.rows.howFast')}</td>
                      <td className="py-3 px-2 text-brand-red font-semibold">{t('employer.comparison.values.jobnachbar.speed')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.values.stepstone.speed')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.values.indeed.speed')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.rows.slow')}</td>
                      <td className="py-3 px-2 text-gray-400">{t('employer.comparison.values.meinestadt.speed')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">{t('employer.trust.dataInGermany.title')}</p>
                <p className="text-gray-400 text-xs md:text-sm">{t('employer.trust.dataInGermany.subtitle')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">{t('employer.trust.cancelAnytime.title')}</p>
                <p className="text-gray-400 text-xs md:text-sm">{t('employer.trust.cancelAnytime.subtitle')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">{t('employer.trust.regional.title')}</p>
                <p className="text-gray-400 text-xs md:text-sm">{t('employer.trust.regional.subtitle')}</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">{t('employer.trust.fairPrices.title')}</p>
                <p className="text-gray-400 text-xs md:text-sm">{t('employer.trust.fairPrices.subtitle')}</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white text-center mb-8">{t('employer.faq.title')}</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="card">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">{t('employer.faq.discountDuration.question')}</h3>
                      <p className="text-gray-400 text-sm">{t('employer.faq.discountDuration.answer')}</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">{t('employer.faq.cancelAnytime.question')}</h3>
                      <p className="text-gray-400 text-sm">{t('employer.faq.cancelAnytime.answer')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center card bg-gradient-to-r from-brand-red/20 to-orange-500/20 border-brand-red">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{t('employer.cta.title', { spots: spotsLeft })}</h2>
              <p className="text-gray-300 mb-6">{t('employer.cta.subtitle')}</p>
              <Link href="/registrieren/arbeitgeber?plan=basic" className="btn-primary inline-flex items-center text-lg px-8 py-4">
                {t('employer.cta.button')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </>
      ) : (
        // Applicant Pricing
        <>
          {/* Hero Section */}
          <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-6">
                <Crown className="w-4 h-4 text-brand-red mr-2" />
                <span className="text-brand-red text-sm font-medium">{t('applicant.hero.badge')}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {t('applicant.hero.title')}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                {t('applicant.hero.subtitle')}
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-2">{t('applicant.free.name')}</h2>
                  <p className="text-gray-400 text-sm mb-6">{t('applicant.free.description')}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">{t('applicant.free.price')}</span>
                    <span className="text-gray-400">{t('applicant.free.period')}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {freeFeatures.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-300">
                        <CheckCircle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/registrieren/bewerber" className="btn-secondary w-full text-center">
                    {t('applicant.free.cta')}
                  </Link>
                </div>

                {/* Premium Plan */}
                <div className="card relative border-brand-red/50 bg-gradient-to-br from-brand-dark-card to-brand-red/5">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-red text-white text-sm font-bold px-4 py-1 rounded-full">
                      {t('applicant.premium.badge')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 text-brand-red mr-2" />
                    {t('applicant.premium.name')}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">{t('applicant.premium.description')}</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">{t('applicant.premium.price')}</span>
                    <span className="text-gray-400">{t('applicant.premium.period')}</span>
                  </div>
                  <p className="text-brand-red text-sm mb-6">{t('applicant.premium.yearlyOffer')}</p>
                  <ul className="space-y-3 mb-8">
                    {premiumFeatures.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-300">
                        <CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/premium/checkout" className="btn-primary w-full text-center">
                    {t('applicant.premium.cta')}
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 px-4 bg-brand-dark-lighter">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white text-center mb-12">
                {t('applicant.faq.title')}
              </h2>
              <div className="space-y-4">
                <div className="card">
                  <h3 className="font-semibold text-white mb-2">{t('applicant.faq.payment.question')}</h3>
                  <p className="text-gray-400">
                    {t('applicant.faq.payment.answer')}
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-white mb-2">{t('applicant.faq.cancel.question')}</h3>
                  <p className="text-gray-400">
                    {t('applicant.faq.cancel.answer')}
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-white mb-2">{t('applicant.faq.data.question')}</h3>
                  <p className="text-gray-400">
                    {t('applicant.faq.data.answer')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-red to-brand-red-dark">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {t('applicant.cta.title')}
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                {t('applicant.cta.subtitle')}
              </p>
              <Link href="/premium/checkout" className="btn-white inline-flex items-center">
                {t('applicant.cta.button')}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}
