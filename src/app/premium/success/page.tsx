import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Mail, Clock, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Bestellung erfolgreich - Premium',
  description: 'Deine Premium-Bestellung wurde erfolgreich aufgegeben.',
}

export default function PremiumSuccessPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Bestellung erfolgreich!
          </h1>
          <p className="text-xl text-gray-400 mb-12">
            Vielen Dank für deine Premium-Bestellung.
          </p>

          <div className="card text-left mb-8">
            <h2 className="text-lg font-semibold text-white mb-6">Nächste Schritte:</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">E-Mail prüfen</h3>
                  <p className="text-gray-400 text-sm">
                    Du erhältst in Kürze eine E-Mail mit deiner Rechnung und den Zahlungsdaten.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-brand-red font-bold">€</span>
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Betrag überweisen</h3>
                  <p className="text-gray-400 text-sm">
                    Überweise den Rechnungsbetrag auf das in der E-Mail angegebene Konto.
                    Nutze die Rechnungsnummer als Verwendungszweck.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <h3 className="font-medium text-white mb-1">Premium wird aktiviert</h3>
                  <p className="text-gray-400 text-sm">
                    Nach Zahlungseingang (in der Regel 1-2 Werktage) wird dein Premium-Status
                    automatisch aktiviert. Du erhältst eine Bestätigungs-E-Mail.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard/bewerber" className="btn-primary inline-flex items-center justify-center">
              Zum Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/tools" className="btn-secondary inline-flex items-center justify-center">
              KI-Tools entdecken
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            Fragen? Kontaktiere uns unter{' '}
            <a href="mailto:premium@jobnachbar.com" className="text-brand-red hover:underline">
              premium@jobnachbar.com
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
