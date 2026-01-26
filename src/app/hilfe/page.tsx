'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Search, User, Building2, MessageSquare, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface GuideItem {
  title: string
  description: string
  content: string[]
}

function AccordionItem({ guide }: { guide: GuideItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-dark-lighter transition-colors"
      >
        <div>
          <h3 className="font-semibold text-white">{guide.title}</h3>
          <p className="text-gray-400 text-sm">{guide.description}</p>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-brand-red flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-700 pt-4">
          <ul className="space-y-2 text-gray-300">
            {guide.content.map((item, idx) => (
              <li key={idx} className="text-sm">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default function HilfePage() {
  const t = useTranslations('help')

  const applicantGuideKeys = ['account', 'profile', 'findJobs', 'aiTools', 'premium', 'privacy'] as const
  const employerGuideKeys = ['companyProfile', 'createJob', 'manageApplications', 'subscription'] as const

  const applicantGuides: GuideItem[] = applicantGuideKeys.map((key) => ({
    title: t(`applicantGuides.${key}.title`),
    description: t(`applicantGuides.${key}.description`),
    content: t.raw(`applicantGuides.${key}.content`) as string[],
  }))

  const employerGuides: GuideItem[] = employerGuideKeys.map((key) => ({
    title: t(`employerGuides.${key}.title`),
    description: t(`employerGuides.${key}.description`),
    content: t.raw(`employerGuides.${key}.content`) as string[],
  }))

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('title')}
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              {t('subtitle')}
            </p>

            {/* Search Bar (Visual) */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  className="input-field pl-12"
                  disabled
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 px-4 bg-brand-dark-lighter">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/faq" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                FAQ
              </Link>
              <Link href="/kontakt" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                {t('contactUs')}
              </Link>
              <Link href="/ueber-uns" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                {t('aboutUs')}
              </Link>
              <Link href="/datenschutz" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                {t('dataProtection')}
              </Link>
            </div>
          </div>
        </section>

        {/* For Applicants */}
        <section className="py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <User className="w-6 h-6 mr-3 text-brand-red" />
              {t('forApplicants')}
            </h2>

            <div className="space-y-4">
              {applicantGuides.map((guide) => (
                <AccordionItem key={guide.title} guide={guide} />
              ))}
            </div>
          </div>
        </section>

        {/* For Employers */}
        <section className="py-12 px-4 bg-brand-dark-lighter">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-brand-red" />
              {t('forEmployers')}
            </h2>

            <div className="space-y-4">
              {employerGuides.map((guide) => (
                <AccordionItem key={guide.title} guide={guide} />
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card text-center">
              <MessageSquare className="w-12 h-12 text-brand-red mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                {t('notFound')}
              </h2>
              <p className="text-gray-400 mb-6">
                {t('supportMessage')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kontakt" className="btn-primary inline-flex items-center justify-center">
                  {t('contactUs')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/faq" className="btn-secondary inline-flex items-center justify-center">
                  {t('browseFaq')}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
