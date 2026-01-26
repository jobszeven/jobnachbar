import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Crown, Sparkles, FileText, MessageSquare, Euro, Zap, Star, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Premium - Unbegrenzter Zugang zu allen KI-Tools',
  description: 'Upgrade auf JobNachbar Premium und nutze alle KI-Tools unbegrenzt: Lebenslauf-Check, Anschreiben-Generator, Interview-Coach und mehr.',
}

const features = [
  {
    icon: FileText,
    title: 'Unbegrenzte Lebenslauf-Checks',
    description: 'Lass deinen Lebenslauf so oft prüfen wie du möchtest',
    free: '3x',
    premium: 'Unbegrenzt',
  },
  {
    icon: Sparkles,
    title: 'Anschreiben-Generator',
    description: 'Erstelle perfekte Anschreiben für jede Bewerbung',
    free: '2x',
    premium: 'Unbegrenzt',
  },
  {
    icon: MessageSquare,
    title: 'Interview-Coach',
    description: 'Bereite dich optimal auf Vorstellungsgespräche vor',
    free: '2x',
    premium: 'Unbegrenzt',
  },
  {
    icon: Euro,
    title: 'Gehaltsverhandlungs-Tipps',
    description: 'Verhandle dein Gehalt mit Expertenwissen',
    free: '2x',
    premium: 'Unbegrenzt',
  },
  {
    icon: Zap,
    title: 'Bevorzugte Job-Matches',
    description: 'Erhalte passende Jobs vor anderen Bewerbern',
    free: '-',
    premium: 'Inklusive',
  },
  {
    icon: Star,
    title: 'Premium-Badge im Profil',
    description: 'Hebe dich von anderen Bewerbern ab',
    free: '-',
    premium: 'Inklusive',
  },
]

const testimonials = [
  {
    name: 'Lisa T.',
    location: 'Sittensen',
    quote: 'Der Anschreiben-Generator hat mir so viel Zeit gespart. Nach der ersten Bewerbung wurde ich direkt eingeladen!',
    rating: 5,
  },
  {
    name: 'Markus K.',
    location: 'Rotenburg',
    quote: 'Der Interview-Coach hat mir geholfen, mich optimal vorzubereiten. Premium lohnt sich definitiv.',
    rating: 5,
  },
]

export default function PremiumPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-brand-dark to-brand-dark-lighter">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full mb-6">
              <Crown className="w-4 h-4 text-yellow-500 mr-2" />
              <span className="text-yellow-500 text-sm font-medium">JobNachbar Premium</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Unbegrenzter Zugang zu allen <span className="text-brand-red">KI-Tools</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Nutze die Power von KI für deine Bewerbung. Lebenslauf-Check, Anschreiben-Generator,
              Interview-Coach und mehr – so oft du willst.
            </p>

            {/* Price Card */}
            <div className="max-w-sm mx-auto">
              <div className="card bg-gradient-to-br from-brand-dark-card to-yellow-500/10 border-yellow-500/30 text-center">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">Premium</h2>
                <div className="mb-4">
                  <span className="text-5xl font-bold text-white">4,99€</span>
                  <span className="text-gray-400">/Monat</span>
                </div>
                <p className="text-gray-400 mb-6">Jederzeit kündbar</p>
                <Link
                  href="/premium/checkout"
                  className="btn-primary w-full inline-flex items-center justify-center"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Jetzt upgraden
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Comparison */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Was ist im Premium enthalten?
            </h2>

            <div className="space-y-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="card grid md:grid-cols-3 gap-4 items-center"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{feature.title}</h3>
                      <p className="text-gray-400 text-sm">{feature.description}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-1">Kostenlos</p>
                    <p className="text-gray-400">{feature.free}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-yellow-500 text-sm mb-1">Premium</p>
                    <p className="text-white font-semibold flex items-center justify-center gap-2">
                      <Check className="w-5 h-5 text-green-500" />
                      {feature.premium}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-4 bg-brand-dark-lighter">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Das sagen unsere Premium-Nutzer
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="card">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-4">&ldquo;{testimonial.quote}&rdquo;</p>
                  <p className="text-white font-medium">— {testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Häufige Fragen
            </h2>

            <div className="space-y-4">
              <div className="card">
                <h3 className="font-semibold text-white mb-2">Kann ich jederzeit kündigen?</h3>
                <p className="text-gray-400">
                  Ja, du kannst dein Premium-Abo jederzeit kündigen. Es läuft dann bis zum Ende des
                  bezahlten Zeitraums weiter.
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-white mb-2">Wie bezahle ich?</h3>
                <p className="text-gray-400">
                  Du erhältst eine Rechnung per E-Mail, die du bequem per Überweisung bezahlen kannst.
                  Nach Zahlungseingang wird dein Premium-Status aktiviert.
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-white mb-2">Was passiert mit meinen kostenlosen Nutzungen?</h3>
                <p className="text-gray-400">
                  Mit Premium hast du unbegrenzten Zugang. Deine bereits verbrauchten kostenlosen
                  Nutzungen spielen dann keine Rolle mehr.
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold text-white mb-2">Gibt es eine Testphase?</h3>
                <p className="text-gray-400">
                  Du kannst alle KI-Tools kostenlos ausprobieren (begrenzte Nutzungen).
                  So siehst du vorab, was Premium dir bietet.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-yellow-500/20 to-brand-red/20">
          <div className="max-w-4xl mx-auto text-center">
            <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Bereit für den nächsten Schritt?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Upgrade jetzt auf Premium und nutze alle KI-Tools unbegrenzt.
            </p>
            <Link
              href="/premium/checkout"
              className="btn-primary inline-flex items-center text-lg px-8 py-4"
            >
              <Crown className="w-5 h-5 mr-2" />
              Jetzt für 4,99€/Monat upgraden
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
