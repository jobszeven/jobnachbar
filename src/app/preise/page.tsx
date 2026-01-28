'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowRight, HelpCircle, X, Zap, TrendingUp, Clock, Users, Shield, Crown, Sparkles, Building2, User } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslations } from 'next-intl'

type Tab = 'arbeitgeber' | 'bewerber'

export default function PreisePage() {
  const t = useTranslations('pricingPage')
  const [activeTab, setActiveTab] = useState<Tab>('arbeitgeber')

  const freeFeatures = t.raw('applicant.free.features') as string[]
  const premiumFeatures = t.raw('applicant.premium.features') as string[]

  const spotsTotal = 50
  const spotsTaken = 34
  const spotsLeft = spotsTotal - spotsTaken
  const percentageFilled = (spotsTaken / spotsTotal) * 100

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Tab Selector */}
      <div className="border-b border-gray-800 bg-brand-dark sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex">
            <button
              onClick={() => setActiveTab('arbeitgeber')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'arbeitgeber'
                  ? 'text-brand-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Für Arbeitgeber
              {activeTab === 'arbeitgeber' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('bewerber')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
                activeTab === 'bewerber'
                  ? 'text-brand-red'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              Für Bewerber
              {activeTab === 'bewerber' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-red" />
              )}
            </button>
          </div>
        </div>
      </div>

      {activeTab === 'arbeitgeber' ? (
        // Employer Pricing
        <>
          {/* Launch Banner */}
          <div className="bg-gradient-to-r from-brand-red to-orange-500 py-3 px-4">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-center">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="font-bold text-white">STARTANGEBOT</span>
              </div>
              <span className="text-white/90">
                60% Rabatt für die ersten {spotsTotal} Unternehmen – nur noch <strong>{spotsLeft} Plätze</strong> verfügbar!
              </span>
            </div>
          </div>

          {/* Hero */}
          <div className="text-center py-12 md:py-16 px-4">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Faire Preise für regionale Unternehmen
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              Keine versteckten Kosten. Keine Provision auf Gehälter.
            </p>

            {/* Scarcity Bar */}
            <div className="max-w-md mx-auto mt-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Startangebot-Plätze</span>
                <span className="text-brand-red font-semibold">{spotsTaken} von {spotsTotal} vergeben</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-red to-red-400 rounded-full" style={{ width: `${percentageFilled}%` }} />
              </div>
              <p className="text-sm text-gray-500 mt-2">Diese Preise gelten nur während der Startphase!</p>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="max-w-6xl mx-auto px-4 pb-16">
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">

              {/* Starter */}
              <div className="card border-gray-700">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Starter</h2>
                  <p className="text-gray-400">Zum Ausprobieren</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-white">0€</span>
                    <span className="text-gray-400">/Monat</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">1 Stellenanzeige online</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">Bewerbungen ansehen (Vorschau)</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">Kontaktdaten freischalten: <strong className="text-white">9,90€</strong> pro Bewerber</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">E-Mail wenn sich jemand bewirbt</span></li>
                </ul>

                <Link href="/registrieren/arbeitgeber?plan=free" className="block w-full text-center py-3 px-4 border-2 border-gray-600 text-white rounded-lg hover:border-gray-500 transition-colors">
                  Kostenlos starten
                </Link>
              </div>

              {/* Basic - Popular */}
              <div className="card border-brand-red relative md:scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-red text-white text-sm font-bold px-4 py-1 rounded-full">Beliebt</span>
                </div>

                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Basic</h2>
                  <p className="text-gray-400">Für aktive Suche</p>
                  <div className="mt-6">
                    <span className="text-gray-500 line-through text-lg">99€</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold text-white">39€</span>
                      <span className="text-gray-400">/Monat</span>
                    </div>
                    <span className="inline-block mt-2 bg-brand-red/20 text-brand-red text-sm font-semibold px-3 py-1 rounded-full">60% RABATT</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-6">
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300"><strong className="text-white">5</strong> Stellenanzeigen gleichzeitig</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300"><strong className="text-white">10</strong> Kontakte pro Monat inklusive</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">Weitere Kontakte: <strong className="text-white">4,90€</strong></span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">Wir finden passende Bewerber für dich</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">1x Anzeige ganz oben zeigen (pro Monat)</span></li>
                </ul>

                {/* Upsells */}
                <div className="border-t border-gray-700 pt-4 mb-6 text-sm">
                  <p className="text-gray-400 mb-2">Optional dazu buchen:</p>
                  <div className="flex justify-between text-gray-400"><span>Anzeige nochmal oben zeigen</span><span className="text-white">+29€</span></div>
                  <div className="flex justify-between text-gray-400"><span>In Facebook-Gruppe posten</span><span className="text-white">+49€</span></div>
                </div>

                <Link href="/registrieren/arbeitgeber?plan=basic" className="btn-primary w-full text-center block">Basic wählen</Link>
              </div>

              {/* Premium */}
              <div className="card border-yellow-500/30 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-yellow-500/20 text-yellow-400 text-sm font-bold px-4 py-1 rounded-full">Alles drin</span>
                </div>

                <div className="text-center mb-8 pt-2">
                  <h2 className="text-2xl font-bold text-white mb-2">Premium</h2>
                  <p className="text-gray-400">Maximale Reichweite</p>
                  <div className="mt-6">
                    <span className="text-gray-500 line-through text-lg">199€</span>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-5xl font-bold text-white">79€</span>
                      <span className="text-gray-400">/Monat</span>
                    </div>
                    <span className="inline-block mt-2 bg-yellow-500/20 text-yellow-400 text-sm font-semibold px-3 py-1 rounded-full">60% RABATT</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300"><strong className="text-white">Unbegrenzt</strong> Stellenanzeigen</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300"><strong className="text-white">Unbegrenzt</strong> Bewerber kontaktieren</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">Alle Anzeigen immer ganz oben</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">2x Facebook-Posting pro Monat</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">WhatsApp-Benachrichtigungen</span></li>
                  <li className="flex items-start"><CheckCircle className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" /><span className="text-gray-300">Persönlicher Ansprechpartner</span></li>
                </ul>

                <Link href="/registrieren/arbeitgeber?plan=premium" className="block w-full text-center py-3 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-brand-dark font-semibold rounded-lg hover:from-yellow-400 hover:to-orange-400 transition-colors">Premium wählen</Link>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="mt-16">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Warum woanders 10x mehr zahlen?</h2>
                <p className="text-gray-400">Spare bis zu <strong className="text-brand-red">€6.720/Jahr</strong> im Vergleich zu StepStone</p>
              </div>

              <div className="overflow-x-auto -mx-4 px-4">
                <table className="w-full min-w-[700px] text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-2 text-gray-400 font-medium">Was du bekommst</th>
                      <th className="py-3 px-2 text-brand-red font-bold">JobNachbar</th>
                      <th className="py-3 px-2 text-gray-400">StepStone</th>
                      <th className="py-3 px-2 text-gray-400">Indeed</th>
                      <th className="py-3 px-2 text-gray-400">Arbeitsagentur</th>
                      <th className="py-3 px-2 text-gray-400">meinestadt.de</th>
                    </tr>
                  </thead>
                  <tbody className="text-center">
                    <tr className="border-b border-gray-800">
                      <td className="text-left py-3 px-2 text-gray-300">Preis/Monat</td>
                      <td className="py-3 px-2 text-brand-red font-bold">ab 39€</td>
                      <td className="py-3 px-2 text-gray-400">599€+</td>
                      <td className="py-3 px-2 text-gray-400">350€+</td>
                      <td className="py-3 px-2 text-gray-400">0€</td>
                      <td className="py-3 px-2 text-gray-400">299€+</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="text-left py-3 px-2 text-gray-300">Nur lokale Bewerber</td>
                      <td className="py-3 px-2"><CheckCircle className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><CheckCircle className="w-4 h-4 text-green-400 mx-auto" /></td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="text-left py-3 px-2 text-gray-300">Wir finden Bewerber für dich</td>
                      <td className="py-3 px-2"><CheckCircle className="w-4 h-4 text-green-400 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                      <td className="py-3 px-2 text-gray-500 text-xs">Schlecht</td>
                      <td className="py-3 px-2"><X className="w-4 h-4 text-gray-600 mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="text-left py-3 px-2 text-gray-300">Wie schnell online?</td>
                      <td className="py-3 px-2 text-brand-red font-semibold">&lt;24 Stunden</td>
                      <td className="py-3 px-2 text-gray-400">2-3 Tage</td>
                      <td className="py-3 px-2 text-gray-400">1-2 Tage</td>
                      <td className="py-3 px-2 text-gray-400">Langsam</td>
                      <td className="py-3 px-2 text-gray-400">1-2 Tage</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Trust Signals */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">Daten in Deutschland</p>
                <p className="text-gray-400 text-xs md:text-sm">DSGVO-konform</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">Jederzeit kündbar</p>
                <p className="text-gray-400 text-xs md:text-sm">Keine Mindestlaufzeit</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">100% Regional</p>
                <p className="text-gray-400 text-xs md:text-sm">Nur lokale Bewerber</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="w-6 h-6 text-brand-red" />
                </div>
                <p className="text-white font-semibold text-sm md:text-base">Faire Preise</p>
                <p className="text-gray-400 text-xs md:text-sm">Keine versteckten Kosten</p>
              </div>
            </div>

            {/* FAQ */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-white text-center mb-8">Häufige Fragen</h2>
              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div className="card">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">Wie lange gilt der Rabatt?</h3>
                      <p className="text-gray-400 text-sm">Der 60% Rabatt gilt für die ersten 50 Unternehmen. Wer jetzt bucht, behält den Preis dauerhaft – solange du Kunde bleibst.</p>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-brand-red flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-white font-semibold mb-2">Kann ich jederzeit kündigen?</h3>
                      <p className="text-gray-400 text-sm">Ja, du kannst dein Abo jederzeit zum Monatsende kündigen. Keine Mindestlaufzeit, kein Kleingedrucktes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-16 text-center card bg-gradient-to-r from-brand-red/20 to-orange-500/20 border-brand-red">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Nur noch {spotsLeft} Plätze zum Startpreis!</h2>
              <p className="text-gray-300 mb-6">60% Rabatt – dauerhaft, solange du Kunde bleibst.</p>
              <Link href="/registrieren/arbeitgeber?plan=basic" className="btn-primary inline-flex items-center text-lg px-8 py-4">
                Jetzt Startpreis sichern
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </>
      ) : (
        // Applicant Pricing
        <>
          {/* Hero Section */}
          <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-6">
                <Crown className="w-4 h-4 text-brand-red mr-2" />
                <span className="text-brand-red text-sm font-medium">Premium für Bewerber</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Hol dir den Vorsprung
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Mit JobNachbar Premium bekommst du unbegrenzten Zugang zu allen KI-Tools
                und erhöhst deine Chancen auf deinen Traumjob.
              </p>
            </div>
          </section>

          {/* Pricing Cards */}
          <section className="py-16 px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-2">Kostenlos</h2>
                  <p className="text-gray-400 text-sm mb-6">Für den Einstieg</p>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">0€</span>
                    <span className="text-gray-400">/Monat</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {freeFeatures.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-300">
                        <CheckCircle className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/registrieren/bewerber" className="btn-secondary w-full text-center">
                    Kostenlos starten
                  </Link>
                </div>

                {/* Premium Plan */}
                <div className="card relative border-brand-red/50 bg-gradient-to-br from-brand-dark-card to-brand-red/5">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-brand-red text-white text-sm font-bold px-4 py-1 rounded-full">
                      EMPFOHLEN
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2 flex items-center">
                    <Sparkles className="w-5 h-5 text-brand-red mr-2" />
                    Premium
                  </h2>
                  <p className="text-gray-400 text-sm mb-6">Für maximale Chancen</p>
                  <div className="mb-2">
                    <span className="text-4xl font-bold text-white">4,99€</span>
                    <span className="text-gray-400">/Monat</span>
                  </div>
                  <p className="text-brand-red text-sm mb-6">oder 29€/Jahr (spar 50%)</p>
                  <ul className="space-y-3 mb-8">
                    {premiumFeatures.map((feature) => (
                      <li key={feature} className="flex items-start text-gray-300">
                        <CheckCircle className="w-5 h-5 text-brand-red mr-3 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link href="/premium/checkout" className="btn-primary w-full text-center">
                    Premium werden
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="py-16 px-4 bg-brand-dark-lighter">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold text-white text-center mb-12">
                Häufige Fragen
              </h2>
              <div className="space-y-4">
                <div className="card">
                  <h3 className="font-semibold text-white mb-2">Wie kann ich bezahlen?</h3>
                  <p className="text-gray-400">
                    Du erhältst eine Rechnung per E-Mail und kannst bequem per Überweisung bezahlen.
                    Nach Zahlungseingang wird dein Premium-Status automatisch aktiviert.
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-white mb-2">Kann ich jederzeit kündigen?</h3>
                  <p className="text-gray-400">
                    Ja, du kannst jederzeit zum Ende des Abrechnungszeitraums kündigen.
                    Eine kurze E-Mail an info@jobnachbar.com genügt.
                  </p>
                </div>
                <div className="card">
                  <h3 className="font-semibold text-white mb-2">Was passiert mit meinen Daten?</h3>
                  <p className="text-gray-400">
                    Deine Daten werden DSGVO-konform in Deutschland gespeichert.
                    Bei Kündigung kannst du alle Daten löschen lassen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-16 px-4 bg-gradient-to-r from-brand-red to-brand-red-dark">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Starte jetzt mit Premium
              </h2>
              <p className="text-white/80 mb-8 text-lg">
                Nutze alle KI-Tools unbegrenzt und erhöhe deine Jobchancen.
              </p>
              <Link href="/premium/checkout" className="btn-white inline-flex items-center">
                Für 4,99€/Monat starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  )
}
