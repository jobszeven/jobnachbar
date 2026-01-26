'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { FileText, PenTool, Users, DollarSign, ArrowRight, Sparkles } from 'lucide-react'

export default function TipsContent() {
  const t = useTranslations('tipsPage')

  const tools = [
    {
      href: '/bewerbungstipps/lebenslauf',
      icon: FileText,
      titleKey: 'resume',
    },
    {
      href: '/bewerbungstipps/anschreiben',
      icon: PenTool,
      titleKey: 'coverLetter',
    },
    {
      href: '/bewerbungstipps/vorstellungsgespraech',
      icon: Users,
      titleKey: 'interview',
    },
    {
      href: '/bewerbungstipps/gehalt',
      icon: DollarSign,
      titleKey: 'salary',
    },
  ]

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-brand-red mr-2" />
            <span className="text-brand-red text-sm font-medium">{t('badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="card group hover:border-brand-red/50 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/30 transition-colors">
                    <tool.icon className="w-7 h-7 text-brand-red" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white group-hover:text-brand-red transition-colors">
                      {t(`tools.${tool.titleKey}.title`)}
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(t.raw(`tools.${tool.titleKey}.features`) as string[]).map((feature: string) => (
                        <span
                          key={feature}
                          className="text-xs px-2 py-1 bg-brand-dark rounded-full text-gray-400"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-gray-400 mb-4">
                  {t(`tools.${tool.titleKey}.description`)}
                </p>
                <span className="inline-flex items-center text-brand-red font-medium group-hover:gap-3 transition-all">
                  {t(`tools.${tool.titleKey}.cta`)}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA */}
      <section className="py-16 px-4 bg-brand-dark-lighter">
        <div className="max-w-3xl mx-auto text-center">
          <div className="card bg-gradient-to-r from-brand-red/20 to-orange-500/20 border-brand-red/30">
            <Sparkles className="w-12 h-12 text-brand-red mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('premium.title')}
            </h2>
            <p className="text-gray-400 mb-6">
              {t('premium.description')}
            </p>
            <Link href="/preise/bewerber" className="btn-primary inline-flex items-center">
              {t('premium.cta')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
