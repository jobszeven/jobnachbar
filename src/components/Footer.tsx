import Link from 'next/link'
import Logo from './Logo'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-800 py-12 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Logo size="md" />
            </div>
            <p className="text-gray-400 max-w-md">
              Die lokale Jobbörse für Zeven, Rotenburg (Wümme) und Umgebung. 
              Wir bringen Arbeitgeber und Arbeitnehmer zusammen – schnell, einfach und fair.
            </p>
          </div>

          {/* Links für Bewerber */}
          <div>
            <h4 className="text-white font-semibold mb-4">Für Bewerber</h4>
            <ul className="space-y-2 text-gray-400">
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
            </ul>
          </div>

          {/* Links für Arbeitgeber */}
          <div>
            <h4 className="text-white font-semibold mb-4">Für Arbeitgeber</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/registrieren/arbeitgeber" className="hover:text-brand-red transition-colors">
                  Stelle ausschreiben
                </Link>
              </li>
              <li>
                <Link href="/preise" className="hover:text-brand-red transition-colors">
                  Preise
                </Link>
              </li>
              <li>
                <Link href="/kontakt" className="hover:text-brand-red transition-colors">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>© {currentYear} JobNachbar. Alle Rechte vorbehalten.</p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 md:mt-0">
            <Link href="/impressum" className="hover:text-brand-red transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-brand-red transition-colors">
              Datenschutz
            </Link>
            <Link href="/agb" className="hover:text-brand-red transition-colors">
              AGB
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
