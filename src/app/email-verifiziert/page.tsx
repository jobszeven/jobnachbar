'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Home, LogIn, Briefcase, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'

function EmailVerifiedContent() {
  const t = useTranslations('emailVerified')
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'applicant'

  const dashboardUrl = userType === 'employer'
    ? '/dashboard/arbeitgeber?welcome=true'
    : '/dashboard/bewerber?welcome=true'

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      <nav className="border-b border-gray-800 bg-brand-dark sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-14 h-14 text-brand-emerald" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-white mb-4">
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-300 mb-2">
            {t('subtitle')}
          </p>
          <p className="text-gray-400 mb-8">
            {t('description')}
          </p>

          {/* Card with buttons */}
          <div className="card">
            <div className="space-y-4">
              {/* Dashboard Button */}
              <Link
                href={dashboardUrl}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {userType === 'employer' ? (
                  <>
                    <Briefcase className="w-5 h-5" />
                    {t('toDashboardEmployer')}
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5" />
                    {t('toDashboardApplicant')}
                  </>
                )}
              </Link>

              {/* Divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-700"></div>
                <span className="text-gray-500 text-sm">{t('or')}</span>
                <div className="flex-1 h-px bg-gray-700"></div>
              </div>

              {/* Home Button */}
              <Link
                href="/"
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                {t('toHome')}
              </Link>
            </div>

            {/* Info box */}
            <div className="mt-6 p-4 bg-brand-emerald/10 border border-brand-emerald/30 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="text-brand-emerald font-medium">{t('tip')}</span>{' '}
                {userType === 'employer' ? t('tipEmployer') : t('tipApplicant')}
              </p>
            </div>
          </div>

          {/* Footer text */}
          <p className="mt-8 text-gray-500 text-sm">
            {t('thankYou')}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EmailVerifiedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Laden...</p>
        </div>
      </div>
    }>
      <EmailVerifiedContent />
    </Suspense>
  )
}
