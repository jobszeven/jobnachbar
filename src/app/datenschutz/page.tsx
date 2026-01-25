import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'Datenschutz - JobNachbar',
  description: 'Datenschutzerklärung von JobNachbar',
}

export default function DatenschutzPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Datenschutzerklärung</h1>
        <div className="prose prose-invert max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Datenschutz auf einen Blick</h2>
            <p className="text-gray-300">Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie diese Website besuchen.</p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Verantwortliche Stelle</h2>
            <p className="text-gray-300">Idris Akkurt<br />Feldstraße 22<br />27404 Zeven</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Datenerfassung auf dieser Website</h2>
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Cookies</h3>
            <p className="text-gray-300">Unsere Website verwendet Cookies. Das sind kleine Textdateien, die Ihr Webbrowser auf Ihrem Endgerät speichert. Cookies helfen uns dabei, unser Angebot nutzerfreundlicher zu machen.</p>
            
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">Server-Log-Dateien</h3>
            <p className="text-gray-300">Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Registrierung auf dieser Website</h2>
            <p className="text-gray-300">Sie können sich auf dieser Website registrieren, um zusätzliche Funktionen zu nutzen. Die eingegebenen Daten verwenden wir nur zum Zwecke der Nutzung des jeweiligen Angebotes oder Dienstes.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Ihre Rechte</h2>
            <p className="text-gray-300">Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger und den Zweck der Datenverarbeitung sowie ein Recht auf Berichtigung oder Löschung dieser Daten.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Hosting</h2>
            <p className="text-gray-300">Diese Website wird bei Vercel Inc. gehostet. Die Server befinden sich in der EU. Weitere Informationen finden Sie in der Datenschutzerklärung von Vercel.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Supabase</h2>
            <p className="text-gray-300">Wir nutzen Supabase für die Datenbankfunktionen. Die Server befinden sich in Frankfurt (EU). Supabase ist DSGVO-konform.</p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
