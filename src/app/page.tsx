import Link from 'next/link'
import { Users, Zap, MapPin, CheckCircle, ArrowRight, Clock, Shield, Euro } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-red rounded-full filter blur-3xl" />
          <div className="absolute bottom-20 left-20 w-64 h-64 bg-orange-500 rounded-full filter blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-brand-red/10 border border-brand-red/30 rounded-full mb-8">
              <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
              <span className="text-brand-red text-sm font-medium">Freigabe innerhalb von 24 Stunden</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Jobs in deiner Nähe.
              <br />
              <span className="text-brand-red">Schnell & unkompliziert.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Die lokale Jobbörse für Zeven, Rotenburg und den gesamten Landkreis. 
              Finde passende Stellen oder qualifizierte Bewerber – ohne teure Vermittler.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/registrieren/bewerber" className="btn-bewerber inline-flex items-center justify-center text-lg px-8 py-4">
                Job finden
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link href="/registrieren/arbeitgeber" className="btn-arbeitgeber inline-flex items-center justify-center text-lg px-8 py-4">
                Mitarbeiter finden
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-8 text-gray-400">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-brand-red" />
                <span>30 km Radius um Zeven</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-brand-red" />
                <span>100% regional</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-5 h-5 mr-2 text-brand-red" />
                <span>Automatisches Matching</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works - Job Seekers */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              So funktioniert's für <span className="text-white">Jobsuchende</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              In 3 Minuten registriert – passende Jobs direkt in deinem Postfach.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Profil erstellen', desc: 'Trag ein, was du suchst: Branche, Arbeitszeit, Wunschgehalt und wo du arbeiten möchtest.' },
              { num: '2', title: 'Matches erhalten', desc: 'Unser System findet passende Stellen und schickt sie dir per E-Mail oder WhatsApp.' },
              { num: '3', title: 'Bewerben', desc: 'Mit einem Klick bewerben – dein Profil geht direkt an den Arbeitgeber.' },
            ].map((step) => (
              <div key={step.num} className="card text-center hover:border-brand-red/50 transition-colors">
                <div className="w-12 h-12 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-red font-bold text-xl">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/registrieren/bewerber" className="btn-primary inline-flex items-center">
              Jetzt kostenlos registrieren
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works - Employers */}
      <section className="py-20 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              So funktioniert's für <span className="text-brand-red">Arbeitgeber</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Erreichen Sie qualifizierte Bewerber aus der Region – ohne teure Jobbörsen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Stelle ausschreiben', desc: 'Beschreiben Sie die Position und was Sie bieten. Wir prüfen und schalten frei.' },
              { num: '2', title: 'Bewerber erhalten', desc: 'Passende Kandidaten werden automatisch gematcht und Sie per E-Mail informiert.' },
              { num: '3', title: 'Einstellen', desc: 'Kontaktieren Sie interessante Bewerber direkt und stellen Sie ein.' },
            ].map((step) => (
              <div key={step.num} className="card text-center hover:border-brand-red/50 transition-colors">
                <div className="w-12 h-12 bg-brand-red/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-brand-red font-bold text-xl">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/registrieren/arbeitgeber" className="btn-arbeitgeber inline-flex items-center">
              Jetzt Stelle ausschreiben
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block bg-brand-red/20 text-brand-red text-sm font-semibold px-4 py-1 rounded-full mb-4">
              🔥 LAUNCH-ANGEBOT: 60% Rabatt
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Faire Preise für Arbeitgeber
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Keine versteckten Kosten. Starten Sie kostenlos und zahlen Sie nur für das, was Sie brauchen.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="card text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Starter</h3>
              <p className="text-4xl font-bold text-white mb-2">0€</p>
              <p className="text-gray-400 text-sm mb-4">1 Stelle • 30 Tage</p>
              <Link href="/preise" className="text-brand-red hover:underline text-sm">Mehr erfahren →</Link>
            </div>
            <div className="card text-center border-brand-red relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-brand-red text-white text-xs font-bold px-3 py-1 rounded-full">Beliebt</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Basic</h3>
              <div className="mb-2">
                <span className="text-gray-500 line-through text-lg">99€</span>
                <p className="text-4xl font-bold text-white">39€<span className="text-lg text-gray-400">/Mo</span></p>
              </div>
              <p className="text-gray-400 text-sm mb-4">5 Stellen • 10 Kontakte</p>
              <Link href="/preise" className="text-brand-red hover:underline text-sm">Mehr erfahren →</Link>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-semibold text-white mb-2">Premium</h3>
              <div className="mb-2">
                <span className="text-gray-500 line-through text-lg">199€</span>
                <p className="text-4xl font-bold text-white">79€<span className="text-lg text-gray-400">/Mo</span></p>
              </div>
              <p className="text-gray-400 text-sm mb-4">Unbegrenzt • All-Inclusive</p>
              <Link href="/preise" className="text-brand-red hover:underline text-sm">Mehr erfahren →</Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/preise" className="btn-secondary inline-flex items-center">
              Alle Preise vergleichen
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <Clock className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">Schnelle Freischaltung</p>
              <p className="text-gray-400 text-sm">Innerhalb von 24h</p>
            </div>
            <div className="text-center">
              <Shield className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">DSGVO-konform</p>
              <p className="text-gray-400 text-sm">Server in Deutschland</p>
            </div>
            <div className="text-center">
              <Euro className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">Faire Preise</p>
              <p className="text-gray-400 text-sm">Keine versteckten Kosten</p>
            </div>
            <div className="text-center">
              <MapPin className="w-8 h-8 text-brand-red mx-auto mb-3" />
              <p className="text-white font-semibold">100% Regional</p>
              <p className="text-gray-400 text-sm">Zeven & Umgebung</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-red/20 to-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Bereit, deinen nächsten Mitarbeiter zu finden?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Starte jetzt kostenlos und erhalte deine erste Bewerbung innerhalb weniger Tage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrieren/arbeitgeber" className="btn-primary inline-flex items-center justify-center text-lg px-8 py-4">
              Jetzt Stelle ausschreiben
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/kontakt" className="btn-secondary inline-flex items-center justify-center">
              Fragen? Kontaktiere uns
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
