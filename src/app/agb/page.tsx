import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getTranslations } from 'next-intl/server'
import Link from 'next/link'

export async function generateMetadata() {
  const t = await getTranslations('terms')
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  }
}

export default async function AGBPage() {
  const t = await getTranslations('terms')

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Allgemeine Geschäftsbedingungen</h1>
        <p className="text-gray-400 mb-8">Stand: Februar 2026</p>

        <div className="prose prose-invert max-w-none space-y-8">
          {/* §1 Geltungsbereich */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§1 Geltungsbereich</h2>
            <p className="text-gray-300">
              (1) Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen
              Idris Akkurt, Feldstraße 22, 27404 Zeven (nachfolgend „JobNachbar" oder „wir") und
              den Nutzern der Plattform jobnachbar.com (nachfolgend „Nutzer" oder „Sie").
            </p>
            <p className="text-gray-300 mt-2">
              (2) Abweichende Bedingungen des Nutzers werden nicht anerkannt, es sei denn,
              JobNachbar stimmt ihrer Geltung ausdrücklich schriftlich zu.
            </p>
            <p className="text-gray-300 mt-2">
              (3) JobNachbar richtet sich sowohl an Verbraucher als auch an Unternehmer.
              Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken
              abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen
              beruflichen Tätigkeit zugerechnet werden können (§ 13 BGB).
            </p>
          </section>

          {/* §2 Leistungsbeschreibung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§2 Leistungsbeschreibung</h2>
            <p className="text-gray-300">
              (1) JobNachbar betreibt eine Online-Jobbörse für die Region Zeven und Umgebung
              (ca. 30 km Radius).
            </p>
            <p className="text-gray-300 mt-2">
              (2) Arbeitssuchende (Bewerber) können:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Kostenlos ein Profil erstellen</li>
              <li>Nach Stellenangeboten suchen</li>
              <li>Sich auf Stellen bewerben</li>
              <li>KI-gestützte Bewerbungstools nutzen (teilweise kostenpflichtig)</li>
            </ul>
            <p className="text-gray-300 mt-4">
              (3) Arbeitgeber können:
            </p>
            <ul className="list-disc list-inside text-gray-300 mt-2 space-y-1">
              <li>Stellenanzeigen veröffentlichen (kostenpflichtig, erste Anzeige kostenlos)</li>
              <li>Bewerber kontaktieren</li>
              <li>Bewerbungen verwalten</li>
            </ul>
          </section>

          {/* §3 Registrierung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§3 Registrierung und Nutzerkonten</h2>
            <p className="text-gray-300">
              (1) Für die Nutzung bestimmter Funktionen ist eine Registrierung erforderlich.
              Die Registrierung ist nur volljährigen Personen gestattet.
            </p>
            <p className="text-gray-300 mt-2">
              (2) Der Nutzer ist verpflichtet, bei der Registrierung wahrheitsgemäße und
              vollständige Angaben zu machen.
            </p>
            <p className="text-gray-300 mt-2">
              (3) Der Nutzer ist verpflichtet, seine Zugangsdaten vertraulich zu behandeln
              und vor dem Zugriff Dritter zu schützen.
            </p>
            <p className="text-gray-300 mt-2">
              (4) Bei Verdacht auf Missbrauch oder Verstoß gegen diese AGB kann JobNachbar
              das Konto vorübergehend sperren oder dauerhaft löschen.
            </p>
          </section>

          {/* §4 Preise */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§4 Preise und Zahlungsbedingungen</h2>
            <p className="text-gray-300">
              (1) Die Nutzung für Arbeitssuchende ist grundsätzlich kostenlos. Für erweiterte
              Funktionen (Premium-Mitgliedschaft) können Gebühren anfallen.
            </p>
            <p className="text-gray-300 mt-2">
              (2) Für Arbeitgeber gelten die auf der Preisseite (jobnachbar.com/preise)
              angegebenen Tarife.
            </p>
            <p className="text-gray-300 mt-2">
              (3) Alle Preise verstehen sich in Euro inklusive der gesetzlichen Mehrwertsteuer.
            </p>
            <p className="text-gray-300 mt-2">
              (4) Die Zahlung erfolgt per Kreditkarte, SEPA-Lastschrift oder anderen
              angebotenen Zahlungsmethoden über unseren Zahlungsdienstleister Stripe.
            </p>
            <p className="text-gray-300 mt-2">
              (5) Rechnungen sind innerhalb von 14 Tagen nach Rechnungsstellung zu bezahlen.
            </p>
          </section>

          {/* §5 Vertragsschluss */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§5 Vertragsschluss und Laufzeit</h2>
            <p className="text-gray-300">
              (1) Mit der Registrierung kommt ein Nutzungsvertrag zwischen dem Nutzer und
              JobNachbar zustande.
            </p>
            <p className="text-gray-300 mt-2">
              (2) Kostenpflichtige Abonnements (Arbeitgeber-Pakete, Premium-Mitgliedschaften)
              verlängern sich automatisch um den gebuchten Zeitraum, sofern nicht vor Ablauf
              gekündigt wird.
            </p>
            <p className="text-gray-300 mt-2">
              (3) Die Kündigung kann jederzeit zum Ende des Abrechnungszeitraums erfolgen.
              Die Kündigung kann per E-Mail an info@jobnachbar.com erfolgen.
            </p>
            <p className="text-gray-300 mt-2">
              (4) Bei kostenloser Nutzung kann das Konto jederzeit ohne Einhaltung einer
              Frist gelöscht werden.
            </p>
          </section>

          {/* §6 Widerrufsrecht */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§6 Widerrufsrecht für Verbraucher</h2>
            <div className="bg-brand-card border border-gray-700 rounded-lg p-6 mt-4">
              <h3 className="text-xl font-semibold text-white mb-4">Widerrufsbelehrung</h3>
              <p className="text-gray-300">
                <strong>Widerrufsrecht</strong><br />
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen
                Vertrag zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag
                des Vertragsabschlusses.
              </p>
              <p className="text-gray-300 mt-4">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
              </p>
              <p className="text-gray-300 mt-2">
                Idris Akkurt<br />
                Feldstraße 22<br />
                27404 Zeven<br />
                E-Mail: info@jobnachbar.com<br />
                Telefon: +49 152 04753679
              </p>
              <p className="text-gray-300 mt-4">
                mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief
                oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
              </p>
              <p className="text-gray-300 mt-4">
                <strong>Folgen des Widerrufs</strong><br />
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir
                von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen
                ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses
                Vertrags bei uns eingegangen ist.
              </p>
              <p className="text-gray-300 mt-4">
                <strong>Besonderer Hinweis</strong><br />
                Ihr Widerrufsrecht erlischt vorzeitig, wenn wir mit der Ausführung der
                Dienstleistung mit Ihrer ausdrücklichen Zustimmung vor Ablauf der
                Widerrufsfrist begonnen haben und Sie Ihre Kenntnis davon bestätigt haben,
                dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr
                Widerrufsrecht verlieren.
              </p>
            </div>
          </section>

          {/* §7 Pflichten des Nutzers */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§7 Pflichten des Nutzers</h2>
            <p className="text-gray-300">
              (1) Der Nutzer verpflichtet sich, keine rechtswidrigen, beleidigenden,
              diskriminierenden oder anderweitig unzulässigen Inhalte zu veröffentlichen.
            </p>
            <p className="text-gray-300 mt-2">
              (2) Es ist untersagt, falsche Stellenanzeigen zu veröffentlichen oder
              Bewerbungen unter falscher Identität einzureichen.
            </p>
            <p className="text-gray-300 mt-2">
              (3) Die automatisierte Erfassung von Daten (Scraping) ist ohne ausdrückliche
              schriftliche Genehmigung untersagt.
            </p>
          </section>

          {/* §8 Haftung */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§8 Haftung</h2>
            <p className="text-gray-300">
              (1) JobNachbar haftet unbeschränkt für Schäden aus der Verletzung des Lebens,
              des Körpers oder der Gesundheit, die auf einer fahrlässigen oder vorsätzlichen
              Pflichtverletzung beruhen.
            </p>
            <p className="text-gray-300 mt-2">
              (2) JobNachbar haftet unbeschränkt für sonstige Schäden, die auf einer
              vorsätzlichen oder grob fahrlässigen Pflichtverletzung beruhen.
            </p>
            <p className="text-gray-300 mt-2">
              (3) Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten
              (Kardinalpflichten) ist die Haftung auf den vertragstypischen, vorhersehbaren
              Schaden begrenzt.
            </p>
            <p className="text-gray-300 mt-2">
              (4) Für die Richtigkeit der von Nutzern eingestellten Inhalte (Stellenanzeigen,
              Profile, Bewerbungen) übernimmt JobNachbar keine Gewähr.
            </p>
            <p className="text-gray-300 mt-2">
              (5) JobNachbar vermittelt lediglich den Kontakt zwischen Arbeitgebern und
              Bewerbern. Für das Zustandekommen eines Arbeitsverhältnisses oder dessen
              Inhalt übernimmt JobNachbar keine Haftung.
            </p>
          </section>

          {/* §9 Datenschutz */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§9 Datenschutz</h2>
            <p className="text-gray-300">
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer{' '}
              <Link href="/datenschutz" className="text-brand-red hover:underline">
                Datenschutzerklärung
              </Link>{' '}
              und den geltenden Datenschutzgesetzen (DSGVO, BDSG).
            </p>
          </section>

          {/* §10 Schlussbestimmungen */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">§10 Schlussbestimmungen</h2>
            <p className="text-gray-300">
              (1) Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des
              UN-Kaufrechts.
            </p>
            <p className="text-gray-300 mt-2">
              (2) Erfüllungsort ist Zeven.
            </p>
            <p className="text-gray-300 mt-2">
              (3) Gerichtsstand für alle Streitigkeiten aus diesem Vertrag ist, soweit
              gesetzlich zulässig, der Sitz von JobNachbar (Zeven). Dies gilt nicht für
              Verbraucher mit Wohnsitz in der EU.
            </p>
            <p className="text-gray-300 mt-2">
              (4) Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, so
              bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
            </p>
            <p className="text-gray-300 mt-2">
              (5) JobNachbar behält sich vor, diese AGB jederzeit zu ändern. Die geänderten
              AGB werden den Nutzern per E-Mail mitgeteilt. Widerspricht der Nutzer den
              geänderten AGB nicht innerhalb von 30 Tagen, gelten diese als akzeptiert.
            </p>
          </section>

          {/* Kontakt */}
          <section className="border-t border-gray-700 pt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Kontakt</h2>
            <p className="text-gray-300">
              Bei Fragen zu diesen AGB wenden Sie sich bitte an:
            </p>
            <p className="text-gray-300 mt-2">
              Idris Akkurt<br />
              Feldstraße 22<br />
              27404 Zeven<br />
              E-Mail:{' '}
              <a href="mailto:info@jobnachbar.com" className="text-brand-red hover:underline">
                info@jobnachbar.com
              </a><br />
              Telefon: +49 152 04753679
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
