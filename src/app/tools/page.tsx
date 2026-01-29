'use client'

import Link from 'next/link'
import { FileText, PenTool, MessageSquare, Euro, Sparkles, ArrowRight, Crown } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ToolsPage() {
  const t = useTranslations('tools')

  const tools = [
    {
      titleKey: 'resumeCheck.title',
      descriptionKey: 'resumeCheck.description',
      icon: FileText,
      href: '/tools/lebenslauf-check',
      freeUses: 3,
      color: 'brand-red',
    },
    {
      titleKey: 'coverLetterGenerator.title',
      descriptionKey: 'coverLetterGenerator.description',
      icon: PenTool,
      href: '/tools/anschreiben-generator',
      freeUses: 2,
      color: 'blue-500',
    },
    {
      titleKey: 'interviewCoach.title',
      descriptionKey: 'interviewCoach.description',
      icon: MessageSquare,
      href: '/tools/interview-coach',
      freeUses: 2,
      color: 'green-500',
    },
    {
      titleKey: 'salaryNegotiation.title',
      descriptionKey: 'salaryNegotiation.description',
      icon: Euro,
      href: '/tools/gehaltsverhandlung',
      freeUses: 2,
      color: 'purple-500',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-brand-red mr-2" />
            <span className="text-brand-red text-sm font-medium">{t('poweredBy')}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.titleKey}
                href={tool.href}
                className="card group hover:border-brand-red/50 transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 bg-${tool.color}/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <tool.icon className={`w-7 h-7 text-${tool.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h2 className="text-xl font-semibold text-white group-hover:text-brand-red transition-colors">
                        {t(tool.titleKey)}
                      </h2>
                      <ArrowRight className="w-5 h-5 text-gray-500 group-hover:text-brand-red group-hover:translate-x-1 transition-all" />
                    </div>
                    <p className="text-gray-400 mb-3">{t(tool.descriptionKey)}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded">
                        {t('freeUsesLabel', { count: tool.freeUses })}
                      </span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-500 flex items-center">
                        <Crown className="w-3 h-3 mr-1 text-yellow-500" />
                        {t('unlimitedWithPremium')}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card bg-gradient-to-br from-brand-dark-card to-brand-red/10 border-brand-red/30 text-center">
            <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('premium.title')}
            </h2>
            <p className="text-gray-400 mb-6">
              {t('premium.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/premium" className="btn-primary inline-flex items-center justify-center">
                <Crown className="w-5 h-5 mr-2" />
                {t('premium.cta')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
