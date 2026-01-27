'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  ArrowLeft, ArrowRight, Wrench, Heart, UtensilsCrossed, ShoppingBag,
  Truck, Factory, Briefcase, Monitor, HardHat, Tractor, GraduationCap,
  ChevronDown, ChevronUp, MapPin, Users, TrendingUp, Euro
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface IndustryConfig {
  id: string
  icon: React.ElementType
  color: string
  avgSalary: string
  demandLevel: 'high' | 'medium' | 'low'
}

const industryConfigs: IndustryConfig[] = [
  { id: 'handwerk', icon: Wrench, color: 'text-orange-400', avgSalary: '2.400 - 3.500€', demandLevel: 'high' },
  { id: 'pflege_gesundheit', icon: Heart, color: 'text-pink-400', avgSalary: '2.500 - 3.800€', demandLevel: 'high' },
  { id: 'gastro_hotel', icon: UtensilsCrossed, color: 'text-yellow-400', avgSalary: '2.000 - 2.800€', demandLevel: 'high' },
  { id: 'einzelhandel', icon: ShoppingBag, color: 'text-purple-400', avgSalary: '2.000 - 2.600€', demandLevel: 'medium' },
  { id: 'logistik_transport', icon: Truck, color: 'text-blue-400', avgSalary: '2.400 - 3.200€', demandLevel: 'high' },
  { id: 'industrie_produktion', icon: Factory, color: 'text-gray-400', avgSalary: '2.600 - 3.600€', demandLevel: 'medium' },
  { id: 'buero_verwaltung', icon: Briefcase, color: 'text-emerald-400', avgSalary: '2.400 - 3.400€', demandLevel: 'medium' },
  { id: 'it_technik', icon: Monitor, color: 'text-cyan-400', avgSalary: '3.200 - 5.000€', demandLevel: 'high' },
  { id: 'bau_architektur', icon: HardHat, color: 'text-amber-400', avgSalary: '2.600 - 4.000€', demandLevel: 'high' },
  { id: 'landwirtschaft', icon: Tractor, color: 'text-green-400', avgSalary: '2.200 - 2.800€', demandLevel: 'medium' },
  { id: 'bildung_soziales', icon: GraduationCap, color: 'text-indigo-400', avgSalary: '2.800 - 4.200€', demandLevel: 'high' },
]

const demandColors = {
  high: 'text-green-400 bg-green-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-gray-400 bg-gray-400/10'
}

export default function BranchenPage() {
  const t = useTranslations('industriesPage')
  const [expandedIndustry, setExpandedIndustry] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
          <div className="max-w-4xl mx-auto text-center">
            <Link href="/bewerbungstipps" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backLink')}
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </section>

        {/* Stats Overview */}
        <section className="py-8 px-4 border-b border-gray-800">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card text-center">
                <MapPin className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">30 km</p>
                <p className="text-sm text-gray-400">{t('stats.radius')}</p>
              </div>
              <div className="card text-center">
                <Users className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">~165.000</p>
                <p className="text-sm text-gray-400">{t('stats.population')}</p>
              </div>
              <div className="card text-center">
                <TrendingUp className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">11</p>
                <p className="text-sm text-gray-400">{t('stats.industries')}</p>
              </div>
              <div className="card text-center">
                <Euro className="w-6 h-6 text-brand-red mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">~2.800€</p>
                <p className="text-sm text-gray-400">{t('stats.average')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Industries List */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {industryConfigs.map((industry) => {
              const Icon = industry.icon
              const isExpanded = expandedIndustry === industry.id
              const demandColor = demandColors[industry.demandLevel]
              const jobs = t.raw(`data.${industry.id}.jobs`) as string[]
              const requirements = t.raw(`data.${industry.id}.requirements`) as string[]

              return (
                <div key={industry.id} className="card overflow-hidden">
                  {/* Header - Always visible */}
                  <button
                    onClick={() => setExpandedIndustry(isExpanded ? null : industry.id)}
                    className="w-full flex items-center gap-4 p-2 text-left"
                  >
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center bg-gray-800`}>
                      <Icon className={`w-6 h-6 ${industry.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-semibold text-white">{t(`data.${industry.id}.name`)}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${demandColor}`}>
                          {t(`demand.${industry.demandLevel}`)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {t('salaryLabel')}: {industry.avgSalary} {t('salaryUnit')}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-2 pb-2 pt-4 border-t border-gray-700 mt-4">
                      <p className="text-gray-300 mb-6">{t(`data.${industry.id}.description`)}</p>

                      <div className="grid md:grid-cols-2 gap-6">
                        {/* Typical Jobs */}
                        <div>
                          <h4 className="text-white font-medium mb-3">{t('typicalJobs')}</h4>
                          <ul className="space-y-2">
                            {jobs.map((job) => (
                              <li key={job} className="flex items-center text-gray-400">
                                <ArrowRight className="w-4 h-4 text-brand-red mr-2 flex-shrink-0" />
                                {job}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Requirements */}
                        <div>
                          <h4 className="text-white font-medium mb-3">{t('requirements')}</h4>
                          <ul className="space-y-2">
                            {requirements.map((req) => (
                              <li key={req} className="flex items-center text-gray-400">
                                <ArrowRight className="w-4 h-4 text-brand-red mr-2 flex-shrink-0" />
                                {req}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Outlook & Local Info */}
                      <div className="mt-6 space-y-4">
                        <div className="bg-brand-dark rounded-lg p-4">
                          <h4 className="text-white font-medium mb-2">{t('outlook')}</h4>
                          <p className="text-gray-400 text-sm">{t(`data.${industry.id}.outlook`)}</p>
                        </div>
                        <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-4">
                          <h4 className="text-brand-red font-medium mb-2">{t('localInfo')}</h4>
                          <p className="text-gray-300 text-sm">{t(`data.${industry.id}.localInfo`)}</p>
                        </div>
                      </div>

                      {/* CTA */}
                      <div className="mt-6 pt-4 border-t border-gray-700">
                        <Link
                          href={`/jobs?industry=${industry.id}`}
                          className="btn-primary inline-flex items-center"
                        >
                          {t('findJobs', { industry: t(`data.${industry.id}.name`) })}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-brand-dark-lighter">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-gray-400 mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/jobs" className="btn-primary inline-flex items-center justify-center">
                {t('cta.browseJobs')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link href="/bewerbungstipps/lebenslauf" className="btn-secondary inline-flex items-center justify-center">
                {t('cta.resumeCheck')}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
