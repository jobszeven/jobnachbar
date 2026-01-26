'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, User, Building2, MessageSquare, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface GuideItem {
  title: string
  description: string
  content: string[]
}

const applicantGuides: GuideItem[] = [
  {
    title: 'Account erstellen',
    description: 'Schritt-für-Schritt Anleitung zur Registrierung',
    content: [
      '1. Klicke auf "Registrieren" oben rechts',
      '2. Wähle "Bewerber" aus',
      '3. Gib deine E-Mail-Adresse und ein sicheres Passwort ein',
      '4. Bestätige deine E-Mail-Adresse über den Link in der E-Mail',
      '5. Vervollständige dein Profil mit deinen persönlichen Daten',
    ],
  },
  {
    title: 'Profil vervollständigen',
    description: 'So erstellst du ein überzeugendes Profil',
    content: [
      'Ein vollständiges Profil erhöht deine Chancen auf Einladungen zu Vorstellungsgesprächen.',
      '• Füge ein professionelles Foto hinzu',
      '• Beschreibe deine Berufserfahrung detailliert',
      '• Liste deine Fähigkeiten und Qualifikationen auf',
      '• Gib deine Gehaltsvorstellungen an',
      '• Lade deinen Lebenslauf als PDF hoch',
    ],
  },
  {
    title: 'Jobs finden & bewerben',
    description: 'Tipps zur effektiven Jobsuche',
    content: [
      '• Nutze die Filteroptionen um passende Jobs zu finden',
      '• Speichere interessante Jobs als Favoriten',
      '• Aktiviere Job-Benachrichtigungen für neue Stellen',
      '• Bewirb dich direkt mit einem Klick auf interessante Stellen',
      '• Verfolge den Status deiner Bewerbungen im Dashboard',
    ],
  },
  {
    title: 'KI-Tools nutzen',
    description: 'Anleitung für Lebenslauf-Check & mehr',
    content: [
      'JobNachbar bietet kostenlose KI-Tools für deine Bewerbung:',
      '• Lebenslauf-Check: Lass deinen Lebenslauf analysieren und verbessern',
      '• Anschreiben-Generator: Erstelle individuelle Anschreiben mit KI',
      '• Interview-Coach: Übe typische Fragen für deine Branche',
      '• Gehaltsrechner: Finde heraus, was du verdienen kannst',
      'Finde alle Tools unter "Bewerbungstipps" im Menü.',
    ],
  },
  {
    title: 'Premium-Vorteile',
    description: 'Was bietet JobNachbar Premium?',
    content: [
      'Mit Premium erhältst du:',
      '• Unbegrenzte KI-Tool-Nutzung',
      '• Dein Profil wird Arbeitgebern priorisiert angezeigt',
      '• Erweiterte Filteroptionen',
      '• Keine Werbung',
      '• Exklusive Premium-Support',
      'Premium kostet nur 4,99€/Monat oder 39,99€/Jahr.',
    ],
  },
  {
    title: 'Datenschutz & Sicherheit',
    description: 'Wie wir deine Daten schützen',
    content: [
      '• Deine Daten werden verschlüsselt übertragen und gespeichert',
      '• Wir geben keine Daten an Dritte weiter',
      '• Du entscheidest, welche Infos Arbeitgeber sehen können',
      '• Dein Profil kann jederzeit unsichtbar geschaltet werden',
      '• Du kannst dein Konto und alle Daten jederzeit löschen',
      'Mehr Infos findest du in unserer Datenschutzerklärung.',
    ],
  },
]

const employerGuides: GuideItem[] = [
  {
    title: 'Firmenprofil einrichten',
    description: 'So präsentieren Sie Ihr Unternehmen',
    content: [
      '1. Registrieren Sie sich als Arbeitgeber',
      '2. Laden Sie Ihr Firmenlogo hoch',
      '3. Beschreiben Sie Ihr Unternehmen und die Unternehmenskultur',
      '4. Fügen Sie Bilder vom Arbeitsplatz hinzu',
      '5. Geben Sie Kontaktdaten und Standort an',
      'Ein vollständiges Profil wirkt professioneller auf Bewerber.',
    ],
  },
  {
    title: 'Stellenanzeige erstellen',
    description: 'Tipps für eine erfolgreiche Anzeige',
    content: [
      '• Wählen Sie einen klaren, aussagekräftigen Titel',
      '• Beschreiben Sie die Aufgaben detailliert',
      '• Listen Sie erforderliche Qualifikationen auf',
      '• Nennen Sie Benefits und Vorteile',
      '• Geben Sie Gehaltsspanne an (erhöht Bewerberanzahl)',
      '• Wählen Sie die passende Kategorie und den Standort',
    ],
  },
  {
    title: 'Bewerbungen verwalten',
    description: 'Effizientes Bewerbermanagement',
    content: [
      '• Alle Bewerbungen erscheinen in Ihrem Dashboard',
      '• Sortieren Sie Bewerber nach Status (neu, in Prüfung, eingeladen)',
      '• Laden Sie Lebensläufe direkt herunter',
      '• Kontaktieren Sie Bewerber mit einem Klick',
      '• Markieren Sie favorisierte Kandidaten',
      '• Archivieren Sie abgeschlossene Bewerbungen',
    ],
  },
  {
    title: 'Abo & Zahlung',
    description: 'Pakete und Zahlungsoptionen',
    content: [
      'JobNachbar bietet flexible Pakete für Arbeitgeber:',
      '• Starter (kostenlos): 1 aktive Stellenanzeige',
      '• Professional (29,99€/Monat): 5 aktive Anzeigen + Bewerber-Datenbank',
      '• Enterprise (79,99€/Monat): Unbegrenzt + Premium-Support',
      'Zahlung per Rechnung, Lastschrift oder Kreditkarte möglich.',
      'Alle Pakete monatlich kündbar.',
    ],
  },
]

function AccordionItem({ guide }: { guide: GuideItem }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-brand-dark-lighter transition-colors"
      >
        <div>
          <h3 className="font-semibold text-white">{guide.title}</h3>
          <p className="text-gray-400 text-sm">{guide.description}</p>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-brand-red flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        )}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-gray-700 pt-4">
          <ul className="space-y-2 text-gray-300">
            {guide.content.map((item, idx) => (
              <li key={idx} className="text-sm">{item}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

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

            {/* Search Bar (Visual) */}
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
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <User className="w-6 h-6 mr-3 text-brand-red" />
              Für Bewerber
            </h2>

            <div className="space-y-4">
              {applicantGuides.map((guide) => (
                <AccordionItem key={guide.title} guide={guide} />
              ))}
            </div>
          </div>
        </section>

        {/* For Employers */}
        <section className="py-12 px-4 bg-brand-dark-lighter">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
              <Building2 className="w-6 h-6 mr-3 text-brand-red" />
              Für Arbeitgeber
            </h2>

            <div className="space-y-4">
              {employerGuides.map((guide) => (
                <AccordionItem key={guide.title} guide={guide} />
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
