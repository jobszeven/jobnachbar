import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Sparkles, ArrowRight, Crown, FileText, PenTool, Users, DollarSign } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Premium für Bewerber - JobNachbar',
  description: 'Unbegrenzter Zugang zu allen KI-Tools, PDF-Generator und mehr für nur 4,99€/Monat.',
}

const freeFeatures = [
  'Jobs suchen & bewerben',
  'Profil erstellen',
  'Lebenslauf hochladen',
  '1x Lebenslauf-Check/Monat',
  '1x Anschreiben-Check/Monat',
  '3 Interview-Fragen',
]

const premiumFeatures = [
  'Alles aus Kostenlos',
  'Unbegrenzt KI-Tools nutzen',
  'Lebenslauf-Generator mit PDF (3 Vorlagen)',
  'Anschreiben-Generator mit PDF',
  'Interview-Coach unbegrenzt',
  'Detaillierter Gehaltsvergleich',
  'Priority-Badge bei Bewerbungen',
  'Keine Werbung',
]

const tools = [
  { icon: FileText, name: 'Lebenslauf-Check', description: 'KI-Analyse & PDF-Generator' },
  { icon: PenTool, name: 'Anschreiben-Generator', description: 'Individuelle Anschreiben mit KI' },
  { icon: Users, name: 'Interview-Coach', description: 'Übungsfragen & Feedback' },
  { icon: DollarSign, name: 'Gehaltsrechner', description: 'Regionale Gehaltsdaten' },
]

export default function BewerberPreisePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
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
                      <Check className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" />
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
                      <Check className="w-5 h-5 text-brand-red mr-3 flex-shrink-0" />
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

        {/* Tools Showcase */}
        <section className="py-16 px-4 bg-brand-dark-lighter">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white text-center mb-12">
              Deine KI-Tools mit Premium
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <div key={tool.name} className="card text-center">
                  <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <tool.icon className="w-7 h-7 text-brand-red" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">{tool.name}</h3>
                  <p className="text-gray-400 text-sm">{tool.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
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
      </main>

      <Footer />
    </div>
  )
}
