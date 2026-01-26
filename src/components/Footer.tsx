import Link from 'next/link'
import Logo from './Logo'

const locations = [
  { name: 'Zeven', slug: 'zeven' },
  { name: 'Rotenburg (Wümme)', slug: 'rotenburg-wuemme' },
  { name: 'Sittensen', slug: 'sittensen' },
  { name: 'Bremervörde', slug: 'bremervoerde' },
  { name: 'Tarmstedt', slug: 'tarmstedt' },
  { name: 'Scheeßel', slug: 'scheessel' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 py-12 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-gray-400 text-sm">
              Die lokale Jobbörse für Zeven und Umgebung.
            </p>
          </div>

          {/* Für Bewerber */}
          <div>
            <h4 className="text-white font-semibold mb-4">Für Bewerber</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/jobs" className="hover:text-brand-red transition-colors">
                  Jobs finden
                </Link>
              </li>
              <li>
                <Link href="/registrieren/bewerber" className="hover:text-brand-red transition-colors">
                  Profil erstellen
                </Link>
              </li>
              <li>
                <Link href="/bewerbungstipps" className="hover:text-brand-red transition-colors">
                  Bewerbungstipps
                </Link>
              </li>
              <li>
                <Link href="/preise/bewerber" className="hover:text-brand-red transition-colors">
                  Premium für Bewerber
                </Link>
              </li>
            </ul>
          </div>

          {/* Für Arbeitgeber */}
          <div>
            <h4 className="text-white font-semibold mb-4">Für Arbeitgeber</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/registrieren/arbeitgeber" className="hover:text-brand-red transition-colors">
                  Stelle ausschreiben
                </Link>
              </li>
              <li>
                <Link href="/preise" className="hover:text-brand-red transition-colors">
                  Preise & Pakete
                </Link>
              </li>
              <li>
                <Link href="/erfolgsgeschichten" className="hover:text-brand-red transition-colors">
                  Erfolgsgeschichten
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-brand-red transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Unternehmen */}
          <div>
            <h4 className="text-white font-semibold mb-4">Unternehmen</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/ueber-uns" className="hover:text-brand-red transition-colors">
                  Über uns
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-red transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/hilfe" className="hover:text-brand-red transition-colors">
                  Hilfe-Center
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-brand-red transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Jobs in der Region */}
          <div>
            <h4 className="text-white font-semibold mb-4">Jobs in der Region</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {locations.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={`/jobs/standort/${location.slug}`}
                    className="hover:text-brand-red transition-colors"
                  >
                    Jobs in {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Rechtliches */}
          <div>
            <h4 className="text-white font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/impressum" className="hover:text-brand-red transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="hover:text-brand-red transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link href="/agb" className="hover:text-brand-red transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-brand-red transition-colors">
                  Cookie-Einstellungen
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {currentYear} JobNachbar. Alle Rechte vorbehalten.</p>
          <p className="mt-2 md:mt-0">
            Made with ❤️ in Zeven
          </p>
        </div>
      </div>
    </footer>
  )
}
