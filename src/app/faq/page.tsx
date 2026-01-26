import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQAccordion from './FAQAccordion'

export const metadata: Metadata = {
  title: 'FAQ - Häufige Fragen - JobNachbar',
  description: 'Antworten auf häufig gestellte Fragen zu JobNachbar für Bewerber und Arbeitgeber.',
}

const applicantFaqs = [
  {
    question: 'Ist JobNachbar kostenlos?',
    answer: 'Ja, für Bewerber ist die Basis-Version komplett kostenlos. Du kannst dich registrieren, Jobs suchen und dich bewerben ohne einen Cent zu bezahlen. Für erweiterte Funktionen wie unbegrenzte KI-Tools gibt es JobNachbar Premium.',
  },
  {
    question: 'Welche Region deckt JobNachbar ab?',
    answer: 'Wir konzentrieren uns auf Zeven und einen Umkreis von 30km. Dazu gehören u.a. Rotenburg (Wümme), Bremervörde, Sittensen, Tarmstedt, Scheeßel und viele weitere Orte.',
  },
  {
    question: 'Wie bewerbe ich mich auf einen Job?',
    answer: 'Klicke auf einen Job, dann auf "Jetzt bewerben". Du kannst deinen Lebenslauf hochladen und ein Anschreiben hinzufügen. Der Arbeitgeber erhält deine Bewerbung direkt.',
  },
  {
    question: 'Kann ich meinen Lebenslauf hochladen?',
    answer: 'Ja! Gehe in dein Dashboard unter "Profil" und lade dort deinen Lebenslauf als PDF hoch. Er wird dann bei jeder Bewerbung automatisch mitgeschickt.',
  },
  {
    question: 'Was ist JobNachbar Premium?',
    answer: 'Mit Premium (4,99€/Monat) bekommst du unbegrenzten Zugang zu unseren KI-Tools: Lebenslauf-Generator, Anschreiben-Generator, Interview-Coach und mehr.',
  },
  {
    question: 'Wie erfahre ich von neuen passenden Jobs?',
    answer: 'Aktiviere die E-Mail-Benachrichtigungen in deinem Profil. Wir schicken dir dann automatisch neue Jobs, die zu deinen Wünschen passen.',
  },
  {
    question: 'Sind meine Daten sicher?',
    answer: 'Ja. Wir speichern deine Daten DSGVO-konform in Deutschland. Dein Profil sehen nur Arbeitgeber, bei denen du dich bewirbst.',
  },
]

const employerFaqs = [
  {
    question: 'Was kostet eine Stellenanzeige?',
    answer: 'Wir bieten verschiedene Pakete an - schon ab 29€ pro Monat. Alle Details findest du auf unserer Preisseite.',
  },
  {
    question: 'Wie lange läuft meine Anzeige?',
    answer: 'Je nach Paket 30, 60 oder 90 Tage. Du kannst sie jederzeit verlängern oder pausieren.',
  },
  {
    question: 'Kann ich mehrere Stellen gleichzeitig ausschreiben?',
    answer: 'Ja, mit unseren Starter- und Professional-Paketen kannst du mehrere Stellen gleichzeitig online haben.',
  },
  {
    question: 'Wie erreichen mich die Bewerbungen?',
    answer: 'Du bekommst eine E-Mail-Benachrichtigung und kannst alle Bewerbungen in deinem Dashboard verwalten und beantworten.',
  },
]

const generalFaqs = [
  {
    question: 'Wer steckt hinter JobNachbar?',
    answer: 'JobNachbar wurde 2026 gegründet. Mehr erfährst du auf unserer "Über uns" Seite.',
  },
  {
    question: 'Ich habe einen Fehler gefunden / eine Idee',
    answer: 'Super! Nutze den Feedback-Button auf jeder Seite oder schreib uns über das Kontaktformular.',
  },
  {
    question: 'Wie kann ich meinen Account löschen?',
    answer: 'Schreib uns eine kurze E-Mail an info@jobnachbar.com und wir löschen alle deine Daten innerhalb von 48 Stunden.',
  },
]

// Generate JSON-LD for FAQ Schema
function generateFAQSchema() {
  const allFaqs = [...applicantFaqs, ...employerFaqs, ...generalFaqs]

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateFAQSchema()),
        }}
      />

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Häufige Fragen
            </h1>
            <p className="text-xl text-gray-400">
              Antworten auf die wichtigsten Fragen zu JobNachbar
            </p>
          </div>
        </section>

        {/* FAQ Sections */}
        <section className="py-12 px-4">
          <div className="max-w-3xl mx-auto space-y-12">
            {/* For Applicants */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center mr-3 text-brand-red">
                  1
                </span>
                Für Bewerber
              </h2>
              <FAQAccordion items={applicantFaqs} />
            </div>

            {/* For Employers */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center mr-3 text-brand-red">
                  2
                </span>
                Für Arbeitgeber
              </h2>
              <FAQAccordion items={employerFaqs} />
            </div>

            {/* General */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <span className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center mr-3 text-brand-red">
                  3
                </span>
                Allgemein
              </h2>
              <FAQAccordion items={generalFaqs} />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="card text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Noch Fragen?
              </h2>
              <p className="text-gray-400 mb-6">
                Wir helfen dir gerne weiter. Kontaktiere uns oder nutze den Feedback-Button.
              </p>
              <Link href="/kontakt" className="btn-primary inline-flex items-center">
                Kontakt aufnehmen
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
