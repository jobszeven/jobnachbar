import Link from 'next/link'
import { FileText, MessageSquare, UserCheck, Shirt, Euro, AlertTriangle, ChevronRight, CheckCircle, XCircle, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Bewerbungstipps - JobNachbar',
  description: 'Praktische Tipps für deine Bewerbung: Lebenslauf, Anschreiben, Vorstellungsgespräch und mehr.',
}

export default function BewerbungstippsPage() {
  const tips = [
    {
      id: 'lebenslauf',
      icon: FileText,
      title: 'Lebenslauf schreiben',
      color: 'text-brand-red',
      bgColor: 'bg-brand-red/10',
      content: {
        intro: 'Dein Lebenslauf ist deine Visitenkarte. Er entscheidet in wenigen Sekunden, ob du zum Gespräch eingeladen wirst.',
        dos: [
          'Aktuelles Foto (freundlich, professionell)',
          'Kontaktdaten vollständig angeben',
          'Berufserfahrung in umgekehrt chronologischer Reihenfolge',
          'Relevante Weiterbildungen und Zertifikate',
          'Klares, übersichtliches Layout (max. 2 Seiten)',
        ],
        donts: [
          'Lücken im Lebenslauf verschweigen',
          'Rechtschreibfehler',
          'Zu lange oder zu kurze Beschreibungen',
          'Unprofessionelle E-Mail-Adressen',
          'Veraltete Angaben oder falsche Daten',
        ],
      },
    },
    {
      id: 'anschreiben',
      icon: MessageSquare,
      title: 'Anschreiben verfassen',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400/10',
      content: {
        intro: 'Das Anschreiben zeigt deine Motivation. Hier überzeugst du den Arbeitgeber, warum genau DU der Richtige bist.',
        dos: [
          'Persönliche Anrede (Name des Ansprechpartners)',
          'Bezug zur Stelle und zum Unternehmen',
          'Konkrete Beispiele aus deiner Erfahrung',
          'Deine Stärken mit Belegen',
          'Freundlicher, selbstbewusster Abschluss',
        ],
        donts: [
          'Standardfloskeln ("Hiermit bewerbe ich mich...")',
          'Den Lebenslauf einfach wiederholen',
          'Zu bescheiden oder zu überheblich sein',
          'Negative Gründe für den Jobwechsel nennen',
          'Gehaltsvorstellungen ohne Aufforderung nennen',
        ],
      },
    },
    {
      id: 'vorstellungsgespraech',
      icon: UserCheck,
      title: 'Vorstellungsgespräch',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      content: {
        intro: 'Du hast es geschafft – die Einladung ist da! Jetzt heißt es: gut vorbereiten und authentisch bleiben.',
        questions: [
          { q: 'Erzählen Sie etwas über sich.', a: 'Kurzfassung deines Werdegangs mit Fokus auf relevante Erfahrungen.' },
          { q: 'Warum möchten Sie bei uns arbeiten?', a: 'Zeige, dass du dich informiert hast. Was gefällt dir am Unternehmen?' },
          { q: 'Was sind Ihre Stärken?', a: 'Nenne 2-3 Stärken mit konkreten Beispielen aus der Praxis.' },
          { q: 'Was sind Ihre Schwächen?', a: 'Ehrlich sein, aber zeigen wie du daran arbeitest.' },
          { q: 'Wo sehen Sie sich in 5 Jahren?', a: 'Zeige Ambition, aber bleib realistisch und bezogen auf die Stelle.' },
        ],
      },
    },
    {
      id: 'dresscode',
      icon: Shirt,
      title: 'Was anziehen?',
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/10',
      content: {
        intro: 'Der erste Eindruck zählt. Kleide dich passend zur Branche – lieber etwas zu schick als zu lässig.',
        branches: [
          { name: 'Büro / Verwaltung', style: 'Business Casual: Hemd/Bluse, Stoffhose, gepflegte Schuhe' },
          { name: 'Handwerk', style: 'Saubere, ordentliche Kleidung. Poloshirt oder Hemd, keine Löcher' },
          { name: 'Pflege / Medizin', style: 'Gepflegt und praktisch. Schlichte, saubere Kleidung' },
          { name: 'Gastronomie / Hotel', style: 'Gepflegt, keine starken Parfums. Saubere, neutrale Kleidung' },
          { name: 'Bank / Versicherung', style: 'Klassisch: Anzug/Kostüm, gedeckte Farben' },
        ],
      },
    },
    {
      id: 'gehalt',
      icon: Euro,
      title: 'Gehaltsverhandlung',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      content: {
        intro: 'Über Geld spricht man nicht? Doch! Eine gute Vorbereitung hilft dir, deinen Wert zu kennen.',
        tips: [
          'Recherchiere vorher: Was ist in der Branche und Region üblich?',
          'Nenne immer eine Spanne, nicht eine feste Zahl',
          'Argumentiere mit deiner Erfahrung und Qualifikation',
          'Denke auch an Zusatzleistungen: Urlaub, Weiterbildung, Benefits',
          'Lass dich nicht unter Druck setzen – du darfst nachdenken',
        ],
        examples: [
          { job: 'Kfz-Mechaniker', range: '2.400 - 3.200 € brutto' },
          { job: 'Altenpfleger/in', range: '2.800 - 3.500 € brutto' },
          { job: 'Bürokauffrau/-mann', range: '2.200 - 2.800 € brutto' },
          { job: 'Elektriker', range: '2.600 - 3.400 € brutto' },
          { job: 'Koch/Köchin', range: '2.000 - 2.800 € brutto' },
        ],
      },
    },
    {
      id: 'fehler',
      icon: AlertTriangle,
      title: 'Häufige Fehler',
      color: 'text-orange-400',
      bgColor: 'bg-orange-400/10',
      content: {
        intro: 'Diese Fehler kosten dich den Job – vermeide sie unbedingt!',
        mistakes: [
          { mistake: 'Zu spät kommen', fix: 'Plane 15 Minuten Puffer ein. Lieber warten als hetzen.' },
          { mistake: 'Schlecht über Ex-Arbeitgeber reden', fix: 'Bleib neutral und professionell, auch wenn es schwer fällt.' },
          { mistake: 'Nicht vorbereitet sein', fix: 'Informiere dich über das Unternehmen und die Stelle.' },
          { mistake: 'Kein Interesse zeigen', fix: 'Stelle eigene Fragen! Das zeigt echtes Interesse.' },
          { mistake: 'Unrealistische Erwartungen', fix: 'Sei ehrlich zu dir selbst über deine Qualifikationen.' },
          { mistake: 'Handy nicht ausschalten', fix: 'Handy aus oder lautlos – keine Unterbrechungen!' },
        ],
      },
    },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Bewerbungstipps
            </h1>
            <p className="text-xl text-gray-400">
              Praktische Tipps von Profis – damit deine nächste Bewerbung ein Erfolg wird.
            </p>
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tips.map((tip) => (
              <a
                key={tip.id}
                href={`#${tip.id}`}
                className="card hover:border-brand-red transition-colors text-center group"
              >
                <div className={`w-12 h-12 ${tip.bgColor} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                  <tip.icon className={`w-6 h-6 ${tip.color}`} />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  {tip.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tips Sections */}
      <section className="pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Lebenslauf */}
          <div id="lebenslauf" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 ${tips[0].bgColor} rounded-xl flex items-center justify-center`}>
                <FileText className={`w-7 h-7 ${tips[0].color}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{tips[0].title}</h2>
            </div>
            <p className="text-gray-400 text-lg mb-8">{tips[0].content.intro}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card border-emerald-500/30">
                <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Das solltest du tun
                </h3>
                <ul className="space-y-3">
                  {tips[0]?.content?.dos?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Das solltest du vermeiden
                </h3>
                <ul className="space-y-3">
                  {tips[0]?.content?.donts?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Anschreiben */}
          <div id="anschreiben" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 ${tips[1].bgColor} rounded-xl flex items-center justify-center`}>
                <MessageSquare className={`w-7 h-7 ${tips[1].color}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{tips[1].title}</h2>
            </div>
            <p className="text-gray-400 text-lg mb-8">{tips[1].content.intro}</p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="card border-emerald-500/30">
                <h3 className="text-emerald-400 font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Das solltest du tun
                </h3>
                <ul className="space-y-3">
                  {tips[1]?.content?.dos?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card border-red-500/30">
                <h3 className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Das solltest du vermeiden
                </h3>
                <ul className="space-y-3">
                  {tips[1]?.content?.donts?.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Vorstellungsgespräch */}
          <div id="vorstellungsgespraech" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 ${tips[2].bgColor} rounded-xl flex items-center justify-center`}>
                <UserCheck className={`w-7 h-7 ${tips[2].color}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{tips[2].title}</h2>
            </div>
            <p className="text-gray-400 text-lg mb-8">{tips[2].content.intro}</p>
            
            <div className="space-y-4">
              <h3 className="text-white font-semibold text-lg">Die 5 häufigsten Fragen:</h3>
              {tips[2]?.content?.questions?.map((item, i) => (
                <div key={i} className="card">
                  <p className="text-brand-red font-medium mb-2">„{item.q}"</p>
                  <p className="text-gray-400">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dresscode */}
          <div id="dresscode" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 ${tips[3].bgColor} rounded-xl flex items-center justify-center`}>
                <Shirt className={`w-7 h-7 ${tips[3].color}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{tips[3].title}</h2>
            </div>
            <p className="text-gray-400 text-lg mb-8">{tips[3].content.intro}</p>
            
            <div className="space-y-4">
              {tips[3].content.branches.map((item, i) => (
                <div key={i} className="card flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                  <span className="text-white font-medium min-w-[160px]">{item.name}</span>
                  <span className="text-gray-400">{item.style}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gehalt */}
          <div id="gehalt" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 ${tips[4].bgColor} rounded-xl flex items-center justify-center`}>
                <Euro className={`w-7 h-7 ${tips[4].color}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{tips[4].title}</h2>
            </div>
            <p className="text-gray-400 text-lg mb-8">{tips[4].content.intro}</p>
            
            <div className="card mb-8">
              <h3 className="text-white font-semibold mb-4">Tipps für die Verhandlung:</h3>
              <ul className="space-y-3">
                {tips[4].content.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300">
                    <ChevronRight className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h3 className="text-white font-semibold mb-4">Typische Gehälter in der Region (brutto/Monat):</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tips[4].content.examples.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-brand-dark rounded-lg">
                    <span className="text-gray-300">{item.job}</span>
                    <span className="text-yellow-400 font-medium">{item.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Häufige Fehler */}
          <div id="fehler" className="scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 ${tips[5].bgColor} rounded-xl flex items-center justify-center`}>
                <AlertTriangle className={`w-7 h-7 ${tips[5].color}`} />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white">{tips[5].title}</h2>
            </div>
            <p className="text-gray-400 text-lg mb-8">{tips[5].content.intro}</p>
            
            <div className="space-y-4">
              {tips[5].content.mistakes.map((item, i) => (
                <div key={i} className="card">
                  <div className="flex items-start gap-4">
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-red-400 font-medium mb-1">{item.mistake}</p>
                      <p className="text-gray-400">{item.fix}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-red/20 to-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Bereit für den nächsten Schritt?
          </h2>
          <p className="text-gray-300 mb-8">
            Registriere dich kostenlos und finde deinen Traumjob in der Region.
          </p>
          <Link href="/registrieren/bewerber" className="btn-primary inline-flex items-center">
            Jetzt Profil erstellen
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
