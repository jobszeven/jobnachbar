'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle, Zap, Star, ArrowRight } from 'lucide-react'

export default function ArbeitgeberAbo() {
  // Mock data - würde normalerweise aus der Datenbank kommen
  const currentPlan = 'basic'
  const planDetails = {
    free: { name: 'Starter', price: 0, stellen: 1, kontakte: 0 },
    basic: { name: 'Basic', price: 39, stellen: 5, kontakte: 10 },
    premium: { name: 'Premium', price: 79, stellen: 'Unbegrenzt', kontakte: 'Unbegrenzt' },
  }
  const current = planDetails[currentPlan as keyof typeof planDetails]

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard/arbeitgeber" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Abo verwalten</h1>

        {/* Current Plan */}
        <div className="card border-brand-red mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="badge bg-brand-red/20 text-brand-red mb-2">Aktueller Plan</span>
              <h2 className="text-2xl font-bold text-white">{current.name}</h2>
              <p className="text-gray-400">
                {current.price === 0 ? 'Kostenlos' : `${current.price}€/Monat`} • 
                {typeof current.stellen === 'number' ? ` ${current.stellen} Stelle(n)` : ' Unbegrenzt Stellen'} • 
                {typeof current.kontakte === 'number' ? ` ${current.kontakte} Kontakte/Monat` : ' Unbegrenzt Kontakte'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-400 text-sm">Nächste Abrechnung</p>
              <p className="text-white font-semibold">24. Februar 2026</p>
            </div>
          </div>
        </div>

        {/* Usage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <p className="text-3xl font-bold text-white">1</p>
            <p className="text-gray-400 text-sm">von 5 Stellen</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-white">3</p>
            <p className="text-gray-400 text-sm">von 10 Kontakten</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-white">0</p>
            <p className="text-gray-400 text-sm">von 1 Highlight</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-white">15</p>
            <p className="text-gray-400 text-sm">Tage übrig</p>
          </div>
        </div>

        {/* Upgrade Options */}
        <h2 className="text-xl font-semibold text-white mb-4">Upgrade-Optionen</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {currentPlan === 'basic' && (
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
              </ul>
              <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-brand-dark font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors flex items-center justify-center gap-2">
                Auf Premium upgraden
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Upsells */}
          <div className="card">
            <Zap className="w-8 h-8 text-brand-red mb-2" />
            <h3 className="text-xl font-semibold text-white mb-2">Einzel-Extras</h3>
            <p className="text-gray-400 mb-4">Ohne Plan-Wechsel einzeln hinzubuchen</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-brand-dark rounded-lg">
                <span className="text-gray-300">⭐ Highlight-Platzierung</span>
                <span className="text-white font-semibold">29€</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-dark rounded-lg">
                <span className="text-gray-300">🚀 Social Media Boost</span>
                <span className="text-white font-semibold">49€</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-dark rounded-lg">
                <span className="text-gray-300">📧 Extra 10 Kontakte</span>
                <span className="text-white font-semibold">39€</span>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <h2 className="text-xl font-semibold text-white mb-4">Rechnungen</h2>
        <div className="card">
          <div className="space-y-4">
            {[
              { date: '24.01.2026', amount: '39,00€', status: 'Bezahlt' },
              { date: '24.12.2025', amount: '39,00€', status: 'Bezahlt' },
            ].map((invoice, i) => (
              <div key={i} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-0">
                <div>
                  <p className="text-white">Rechnung vom {invoice.date}</p>
                  <p className="text-gray-400 text-sm">Basic Plan - Monatlich</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{invoice.amount}</p>
                  <span className="badge bg-green-500/20 text-green-400 text-xs">{invoice.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel */}
        <div className="mt-8 text-center">
          <button className="text-gray-400 hover:text-red-400 text-sm transition-colors">
            Abo kündigen
          </button>
        </div>
      </div>
    </div>
  )
}
