import Link from 'next/link'
import { CheckCircle, ArrowRight, Users, Zap, Clock, Euro, MapPin, TrendingUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Für Arbeitgeber - JobNachbar',
  description: 'Finden Sie qualifizierte Mitarbeiter aus Ihrer Region. Günstig, schnell und effektiv.',
}

export default function FuerArbeitgeberPage() {
  const benefits = [
    { icon: MapPin, title: '100% Regional', desc: 'Nur Bewerber aus Zeven und Umgebung (30 km Radius)' },
    { icon: Euro, title: 'Günstige Preise', desc: 'Bis zu 90% günstiger als StepStone & Co.' },
    { icon: Clock, title: 'Schnell', desc: 'Freischaltung innerhalb von 24 Stunden' },
    { icon: Zap, title: 'Auto-Matching', desc: 'Passende Bewerber werden automatisch informiert' },
    { icon: Users, title: 'Qualifiziert', desc: 'Jede Bewerbung wird von uns geprüft' },
    { icon: TrendingUp, title: 'Effektiv', desc: 'Facebook-Reichweite inklusive' },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 right-20 w-64 h-64 bg-brand-red rounded-full filter blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <span className="inline-block bg-brand-red/20 text-brand-red text-sm font-semibold px-4 py-1 rounded-full mb-6">
            Für Arbeitgeber
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Finden Sie Mitarbeiter<br /><span className="text-brand-red">aus Ihrer Region</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Keine teuren Jobbörsen. Keine Personalvermittler. Erreichen Sie qualifizierte Bewerber 
            direkt in Zeven und Umgebung – schnell, einfach und fair.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registrieren/arbeitgeber" className="btn-primary text-lg px-8 py-4 inline-flex items-center justify-center">
              Jetzt kostenlos starten
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link href="/preise" className="btn-secondary inline-flex items-center justify-center">
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Ihre Vorteile</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="card hover:border-brand-red/50 transition-colors">
                <div className="w-12 h-12 bg-brand-red/10 rounded-xl flex items-center justify-center mb-4">
                  <benefit.icon className="w-6 h-6 text-brand-red" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-4">So einfach geht's</h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">In wenigen Minuten zur ersten Bewerbung</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { num: '1', title: 'Registrieren', desc: 'Kostenloses Konto erstellen und Firmenprofil anlegen' },
              { num: '2', title: 'Stelle ausschreiben', desc: 'Stellenanzeige erstellen – wird innerhalb von 24h freigeschaltet' },
              { num: '3', title: 'Bewerber erhalten', desc: 'Passende Kandidaten bewerben sich direkt bei Ihnen' },
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-brand-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.num}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-gray-400">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="py-20 bg-gradient-to-r from-brand-red/20 to-orange-500/20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Faire Preise für kleine & mittlere Unternehmen</h2>
          <p className="text-xl text-gray-300 mb-8">
            Starten Sie kostenlos. Zahlen Sie nur für das, was Sie brauchen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="card text-center">
              <p className="text-gray-400">Starter</p>
              <p className="text-4xl font-bold text-white">0€</p>
              <p className="text-gray-400 text-sm">1 Stelle kostenlos</p>
            </div>
            <div className="card border-brand-red text-center">
              <p className="text-brand-red">Basic</p>
              <p className="text-4xl font-bold text-white">39€<span className="text-lg text-gray-400">/Mo</span></p>
              <p className="text-gray-400 text-sm">5 Stellen + 10 Kontakte</p>
            </div>
            <div className="card text-center">
              <p className="text-yellow-400">Premium</p>
              <p className="text-4xl font-bold text-white">79€<span className="text-lg text-gray-400">/Mo</span></p>
              <p className="text-gray-400 text-sm">Unbegrenzt alles</p>
            </div>
          </div>
          <Link href="/preise" className="inline-flex items-center text-brand-red mt-8 hover:underline">
            Alle Preise vergleichen <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Bereit loszulegen?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Registrieren Sie sich jetzt kostenlos und schreiben Sie Ihre erste Stelle aus.
          </p>
          <Link href="/registrieren/arbeitgeber" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
            Jetzt kostenlos starten
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
