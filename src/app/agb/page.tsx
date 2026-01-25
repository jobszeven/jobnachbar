import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'AGB - JobNachbar',
  description: 'Allgemeine Geschäftsbedingungen von JobNachbar',
}

export default function AGBPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Allgemeine Geschäftsbedingungen</h1>
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§1 Geltungsbereich</h2>
            <p className="text-gray-300">Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge zwischen JobNachbar (Idris Akkurt, Feldstraße 22, 27404 Zeven) und den Nutzern der Plattform.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§2 Leistungsbeschreibung</h2>
            <p className="text-gray-300">JobNachbar betreibt eine Online-Jobbörse für die Region Zeven und Umgebung. Die Plattform ermöglicht es Arbeitgebern, Stellenanzeigen zu veröffentlichen und Bewerbern, sich auf diese zu bewerben.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§3 Registrierung</h2>
            <p className="text-gray-300">Die Nutzung bestimmter Dienste setzt eine Registrierung voraus. Bei der Registrierung verpflichtet sich der Nutzer, wahrheitsgemäße Angaben zu machen und diese aktuell zu halten.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§4 Preise und Zahlung</h2>
            <p className="text-gray-300">Die aktuellen Preise sind auf der Preisseite einsehbar. Alle Preise verstehen sich zzgl. der gesetzlichen Mehrwertsteuer. Rechnungen sind innerhalb von 14 Tagen zu bezahlen.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§5 Vertragslaufzeit und Kündigung</h2>
            <p className="text-gray-300">Abonnements können jederzeit zum Monatsende gekündigt werden. Es gibt keine Mindestlaufzeit. Die Kündigung kann per E-Mail oder im Kundenbereich erfolgen.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§6 Haftung</h2>
            <p className="text-gray-300">JobNachbar haftet nicht für die Richtigkeit der von Nutzern eingestellten Inhalte. Für die Vermittlung zwischen Arbeitgebern und Bewerbern übernehmen wir keine Garantie.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§7 Datenschutz</h2>
            <p className="text-gray-300">Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den geltenden Datenschutzgesetzen.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§8 Schlussbestimmungen</h2>
            <p className="text-gray-300">Es gilt deutsches Recht. Gerichtsstand ist Zeven. Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
