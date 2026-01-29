'use client'

import Link from 'next/link'
import { CheckCircle, ArrowRight, Briefcase, Sparkles, Clock, Heart, MapPin, Shield, FileText, MessageSquare } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslations } from 'next-intl'

export default function FuerBewerberPage() {
  const t = useTranslations('forApplicantsPage')

  const benefits = [
    { icon: MapPin, titleKey: 'benefits.regional.title', descKey: 'benefits.regional.desc' },
    { icon: Heart, titleKey: 'benefits.free.title', descKey: 'benefits.free.desc' },
    { icon: Sparkles, titleKey: 'benefits.aiTools.title', descKey: 'benefits.aiTools.desc' },
    { icon: Clock, titleKey: 'benefits.fast.title', descKey: 'benefits.fast.desc' },
    { icon: Briefcase, titleKey: 'benefits.matching.title', descKey: 'benefits.matching.desc' },
    { icon: Shield, titleKey: 'benefits.privacy.title', descKey: 'benefits.privacy.desc' },
  ]

  const tools = [
    { icon: FileText, titleKey: 'tools.resume.title', descKey: 'tools.resume.desc', href: '/tools/lebenslauf-check' },
    { icon: FileText, titleKey: 'tools.coverLetter.title', descKey: 'tools.coverLetter.desc', href: '/tools/anschreiben-generator' },
    { icon: MessageSquare, titleKey: 'tools.interview.title', descKey: 'tools.interview.desc', href: '/tools/interview-coach' },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 bg-brand-blue rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-blue/20 text-brand-blue text-sm font-semibold px-4 py-1 rounded-full mb-6">
            {t('badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {t('hero.title')}<br /><span className="text-brand-red">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrieren/bewerber" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              {t('hero.cta')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/jobs" className="btn-secondary inline-flex items-center justify-center">
              {t('hero.browseJobs')}
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

      {/* AI Tools */}
      <section className="py-20 bg-gradient-to-r from-brand-red/10 to-purple-500/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-brand-red mr-2" />
              <span className="text-brand-red text-sm font-medium">{t('tools.badge')}</span>
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">{t('tools.title')}</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{t('tools.subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tools.map((tool, i) => (
              <Link key={i} href={tool.href} className="card hover:border-brand-red/50 transition-colors group">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <tool.icon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-brand-red transition-colors">
                  {t(tool.titleKey)}
                </h3>
                <p className="text-gray-400">{t(tool.descKey)}</p>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/tools" className="inline-flex items-center text-brand-red hover:underline">
              {t('tools.viewAll')} <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-brand-red">500+</p>
              <p className="text-gray-400">{t('stats.activeJobs')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-red">200+</p>
              <p className="text-gray-400">{t('stats.companies')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-red">30km</p>
              <p className="text-gray-400">{t('stats.radius')}</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-brand-red">100%</p>
              <p className="text-gray-400">{t('stats.free')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-dark-card">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-gray-300 mb-8">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrieren/bewerber" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              {t('cta.register')}
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/jobs" className="btn-secondary inline-flex items-center justify-center">
              {t('cta.browseJobs')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
