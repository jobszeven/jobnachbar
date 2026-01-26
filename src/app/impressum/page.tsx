import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Impressum - JobNachbar',
  description: 'Impressum und rechtliche Angaben zu JobNachbar.',
}

export default function Impressum() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Startseite
        </Link>

        <div className="card prose prose-invert max-w-none">
          <h1 className="text-3xl font-bold text-white mb-8">Impressum</h1>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Angaben gemäß § 5 TMG</h2>
          <p className="text-gray-300">
            Idris Akkurt<br />
            Feldstraße 22<br />
            27404 Zeven<br />
            Deutschland
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Kontakt</h2>
          <p className="text-gray-300">
            E-Mail: <a href="mailto:info@jobnachbar.com" className="text-brand-red hover:underline">info@jobnachbar.com</a>
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Berufsbezeichnung</h2>
          <p className="text-gray-300">
            Gewerbetreibender
          </p>

          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Zuständige Behörde</h2>
          <p className="text-gray-300">
            Finanzamt Zeven
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Umsatzsteuer-ID</h2>
          <p className="text-gray-300">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            [wird noch ergänzt, falls vorhanden]
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
          <p className="text-gray-300">
            Idris Akkurt<br />
            Feldstraße 22<br />
            27404 Zeven
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Streitschlichtung</h2>
          <p className="text-gray-300">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
            <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline ml-1">
              https://ec.europa.eu/consumers/odr/
            </a>
          </p>
          <p className="text-gray-300 mt-4">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Haftung für Inhalte</h2>
          <p className="text-gray-300">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>
          <p className="text-gray-300 mt-4">
            Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Haftung für Links</h2>
          <p className="text-gray-300">
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>
          
          <h2 className="text-xl font-semibold text-white mt-8 mb-4">Urheberrecht</h2>
          <p className="text-gray-300">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  )
}
