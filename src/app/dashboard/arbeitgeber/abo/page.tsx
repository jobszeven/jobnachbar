'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, CheckCircle, Zap, Star, ArrowRight, Loader2, Crown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const PLAN_DETAILS = {
  free: { name: 'Starter', price: 0, stellen: 1, kontakte: 3 },
  basic: { name: 'Basic', price: 39, stellen: 5, kontakte: 10 },
  premium: { name: 'Premium', price: 79, stellen: 'Unbegrenzt', kontakte: 'Unbegrenzt' },
}

export default function ArbeitgeberAbo() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [company, setCompany] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadCompany()
  }, [])

  async function loadCompany() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    const { data: companyData } = await supabase
      .from('companies')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    setCompany(companyData)
    setLoading(false)
  }

  const handleUpgrade = async (plan: 'basic' | 'premium') => {
    if (!company) return

    setCheckoutLoading(plan)
    setError('')

    try {
      const priceId = plan === 'premium' ? 'premium_1' : 'basic_1'

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          userId: company.auth_id,
          companyId: company.id,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Checkout fehlgeschlagen')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCheckoutLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-red" />
      </div>
    )
  }

  const currentPlan = company?.subscription_tier || 'free'
  const current = PLAN_DETAILS[currentPlan as keyof typeof PLAN_DETAILS]
  const expiresAt = company?.subscription_expires
    ? new Date(company.subscription_expires).toLocaleDateString('de-DE')
    : null

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard/arbeitgeber" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Abo verwalten</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Current Plan */}
        <div className={`card mb-8 ${currentPlan === 'premium' ? 'border-yellow-500/50' : 'border-brand-red'}`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className={`badge mb-2 ${currentPlan === 'premium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-brand-red/20 text-brand-red'}`}>
                Aktueller Plan
              </span>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {current.name}
                {currentPlan === 'premium' && <Crown className="w-6 h-6 text-yellow-400" />}
              </h2>
              <p className="text-gray-400">
                {current.price === 0 ? 'Kostenlos' : `${current.price}€/Monat`} •
                {typeof current.stellen === 'number' ? ` ${current.stellen} Stelle(n)` : ' Unbegrenzt Stellen'} •
                {typeof current.kontakte === 'number' ? ` ${current.kontakte} Kontakte/Monat` : ' Unbegrenzt Kontakte'}
              </p>
            </div>
            {expiresAt && currentPlan !== 'free' && (
              <div className="text-right">
                <p className="text-gray-400 text-sm">Gültig bis</p>
                <p className="text-white font-semibold">{expiresAt}</p>
              </div>
            )}
          </div>
        </div>

        {/* Upgrade Options */}
        {currentPlan !== 'premium' && (
          <>
            <h2 className="text-xl font-semibold text-white mb-4">Upgrade-Optionen</h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Basic Upgrade (only for free users) */}
              {currentPlan === 'free' && (
                <div className="card border-brand-red/30 hover:border-brand-red/50 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <Zap className="w-8 h-8 text-brand-red mb-2" />
                      <h3 className="text-xl font-semibold text-white">Basic</h3>
                      <p className="text-gray-400">Für wachsende Unternehmen</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">39€<span className="text-gray-400 text-sm">/Monat</span></p>
                    </div>
                  </div>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-red mr-2" />
                      5 Stellenanzeigen
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-red mr-2" />
                      10 Kontakte/Monat
                    </li>
                    <li className="flex items-center text-gray-300 text-sm">
                      <CheckCircle className="w-4 h-4 text-brand-red mr-2" />
                      KI-Matching
                    </li>
                  </ul>
                  <button
                    onClick={() => handleUpgrade('basic')}
                    disabled={checkoutLoading !== null}
                    className="w-full py-3 bg-brand-red text-white font-semibold rounded-lg hover:bg-brand-red-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {checkoutLoading === 'basic' ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Auf Basic upgraden
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Premium Upgrade */}
              <div className="card border-yellow-500/30 hover:border-yellow-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Star className="w-8 h-8 text-yellow-400 mb-2" />
                    <h3 className="text-xl font-semibold text-white">Premium</h3>
                    <p className="text-gray-400">Für maximale Reichweite</p>
                  </div>
                  <div className="text-right">
                    <span className="text-gray-500 line-through text-sm">199€</span>
                    <p className="text-2xl font-bold text-white">79€<span className="text-gray-400 text-sm">/Monat</span></p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2" />
                    Unbegrenzt Stellenanzeigen
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2" />
                    Unbegrenzt Kontakte
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2" />
                    WhatsApp-Alerts
                  </li>
                  <li className="flex items-center text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-yellow-400 mr-2" />
                    Premium Support
                  </li>
                </ul>
                <button
                  onClick={() => handleUpgrade('premium')}
                  disabled={checkoutLoading !== null}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-brand-dark font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {checkoutLoading === 'premium' ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Auf Premium upgraden
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}

        {/* Premium Badge for premium users */}
        {currentPlan === 'premium' && (
          <div className="card bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-yellow-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">Du hast den besten Plan!</h3>
                <p className="text-gray-400">Genieße unbegrenzte Stellenanzeigen und Kontakte.</p>
              </div>
            </div>
          </div>
        )}

        {/* Cancel */}
        {currentPlan !== 'free' && (
          <div className="mt-8 text-center">
            <button className="text-gray-400 hover:text-red-400 text-sm transition-colors">
              Abo kündigen
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
