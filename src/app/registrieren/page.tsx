'use client'

import Link from 'next/link'
import { User, Building2, ArrowRight } from 'lucide-react'
import Logo from '@/components/Logo'
import { useTranslations } from 'next-intl'

export default function Registrieren() {
  const t = useTranslations('register')

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-brand-dark sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              {t('alreadyRegistered')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="max-w-3xl w-full">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t('chooseAccountType')}
            </h1>
            <p className="text-gray-400 text-lg">
              {t('chooseAccountTypeSubtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Job Seeker Option */}
            <Link
              href="/registrieren/bewerber"
              className="card group hover:border-brand-red transition-all hover:-translate-y-1"
            >
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-blue/30 transition-colors">
                  <User className="w-10 h-10 text-brand-red" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('applicant.title')}</h2>
                <p className="text-gray-400 mb-6">
                  {t('applicant.description')}
                </p>
                <ul className="text-left text-gray-400 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full mr-2" />
                    {t('applicant.benefit1')}
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full mr-2" />
                    {t('applicant.benefit2')}
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full mr-2" />
                    {t('applicant.benefit3')}
                  </li>
                </ul>
                <span className="btn-primary inline-flex items-center group-hover:bg-brand-cyan transition-colors">
                  {t('applicant.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </div>
            </Link>

            {/* Employer Option */}
            <Link
              href="/registrieren/arbeitgeber"
              className="card group hover:border-brand-emerald transition-all hover:-translate-y-1"
            >
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-brand-emerald/30 transition-colors">
                  <Building2 className="w-10 h-10 text-brand-emerald" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">{t('employer.title')}</h2>
                <p className="text-gray-400 mb-6">
                  {t('employer.description')}
                </p>
                <ul className="text-left text-gray-400 space-y-2 mb-6">
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full mr-2" />
                    {t('employer.benefit1')}
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full mr-2" />
                    {t('employer.benefit2')}
                  </li>
                  <li className="flex items-center">
                    <span className="w-1.5 h-1.5 bg-brand-emerald rounded-full mr-2" />
                    {t('employer.benefit3')}
                  </li>
                </ul>
                <span className="btn-primary inline-flex items-center bg-brand-emerald hover:bg-emerald-400 transition-colors">
                  {t('employer.cta')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              </div>
            </Link>
          </div>

          <p className="text-center text-gray-500 mt-8">
            {t('canAddOtherAccountLater')}
          </p>
        </div>
      </div>
    </div>
  )
}
