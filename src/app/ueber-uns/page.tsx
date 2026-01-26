import type { Metadata } from 'next'
import Link from 'next/link'
import { MapPin, Heart, Users, Phone, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Über uns - JobNachbar',
  description: 'Die Geschichte von JobNachbar: Wie wir zur größten lokalen Jobbörse für Zeven und Umgebung wurden.',
}

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Unsere Geschichte
            </h1>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-invert prose-lg max-w-none">
              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-brand-red mb-4">
                  JobNachbar entstand aus Frust.
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Frust darüber, dass man als Arbeitssuchender in Zeven und Umgebung auf den großen Jobportalen untergeht.
                  Hunderte Stellen aus Hamburg, aber kaum welche aus der eigenen Region.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Und Frust darüber, dass kleine Betriebe hier im Landkreis Rotenburg teure Anzeigen schalten –
                  und trotzdem keine passenden Bewerber finden.
                </p>
              </div>

              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Das wollten wir ändern.
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  2026 haben wir JobNachbar gegründet. Mit einer einfachen Mission:
                  <span className="text-white font-semibold"> Menschen und Unternehmen in unserer Region zusammenbringen.</span>
                </p>
              </div>

              <div className="card mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Warum &ldquo;JobNachbar&rdquo;?
                </h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  Weil der beste Job oft näher ist als man denkt. Beim Nachbarn um die Ecke.
                  Im Betrieb, an dem man jeden Tag vorbeifährt.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Wir glauben, dass Arbeit mehr ist als Geld verdienen. Es geht um kurze Wege,
                  um Gemeinschaft, um die Stärkung unserer Region.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-12 px-4 bg-brand-dark-lighter">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">
              Unser Versprechen
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="card text-center">
                <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">100% Regional</h3>
                <p className="text-gray-400 text-sm">Nur echte Jobs aus Zeven und 30km Umkreis</p>
              </div>
              <div className="card text-center">
                <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-7 h-7 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Faire Preise</h3>
                <p className="text-gray-400 text-sm">Für lokale Unternehmen</p>
              </div>
              <div className="card text-center">
                <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Persönlicher Support</h3>
                <p className="text-gray-400 text-sm">Wir sind für Sie da</p>
              </div>
              <div className="card text-center">
                <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-brand-red" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Wir kennen die Region</h3>
                <p className="text-gray-400 text-sm">Weil wir hier leben</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xl text-gray-300 italic mb-8">
              Das JobNachbar Team
            </p>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-r from-brand-red to-brand-red-dark">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Werde Teil der JobNachbar-Community
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Ob als Bewerber oder Arbeitgeber – wir freuen uns auf dich!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registrieren/bewerber" className="btn-white inline-flex items-center justify-center">
                Als Bewerber starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link href="/registrieren/arbeitgeber" className="btn-secondary border-white text-white hover:bg-white hover:text-brand-red inline-flex items-center justify-center">
                Als Arbeitgeber starten
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
