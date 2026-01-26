import type { Metadata } from 'next'
import Link from 'next/link'
import { Star, Quote, ArrowRight, MapPin, Users, Clock } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Erfolgsgeschichten - JobNachbar',
  description: 'Echte Erfolgsgeschichten von Unternehmen und Bewerbern, die über JobNachbar zusammengefunden haben.',
}

const stories = [
  {
    id: 'saray-imbiss',
    type: 'employer',
    company: 'Saray Imbiss',
    location: 'Zeven',
    title: '3 Fahrer und eine Küchenkraft in nur 2 Wochen gefunden',
    quote: 'Wir haben über JobNachbar 3 zuverlässige Fahrer und eine Küchenkraft gefunden. Endlich eine Plattform, die unsere Region versteht!',
    rating: 5,
    story: `Als Familienbetrieb in Zeven haben wir immer Schwierigkeiten gehabt, gutes Personal zu finden. Die großen Jobportale brachten uns hauptsächlich Bewerbungen aus Hamburg - für einen Teilzeit-Fahrerjob macht das keinen Sinn.

Über einen Bekannten sind wir auf JobNachbar aufmerksam geworden. Innerhalb von 2 Wochen hatten wir 12 Bewerbungen - alle aus der direkten Umgebung. Drei Fahrer und eine Küchenkraft konnten wir direkt einstellen.

Das Beste: Die Bewerber wussten genau, was sie erwartet. Kurze Wege, faire Bezahlung, ein nettes Team. Kein langes Erklären, kein enttäuschtes Gesicht wenn sie die Anfahrt sehen.`,
    results: [
      '4 neue Mitarbeiter eingestellt',
      'Alle aus der direkten Umgebung',
      'Innerhalb von 2 Wochen',
    ],
  },
  {
    id: 'autofix',
    type: 'employer',
    company: 'AutoFix',
    location: 'Zeven',
    title: 'Endlich einen erfahrenen Kfz-Mechatroniker gefunden',
    quote: 'Einen guten Kfz-Mechatroniker zu finden ist nicht leicht. Über JobNachbar hat es geklappt - schnell und unkompliziert.',
    rating: 5,
    story: `Die Suche nach einem erfahrenen Kfz-Mechatroniker hat uns fast ein Jahr beschäftigt. Wir haben alles versucht: Zeitungsanzeigen, die großen Portale, sogar Headhunter kontaktiert.

Das Problem: Entweder passte die Qualifikation nicht, oder die Bewerber wollten nicht aufs Land. Viele haben abgesagt, als sie gehört haben, dass wir in Zeven sind.

Bei JobNachbar war das anders. Hier bewerben sich Menschen, die bewusst in der Region arbeiten wollen. Unser neuer Kollege wohnt 10 Minuten entfernt und freut sich jeden Tag, nicht nach Bremen oder Hamburg pendeln zu müssen.

Die Einarbeitung lief super. Er kannte sogar einige unserer Stammkunden persönlich - so ist das eben auf dem Land.`,
    results: [
      'Erfahrenen Mechatroniker eingestellt',
      'Nach nur 3 Wochen Suche',
      'Wohnt 10 Minuten entfernt',
    ],
  },
]

const applicantStories = [
  {
    name: 'Markus K.',
    location: 'Rotenburg',
    quote: 'Endlich eine Plattform nur für unsere Region. Keine Jobs aus Hamburg, sondern genau das was ich gesucht habe.',
    rating: 5,
  },
  {
    name: 'Lisa T.',
    location: 'Sittensen',
    quote: 'Der Bewerbungs-Assistent hat mir geholfen mein Anschreiben zu verbessern. Nach der ersten Bewerbung wurde ich direkt eingeladen.',
    rating: 5,
  },
  {
    name: 'Sarah M.',
    location: 'Zeven',
    quote: 'Nach 2 Monaten Suche auf anderen Portalen - hier hatte ich nach einer Woche meinen neuen Job. Direkt in Zeven!',
    rating: 5,
  },
  {
    name: 'Thomas B.',
    location: 'Bremervörde',
    quote: 'Einfach zu bedienen, übersichtlich und nur lokale Jobs. Genau das hat gefehlt in unserer Region.',
    rating: 5,
  },
  {
    name: 'Anna W.',
    location: 'Tarmstedt',
    quote: 'Ich wollte nicht mehr pendeln. Über JobNachbar habe ich einen Arbeitsplatz 10 Minuten von zuhause gefunden.',
    rating: 5,
  },
]

export default function ErfolgsgeschichtenPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Erfolgsgeschichten
            </h1>
            <p className="text-xl text-gray-400">
              Echte Menschen, echte Jobs, echte Erfolge aus unserer Region
            </p>
          </div>
        </section>

        {/* Employer Stories */}
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Users className="w-6 h-6 mr-3 text-brand-red" />
              Arbeitgeber berichten
            </h2>

            <div className="space-y-12">
              {stories.map((story) => (
                <div key={story.id} className="card">
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {story.company}
                      </h3>
                      <p className="text-gray-400 flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {story.location}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(story.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-brand-red text-brand-red" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-brand-dark rounded-lg p-6 mb-6 relative">
                    <Quote className="w-8 h-8 text-brand-red/30 absolute top-4 left-4" />
                    <p className="text-lg text-white italic pl-8">
                      "{story.quote}"
                    </p>
                  </div>

                  {/* Story */}
                  <h4 className="text-xl font-semibold text-white mb-4">
                    {story.title}
                  </h4>
                  <div className="text-gray-400 space-y-4 mb-6">
                    {story.story.split('\n\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>

                  {/* Results */}
                  <div className="bg-brand-red/10 border border-brand-red/30 rounded-lg p-4">
                    <h5 className="font-semibold text-brand-red mb-3">Ergebnis:</h5>
                    <ul className="space-y-2">
                      {story.results.map((result, i) => (
                        <li key={i} className="flex items-center text-gray-300">
                          <span className="w-2 h-2 bg-brand-red rounded-full mr-3" />
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Applicant Testimonials */}
        <section className="py-12 px-4 bg-brand-dark-lighter">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Star className="w-6 h-6 mr-3 text-brand-red" />
              Bewerber berichten
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicantStories.map((story, index) => (
                <div key={index} className="card">
                  <div className="flex gap-1 mb-4">
                    {[...Array(story.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-brand-red text-brand-red" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic mb-4">"{story.quote}"</p>
                  <p className="text-white font-medium">— {story.name}</p>
                  <p className="text-gray-500 text-sm flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    {story.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Schreibe deine eigene Erfolgsgeschichte
              </h2>
              <p className="text-gray-400 mb-6">
                Ob als Bewerber oder Arbeitgeber - starte jetzt und finde deinen perfekten Match!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/registrieren/bewerber" className="btn-primary inline-flex items-center justify-center">
                  Als Bewerber starten
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/registrieren/arbeitgeber" className="btn-secondary inline-flex items-center justify-center">
                  Als Arbeitgeber starten
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
