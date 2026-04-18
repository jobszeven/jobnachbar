import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export async function generateMetadata() {
  const t = await getTranslations('privacy')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function DatenschutzPage() {
  const t = await getTranslations('privacy')

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Datenschutzerklärung</h1>
        <p className="text-gray-400 mb-8">Stand: Februar 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* 1. Verantwortlicher */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">1. Verantwortlicher</h2>
            <p className="text-gray-300">
              Verantwortlicher für die Datenverarbeitung auf dieser Website ist:
            </p>
            <p className="text-gray-300 mt-2">
              Idris Akkurt<br />
              Feldstraße 22<br />
              27404 Zeven<br />
              Deutschland
            </p>
            <p className="text-gray-300 mt-2">
              Telefon: +49 152 04753679<br />
              E-Mail: <a href="mailto:info@jobnachbar.com" className="text-brand-red hover:underline">info@jobnachbar.com</a>
            </p>
          </section>

          {/* 2. Übersicht der Datenverarbeitungen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">2. Übersicht der Datenverarbeitungen</h2>
            <p className="text-gray-300">
              Wir verarbeiten personenbezogene Daten nur, wenn dies für die Bereitstellung einer funktionsfähigen
              Website sowie unserer Inhalte und Leistungen erforderlich ist. Die Verarbeitung personenbezogener
              Daten erfolgt regelmäßig nur nach Einwilligung des Nutzers oder in Fällen, in denen eine vorherige
              Einholung einer Einwilligung aus tatsächlichen Gründen nicht möglich ist und die Verarbeitung der
              Daten durch gesetzliche Vorschriften gestattet ist.
            </p>
          </section>

          {/* 3. Rechtsgrundlagen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">3. Rechtsgrundlagen der Verarbeitung</h2>
            <p className="text-gray-300">Wir verarbeiten Ihre Daten auf folgenden Rechtsgrundlagen:</p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li><strong>Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):</strong> Wenn Sie uns eine ausdrückliche Einwilligung zur Verarbeitung erteilt haben (z.B. Cookie-Einwilligung für Statistik/Marketing).</li>
              <li><strong>Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung):</strong> Wenn die Verarbeitung zur Erfüllung eines Vertrags mit Ihnen erforderlich ist (z.B. Nutzerregistrierung, Bewerbungsverarbeitung).</li>
              <li><strong>Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung):</strong> Wenn wir einer rechtlichen Verpflichtung unterliegen (z.B. steuerliche Aufbewahrungspflichten).</li>
              <li><strong>Art. 6 Abs. 1 lit. f DSGVO (Berechtigte Interessen):</strong> Wenn die Verarbeitung zur Wahrung unserer berechtigten Interessen erforderlich ist (z.B. IT-Sicherheit, Betrugsverhinderung).</li>
            </ul>
          </section>

          {/* 4. Registrierung und Nutzerkonto */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">4. Registrierung und Nutzerkonto</h2>
            <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.1 Bewerber-Registrierung</h3>
            <p className="text-gray-300">
              <strong>Verarbeitete Daten:</strong> E-Mail-Adresse, Passwort (verschlüsselt), Vorname, Nachname,
              Telefonnummer (optional), PLZ, Ort, Branchenpräferenzen, Gehaltsvorstellungen, Lebenslauf.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Speicherdauer:</strong> Bis zur Löschung des Accounts durch den Nutzer oder bei Inaktivität nach 24 Monaten.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">4.2 Arbeitgeber-Registrierung</h3>
            <p className="text-gray-300">
              <strong>Verarbeitete Daten:</strong> E-Mail-Adresse, Passwort (verschlüsselt), Firmenname,
              Ansprechpartner, Adresse, Telefonnummer, Unternehmenswebsite.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Speicherdauer:</strong> Während der Vertragsbeziehung und danach für 10 Jahre (steuerliche Aufbewahrungspflichten).
            </p>
          </section>

          {/* 5. Bewerbungen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">5. Bewerbungsverarbeitung</h2>
            <p className="text-gray-300">
              <strong>Verarbeitete Daten:</strong> Bewerbungsunterlagen (Lebenslauf, Anschreiben),
              Kontaktdaten, Kommunikation mit Arbeitgebern.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO i.V.m. § 26 BDSG (Beschäftigungsverhältnis)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Speicherdauer:</strong> Bewerbungen werden 6 Monate nach Abschluss des Bewerbungsverfahrens
              gelöscht, sofern keine längere Aufbewahrung erforderlich ist.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Empfänger:</strong> Die Bewerbungsdaten werden ausschließlich an den jeweiligen Arbeitgeber
              übermittelt, auf dessen Stellenanzeige Sie sich beworben haben.
            </p>
          </section>

          {/* 6. Cookies */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">6. Cookies</h2>
            <p className="text-gray-300">
              Unsere Website verwendet Cookies. Dabei handelt es sich um kleine Textdateien, die auf Ihrem
              Endgerät gespeichert werden.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.1 Notwendige Cookies</h3>
            <p className="text-gray-300">
              Diese Cookies sind für den Betrieb der Website unerlässlich (Session-Cookies, Authentifizierung).
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse)
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.2 Statistik-Cookies (Google Analytics 4)</h3>
            <p className="text-gray-300">
              Nur mit Ihrer ausdrücklichen Einwilligung nutzen wir Google Analytics 4, um die Nutzung unserer
              Website statistisch zu analysieren.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Anbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Speicherdauer:</strong> 14 Monate
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Drittlandübermittlung:</strong> Eine Übermittlung in die USA kann stattfinden. Google ist
              unter dem EU-U.S. Data Privacy Framework zertifiziert.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Opt-out:</strong> Sie können Ihre Einwilligung jederzeit über unsere Cookie-Einstellungen widerrufen.
            </p>

            <h3 className="text-xl font-semibold text-white mt-6 mb-3">6.3 Marketing-Cookies (Meta Pixel)</h3>
            <p className="text-gray-300">
              Nur mit Ihrer ausdrücklichen Einwilligung nutzen wir das Meta Pixel (Facebook) für Werbezwecke.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Anbieter:</strong> Meta Platforms Ireland Limited, 4 Grand Canal Square, Dublin 2, Irland
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Speicherdauer:</strong> 90 Tage
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Drittlandübermittlung:</strong> Eine Übermittlung in die USA kann stattfinden. Meta ist
              unter dem EU-U.S. Data Privacy Framework zertifiziert.
            </p>
          </section>

          {/* 7. Hosting */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">7. Hosting</h2>
            <p className="text-gray-300">
              Unsere Website wird bei Vercel Inc. gehostet.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Anbieter:</strong> Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Verarbeitete Daten:</strong> IP-Adresse, Zeitpunkt des Zugriffs, übertragene Datenmenge,
              Referrer-URL, Browser und Betriebssystem.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse an einer
              sicheren und effizienten Bereitstellung)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Speicherdauer Server-Logs:</strong> 7 Tage
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Drittlandübermittlung:</strong> Vercel ist unter dem EU-U.S. Data Privacy Framework zertifiziert.
            </p>
          </section>

          {/* 8. Datenbank */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">8. Datenbank (Supabase)</h2>
            <p className="text-gray-300">
              Für die Speicherung von Nutzerdaten nutzen wir Supabase.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Anbieter:</strong> Supabase Inc., 970 Toa Payoh North #07-04, Singapore 318992
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Serverstandort:</strong> Frankfurt am Main, Deutschland (AWS eu-central-1)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Verarbeitete Daten:</strong> Alle Nutzerdaten (Profile, Bewerbungen, Stellenanzeigen)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Auftragsverarbeitung:</strong> Es besteht ein Auftragsverarbeitungsvertrag (AVV) mit Supabase.
            </p>
          </section>

          {/* 9. E-Mail-Versand */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">9. E-Mail-Versand (Resend)</h2>
            <p className="text-gray-300">
              Für den Versand von E-Mails (Registrierung, Benachrichtigungen) nutzen wir Resend.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Anbieter:</strong> Resend Inc., 2261 Market Street #4612, San Francisco, CA 94114, USA
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Verarbeitete Daten:</strong> E-Mail-Adresse, Name, E-Mail-Inhalt
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>
          </section>

          {/* 10. KI-Dienste */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">10. KI-gestützte Bewerbungstools</h2>
            <p className="text-gray-300">
              Für unsere Bewerbungstools (Lebenslauf-Check, Anschreiben-Generator, Interview-Coach) nutzen wir
              die Google Gemini API.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Anbieter:</strong> Google Ireland Limited, Gordon House, Barrow Street, Dublin 4, Irland
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Verarbeitete Daten:</strong> Vom Nutzer eingegebene Texte (z.B. Lebenslauf-Inhalte)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung bei registrierten
              Nutzern) bzw. Art. 6 Abs. 1 lit. a DSGVO (Einwilligung bei Gastnutzung)
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Speicherdauer:</strong> Eingaben werden nicht dauerhaft gespeichert und nach Verarbeitung gelöscht.
            </p>
          </section>

          {/* 11. Zahlungsabwicklung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">11. Zahlungsabwicklung (Stripe)</h2>
            <p className="text-gray-300">
              Für die Abwicklung von Zahlungen nutzen wir den Zahlungsdienstleister Stripe.
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Anbieter:</strong> Stripe Payments Europe, Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, Irland
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Verarbeitete Daten:</strong> Zahlungsdaten, Transaktionsinformationen
            </p>
            <p className="text-gray-300 mt-2">
              <strong>Rechtsgrundlage:</strong> Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
            </p>
            <p className="text-gray-300 mt-2">
              Weitere Informationen finden Sie in der{' '}
              <a href="https://stripe.com/de/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                Datenschutzerklärung von Stripe
              </a>.
            </p>
          </section>

          {/* 12. Betroffenenrechte */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">12. Ihre Rechte als betroffene Person</h2>
            <p className="text-gray-300">Sie haben folgende Rechte:</p>
            <ul className="list-disc list-inside text-gray-300 mt-4 space-y-2">
              <li><strong>Auskunftsrecht (Art. 15 DSGVO):</strong> Sie können Auskunft über die bei uns gespeicherten Daten verlangen.</li>
              <li><strong>Recht auf Berichtigung (Art. 16 DSGVO):</strong> Sie können die Berichtigung unrichtiger Daten verlangen.</li>
              <li><strong>Recht auf Löschung (Art. 17 DSGVO):</strong> Sie können die Löschung Ihrer Daten verlangen, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.</li>
              <li><strong>Recht auf Einschränkung (Art. 18 DSGVO):</strong> Sie können die Einschränkung der Verarbeitung verlangen.</li>
              <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO):</strong> Sie können Ihre Daten in einem maschinenlesbaren Format erhalten.</li>
              <li><strong>Widerspruchsrecht (Art. 21 DSGVO):</strong> Sie können der Verarbeitung Ihrer Daten widersprechen.</li>
              <li><strong>Widerrufsrecht (Art. 7 Abs. 3 DSGVO):</strong> Sie können eine erteilte Einwilligung jederzeit widerrufen.</li>
            </ul>
            <p className="text-gray-300 mt-4">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{' '}
              <a href="mailto:info@jobnachbar.com" className="text-brand-red hover:underline">info@jobnachbar.com</a>
            </p>
          </section>

          {/* 13. Beschwerderecht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">13. Beschwerderecht bei der Aufsichtsbehörde</h2>
            <p className="text-gray-300">
              Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren, wenn Sie der
              Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen die DSGVO verstößt.
            </p>
            <p className="text-gray-300 mt-4">
              <strong>Zuständige Aufsichtsbehörde:</strong><br />
              Die Landesbeauftragte für den Datenschutz Niedersachsen<br />
              Prinzenstraße 5<br />
              30159 Hannover<br />
              Telefon: +49 511 120-4500<br />
              E-Mail: poststelle@lfd.niedersachsen.de<br />
              Website:{' '}
              <a href="https://www.lfd.niedersachsen.de" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
                www.lfd.niedersachsen.de
              </a>
            </p>
          </section>

          {/* 14. Speicherfristen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">14. Speicherfristen im Überblick</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-gray-300 mt-4">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 pr-4">Datenart</th>
                    <th className="text-left py-2">Speicherdauer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  <tr>
                    <td className="py-2 pr-4">Bewerber-Accountdaten</td>
                    <td className="py-2">Bis Löschung / 24 Monate Inaktivität</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Arbeitgeber-Accountdaten</td>
                    <td className="py-2">Während Vertragsverhältnis + 10 Jahre</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Bewerbungen</td>
                    <td className="py-2">6 Monate nach Verfahrensabschluss</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Server-Logs</td>
                    <td className="py-2">7 Tage</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Cookie-Einwilligung</td>
                    <td className="py-2">12 Monate</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Google Analytics Daten</td>
                    <td className="py-2">14 Monate</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Rechnungsdaten</td>
                    <td className="py-2">10 Jahre (steuerliche Pflicht)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 15. Änderungen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">15. Änderungen dieser Datenschutzerklärung</h2>
            <p className="text-gray-300">
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um sie an geänderte Rechtslagen
              oder bei Änderungen unserer Datenverarbeitungen anzupassen. Die aktuelle Version finden Sie
              stets auf dieser Seite.
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
