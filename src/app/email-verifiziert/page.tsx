'use client'

import { Suspense, useEffect, useState, useRef, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Home, Briefcase, User, CreditCard, Loader2, AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import Logo from '@/components/Logo'
import { createClient } from '@/lib/supabase/client'

const isDev = process.env.NODE_ENV === 'development'

function EmailVerifiedContent() {
  const t = useTranslations('emailVerified')
  const searchParams = useSearchParams()

  const userType = searchParams.get('type') || 'applicant'
  const planFromUrl = searchParams.get('plan') || 'free'

  const [status, setStatus] = useState<'loading' | 'redirecting' | 'error' | 'ready'>('loading')
  const [error, setError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')
  const hasTriggeredCheckout = useRef(false)

  const isPaidPlan = planFromUrl === 'basic' || planFromUrl === 'premium'
  const isEmployerWithPaidPlan = isPaidPlan && userType === 'employer'

  const dashboardUrl = userType === 'employer'
    ? '/dashboard/arbeitgeber?welcome=true'
    : '/dashboard/bewerber?welcome=true'

  const triggerCheckout = useCallback(async () => {
    setStatus('redirecting')
    setDebugInfo('Starte Checkout-Prozess...')

    try {
      const supabase = createClient()

      // Single auth check with getUser (server-validated)
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('User error:', userError)
        setError('Du bist nicht eingeloggt. Bitte melde dich an und versuche es erneut.')
        setDebugInfo(userError?.message || 'Kein User gefunden')
        setStatus('error')
        return
      }

      setDebugInfo(`User: ${user.email}`)

      // Get company ID
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .select('id, company_name')
        .eq('auth_id', user.id)
        .single()

      if (companyError || !company) {
        console.error('Company error:', companyError)
        setError('Firmenprofil nicht gefunden. Bitte kontaktiere den Support.')
        setDebugInfo(companyError?.message || 'Keine Company für auth_id: ' + user.id)
        setStatus('error')
        return
      }

      setDebugInfo(`Company: ${company.company_name}, starte Stripe...`)

      // Create checkout session
      const priceId = planFromUrl === 'premium' ? 'premium_1' : 'basic_1'

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          companyId: company.id,
        }),
      })

      const data = await response.json()

      if (data.url) {
        setDebugInfo('Stripe URL erhalten, leite weiter...')
        window.location.href = data.url
      } else {
        setError(data.error || 'Stripe Checkout konnte nicht gestartet werden.')
        setDebugInfo(`Stripe-Fehler: ${data.error || 'Keine URL erhalten'}`)
        setStatus('error')
      }
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError('Ein unerwarteter Fehler ist aufgetreten.')
      setDebugInfo(`Exception: ${err.message}`)
      setStatus('error')
    }
  }, [planFromUrl])

  useEffect(() => {
    async function initializeCheckout() {
      // Wait for cookies to be properly set after redirect
      await new Promise(resolve => setTimeout(resolve, 1500))

      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        setDebugInfo(error?.message || 'Keine Session gefunden')
        setStatus('ready')
        return
      }

      setDebugInfo(`Session OK: ${user.email}`)

      // Auto-trigger checkout for paid employer plans
      if (isEmployerWithPaidPlan && !hasTriggeredCheckout.current) {
        hasTriggeredCheckout.current = true
        triggerCheckout()
      } else {
        setStatus('ready')
      }
    }

    initializeCheckout()
  }, [isEmployerWithPaidPlan, triggerCheckout])

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-brand-red mx-auto mb-4" />
          <p className="text-gray-400">Verifizierung wird abgeschlossen...</p>
          {isDev && debugInfo && <p className="text-xs text-gray-600 mt-2">{debugInfo}</p>}
        </div>
      </div>
    )
  }

  // Redirecting to Stripe state
  if (status === 'redirecting') {
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
            <div className="w-24 h-24 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-14 h-14 text-brand-emerald" />
            </div>

            <h1 className="text-3xl font-bold text-white mb-4">
              E-Mail bestätigt!
            </h1>

            <div className="card">
              <div className="flex flex-col items-center py-8">
                <Loader2 className="w-12 h-12 animate-spin text-brand-red mb-4" />
                <p className="text-white font-semibold text-lg mb-2">
                  Weiterleitung zur Zahlung...
                </p>
                <p className="text-gray-400 mb-4">
                  Du wirst zu Stripe weitergeleitet, um dein {planFromUrl === 'premium' ? 'Premium' : 'Basic'} Abo ({planFromUrl === 'premium' ? '79€' : '39€'}/Monat) zu aktivieren.
                </p>
                {isDev && debugInfo && (
                  <p className="text-xs text-gray-500 mt-2">{debugInfo}</p>
                )}
              </div>
            </div>

            <p className="mt-6 text-gray-500 text-sm">
              <Link href={dashboardUrl} className="text-brand-red hover:underline">
                Überspringen und später zahlen
              </Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Error state or ready state
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
          <div className="w-24 h-24 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-14 h-14 text-brand-emerald" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4">
            {t('title')}
          </h1>

          <p className="text-xl text-gray-300 mb-2">
            {t('subtitle')}
          </p>
          <p className="text-gray-400 mb-8">
            {t('description')}
          </p>

          <div className="card">
            {/* Error display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-red-400 font-medium">{error}</p>
                    {isDev && debugInfo && (
                      <p className="text-red-400/70 text-xs mt-1">{debugInfo}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {/* For paid plans - show checkout button */}
              {isEmployerWithPaidPlan && (
                <>
                  <button
                    onClick={() => {
                      hasTriggeredCheckout.current = false
                      triggerCheckout()
                    }}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    {planFromUrl === 'premium' ? 'Premium' : 'Basic'} Abo aktivieren ({planFromUrl === 'premium' ? '79€' : '39€'}/Monat)
                  </button>

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <span className="text-gray-500 text-sm">{t('or')}</span>
                    <div className="flex-1 h-px bg-gray-700"></div>
                  </div>

                  <Link
                    href={dashboardUrl}
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Briefcase className="w-5 h-5" />
                    Erstmal mit Starter starten (kostenlos)
                  </Link>
                </>
              )}

              {/* For free plans or applicants */}
              {!isEmployerWithPaidPlan && (
                <>
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

                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <span className="text-gray-500 text-sm">{t('or')}</span>
                    <div className="flex-1 h-px bg-gray-700"></div>
                  </div>

                  <Link
                    href="/"
                    className="btn-secondary w-full flex items-center justify-center gap-2"
                  >
                    <Home className="w-5 h-5" />
                    {t('toHome')}
                  </Link>
                </>
              )}
            </div>

            <div className="mt-6 p-4 bg-brand-emerald/10 border border-brand-emerald/30 rounded-lg">
              <p className="text-sm text-gray-300">
                <span className="text-brand-emerald font-medium">{t('tip')}</span>{' '}
                {userType === 'employer' ? t('tipEmployer') : t('tipApplicant')}
              </p>
            </div>
          </div>

          <p className="mt-8 text-gray-500 text-sm">
            {t('thankYou')}
          </p>

          {/* Debug info only in development */}
          {isDev && (
            <div className="mt-4 text-xs text-gray-600">
              Plan: {planFromUrl} | Type: {userType} | Status: {status}
            </div>
          )}
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
