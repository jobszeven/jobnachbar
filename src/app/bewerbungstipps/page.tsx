import { CheckCircle, XCircle, ChevronRight, Lightbulb, FileText, Users, Phone } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Bewerbungstipps - JobNachbar',
  description: 'Tipps für deine erfolgreiche Bewerbung',
}

export default function Bewerbungstipps() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Bewerbungstipps</h1>
        <p className="text-gray-400 mb-12">So überzeugst du bei deiner nächsten Bewerbung</p>

        {/* Lebenslauf */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-brand-red" />
            </div>
            <h2 className="text-2xl font-bold text-white">Der perfekte Lebenslauf</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Das solltest du tun
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Aktuelles, professionelles Foto verwenden
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Klare Struktur und übersichtliches Layout
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Relevante Erfahrungen hervorheben
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  Kontaktdaten vollständig angeben
                </li>
              </ul>
            </div>
            
            <div className="card">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-400" />
                Das solltest du vermeiden
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-300">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  Rechtschreibfehler und Tippfehler
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  Lücken im Lebenslauf verschweigen
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  Zu lange oder unübersichtliche Dokumente
                </li>
                <li className="flex items-start gap-3 text-gray-300">
                  <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  Falsche oder übertriebene Angaben
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Anschreiben */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-brand-red" />
            </div>
            <h2 className="text-2xl font-bold text-white">Das Anschreiben</h2>
          </div>
          
          <div className="card">
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-gray-300">
                <ChevronRight className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Persönlich ansprechen:</strong> Finde den Namen des Ansprechpartners heraus</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <ChevronRight className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Motivation zeigen:</strong> Erkläre, warum du genau diesen Job willst</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <ChevronRight className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Stärken nennen:</strong> Was bringst du mit, das dem Unternehmen hilft?</span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <ChevronRight className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <span><strong className="text-white">Kurz und knapp:</strong> Maximal eine Seite, keine Romane</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Vorstellungsgespräch */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-brand-red" />
            </div>
            <h2 className="text-2xl font-bold text-white">Im Vorstellungsgespräch</h2>
          </div>
          
          <div className="card">
            <h3 className="text-white font-semibold mb-4">Die 5 häufigsten Fragen:</h3>
            <div className="space-y-4">
              <div className="card bg-brand-dark">
                <p className="text-brand-red font-medium mb-2">Erzählen Sie etwas über sich.</p>
                <p className="text-gray-400 text-sm">Bereite einen 2-Minuten-Pitch vor: Ausbildung, Erfahrung, warum dieser Job.</p>
              </div>
              <div className="card bg-brand-dark">
                <p className="text-brand-red font-medium mb-2">Warum möchten Sie bei uns arbeiten?</p>
                <p className="text-gray-400 text-sm">Informiere dich über das Unternehmen und nenne konkrete Gründe.</p>
              </div>
              <div className="card bg-brand-dark">
                <p className="text-brand-red font-medium mb-2">Was sind Ihre Stärken und Schwächen?</p>
                <p className="text-gray-400 text-sm">Sei ehrlich, aber drehe Schwächen ins Positive.</p>
              </div>
              <div className="card bg-brand-dark">
                <p className="text-brand-red font-medium mb-2">Wo sehen Sie sich in 5 Jahren?</p>
                <p className="text-gray-400 text-sm">Zeige Ambition, aber bleib realistisch.</p>
              </div>
              <div className="card bg-brand-dark">
                <p className="text-brand-red font-medium mb-2">Haben Sie noch Fragen?</p>
                <p className="text-gray-400 text-sm">Immer Ja! Frag nach Team, Einarbeitung oder Entwicklungsmöglichkeiten.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Hilfe */}
        <section>
          <div className="card bg-gradient-to-r from-brand-red/20 to-orange-500/20 border-brand-red">
            <div className="flex items-center gap-3 mb-4">
              <Phone className="w-6 h-6 text-brand-red" />
              <h2 className="text-xl font-bold text-white">Brauchst du Hilfe?</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Wir unterstützen dich gerne bei deiner Bewerbung. Melde dich bei uns!
            </p>
            <a href="/kontakt" className="btn-primary inline-block">
              Kontakt aufnehmen
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
