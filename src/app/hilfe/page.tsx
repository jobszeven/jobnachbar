import type { Metadata } from 'next'
import Link from 'next/link'
import { Search, BookOpen, User, Building2, FileText, MessageSquare, CreditCard, Shield, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Hilfe & Tutorials - JobNachbar',
  description: 'Anleitungen und Hilfe für Bewerber und Arbeitgeber auf JobNachbar.',
}

const applicantGuides = [
  {
    title: 'Account erstellen',
    description: 'Schritt-für-Schritt Anleitung zur Registrierung',
    icon: User,
    href: '/hilfe/bewerber/registrierung',
  },
  {
    title: 'Profil vervollständigen',
    description: 'So erstellst du ein überzeugendes Profil',
    icon: FileText,
    href: '/hilfe/bewerber/profil',
  },
  {
    title: 'Jobs finden & bewerben',
    description: 'Tipps zur effektiven Jobsuche',
    icon: Search,
    href: '/hilfe/bewerber/jobsuche',
  },
  {
    title: 'KI-Tools nutzen',
    description: 'Anleitung für Lebenslauf-Check & mehr',
    icon: BookOpen,
    href: '/hilfe/bewerber/ki-tools',
  },
  {
    title: 'Premium-Vorteile',
    description: 'Was bietet JobNachbar Premium?',
    icon: CreditCard,
    href: '/hilfe/bewerber/premium',
  },
  {
    title: 'Datenschutz & Sicherheit',
    description: 'Wie wir deine Daten schützen',
    icon: Shield,
    href: '/hilfe/bewerber/datenschutz',
  },
]

const employerGuides = [
  {
    title: 'Firmenprofil einrichten',
    description: 'So präsentieren Sie Ihr Unternehmen',
    icon: Building2,
    href: '/hilfe/arbeitgeber/profil',
  },
  {
    title: 'Stellenanzeige erstellen',
    description: 'Tipps für eine erfolgreiche Anzeige',
    icon: FileText,
    href: '/hilfe/arbeitgeber/stellenanzeige',
  },
  {
    title: 'Bewerbungen verwalten',
    description: 'Effizientes Bewerbermanagement',
    icon: User,
    href: '/hilfe/arbeitgeber/bewerbungen',
  },
  {
    title: 'Abo & Zahlung',
    description: 'Pakete und Zahlungsoptionen',
    icon: CreditCard,
    href: '/hilfe/arbeitgeber/abo',
  },
]

export default function HilfePage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Hilfe & Tutorials
            </h1>
            <p className="text-xl text-gray-400 mb-8">
              Alles was du wissen musst, um JobNachbar optimal zu nutzen
            </p>

            {/* Search Bar (Visual - not functional yet) */}
            <div className="max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Suche nach Anleitungen..."
                  className="input-field pl-12"
                  disabled
                />
              </div>
            </div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="py-8 px-4 bg-brand-dark-lighter">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/faq" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                FAQ
              </Link>
              <Link href="/kontakt" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                Kontakt
              </Link>
              <Link href="/ueber-uns" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                Über uns
              </Link>
              <Link href="/datenschutz" className="badge badge-red hover:bg-brand-red/30 transition-colors">
                Datenschutz
              </Link>
            </div>
          </div>
        </section>

        {/* For Applicants */}
        <section className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <User className="w-6 h-6 mr-3 text-brand-red" />
              Für Bewerber
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {applicantGuides.map((guide) => (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className="card hover:border-brand-red/50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/30 transition-colors">
                      <guide.icon className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 group-hover:text-brand-red transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{guide.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* For Employers */}
        <section className="py-12 px-4 bg-brand-dark-lighter">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-brand-red" />
              Für Arbeitgeber
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {employerGuides.map((guide) => (
                <Link
                  key={guide.title}
                  href={guide.href}
                  className="card hover:border-brand-red/50 transition-colors group"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red/30 transition-colors">
                      <guide.icon className="w-6 h-6 text-brand-red" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1 group-hover:text-brand-red transition-colors">
                        {guide.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{guide.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card text-center">
              <MessageSquare className="w-12 h-12 text-brand-red mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Nicht gefunden was du suchst?
              </h2>
              <p className="text-gray-400 mb-6">
                Unser Support-Team hilft dir gerne weiter. Schreib uns eine Nachricht!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/kontakt" className="btn-primary inline-flex items-center justify-center">
                  Kontakt aufnehmen
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
                <Link href="/faq" className="btn-secondary inline-flex items-center justify-center">
                  FAQ durchsuchen
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
