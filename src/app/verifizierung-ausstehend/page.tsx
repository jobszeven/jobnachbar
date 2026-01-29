'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'

function VerificationPendingContent() {
  const t = useTranslations('verification')
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [resendCooldown, setResendCooldown] = useState(0)
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResend = async () => {
    if (resendCooldown > 0 || !email) return

    setResendStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || t('errors.resendFailed'))
      }

      setResendStatus('sent')
      setResendCooldown(60)

      // Reset status after 5 seconds
      setTimeout(() => setResendStatus('idle'), 5000)
    } catch (err: any) {
      setResendStatus('error')
      setErrorMessage(err.message)
    }
  }

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
          <div className="w-20 h-20 bg-brand-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-brand-blue" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{t('title')}</h1>
          <p className="text-gray-400 mb-2">{t('subtitle')}</p>

          {email && (
            <p className="text-brand-blue font-medium mb-6">{email}</p>
          )}

          <div className="card text-left">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-emerald/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-emerald font-bold text-sm">1</span>
                </div>
                <p className="text-gray-300">{t('checkInbox')}</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-emerald/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-emerald font-bold text-sm">2</span>
                </div>
                <p className="text-gray-300">{t('clickLink')}</p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-brand-emerald/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-emerald font-bold text-sm">3</span>
                </div>
                <p className="text-gray-300">{t('startUsing')}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 mt-6 pt-6">
              <p className="text-sm text-gray-400 mb-4">{t('checkSpam')}</p>

              {resendStatus === 'sent' && (
                <div className="flex items-center gap-2 text-brand-emerald mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>{t('resent')}</span>
                </div>
              )}

              {resendStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-400 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || resendStatus === 'sending' || !email}
                className="btn-primary w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendStatus === 'sending' ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    {t('sending')}
                  </>
                ) : resendCooldown > 0 ? (
                  t('resendCooldown', { seconds: resendCooldown })
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2" />
                    {t('resendButton')}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <p className="text-gray-400 text-sm">
              {t('wrongEmail')}{' '}
              <Link href="/registrieren" className="text-brand-red hover:underline">
                {t('registerAgain')}
              </Link>
            </p>
            <p className="text-gray-400 text-sm">
              {t('alreadyVerified')}{' '}
              <Link href="/login" className="text-brand-red hover:underline">
                {t('loginNow')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerificationPendingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-white">Laden...</div>
      </div>
    }>
      <VerificationPendingContent />
    </Suspense>
  )
}
