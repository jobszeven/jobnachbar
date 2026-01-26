'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import FAQAccordion from './FAQAccordion'

export default function FAQContent() {
  const t = useTranslations('faqPage')

  const applicantFaqKeys = ['free', 'region', 'howApply', 'uploadCv', 'premium', 'notifications', 'dataSafe'] as const
  const employerFaqKeys = ['cost', 'duration', 'multipleJobs', 'receiveApplications'] as const
  const generalFaqKeys = ['whoIsBehind', 'feedback', 'deleteAccount', 'mobileApp'] as const

  const applicantFaqs = applicantFaqKeys.map((key) => ({
    question: t(`applicant.${key}.question`),
    answer: t(`applicant.${key}.answer`),
  }))

  const employerFaqs = employerFaqKeys.map((key) => ({
    question: t(`employer.${key}.question`),
    answer: t(`employer.${key}.answer`),
  }))

  const generalFaqs = generalFaqKeys.map((key) => ({
    question: t(`general.${key}.question`),
    answer: t(`general.${key}.answer`),
  }))

  return (
    <main>
      {/* Hero Section */}
      <section className="py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-400">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* FAQ Sections */}
      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* For Applicants */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center mr-3 text-brand-red">
                1
              </span>
              {t('forApplicants')}
            </h2>
            <FAQAccordion items={applicantFaqs} />
          </div>

          {/* For Employers */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center mr-3 text-brand-red">
                2
              </span>
              {t('forEmployers')}
            </h2>
            <FAQAccordion items={employerFaqs} />
          </div>

          {/* General */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center mr-3 text-brand-red">
                3
              </span>
              {t('generalSection')}
            </h2>
            <FAQAccordion items={generalFaqs} />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="card text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              {t('stillQuestions')}
            </h2>
            <p className="text-gray-400 mb-6">
              {t('contactMessage')}
            </p>
            <Link href="/kontakt" className="btn-primary inline-flex items-center">
              {t('contactUs')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
