import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Sparkles, Briefcase, Users, HeadphonesIcon } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Zahlung erfolgreich - Premium aktiviert',
  description: 'Deine Premium-Mitgliedschaft wurde erfolgreich aktiviert.',
}

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <div className="relative w-24 h-24 mx-auto mb-8">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping" />
            <div className="relative w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Zahlung erfolgreich!
          </h1>
          <p className="text-xl text-gray-400 mb-4">
            Dein Premium-Zugang ist ab sofort aktiv.
          </p>
          <p className="text-gray-500 mb-12">
            Eine Bestätigung wurde an deine E-Mail-Adresse gesendet.
          </p>

          {/* Features */}
          <div className="card mb-8">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              Deine Premium-Vorteile
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Briefcase className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="font-medium text-white mb-1">Unbegrenzte Jobs</h3>
                <p className="text-gray-400 text-sm">
                  Schalte so viele Stellenanzeigen wie du möchtest
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="font-medium text-white mb-1">Direkter Kontakt</h3>
                <p className="text-gray-400 text-sm">
                  Kontaktdaten aller Bewerber sofort einsehen
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <HeadphonesIcon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="font-medium text-white mb-1">Premium Support</h3>
                <p className="text-gray-400 text-sm">
                  Bevorzugte Unterstützung bei Fragen
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/arbeitgeber/stelle-erstellen"
              className="btn-primary inline-flex items-center justify-center"
            >
              Erste Stelle erstellen
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link
              href="/dashboard/arbeitgeber"
              className="btn-secondary inline-flex items-center justify-center"
            >
              Zum Dashboard
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            Fragen? Kontaktiere uns unter{' '}
            <a href="mailto:info@jobnachbar.com" className="text-brand-red hover:underline">
              info@jobnachbar.com
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
