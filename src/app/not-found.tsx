import Link from 'next/link'
import { Home, Search, ArrowLeft, HelpCircle } from 'lucide-react'
import Logo from '@/components/Logo'
import LanguageSwitcher from '@/components/LanguageSwitcher'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-dark flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-brand-dark sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <div className="flex items-center gap-4">
              <LanguageSwitcher variant="header" />
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Anmelden
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="text-center max-w-lg">
          {/* 404 Illustration */}
          <div className="mb-8 relative">
            <span className="text-[150px] font-bold text-brand-red/20 leading-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-brand-red/10 rounded-full flex items-center justify-center">
                <Search className="w-12 h-12 text-brand-red" />
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Seite nicht gefunden
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            Die Seite, die du suchst, existiert leider nicht oder wurde verschoben. Keine Sorge, wir helfen dir weiter!
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/" className="btn-primary inline-flex items-center justify-center">
              <Home className="w-5 h-5 mr-2" />
              Zur Startseite
            </Link>
            <Link href="/jobs" className="btn-secondary inline-flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Jobs durchsuchen
            </Link>
          </div>

          {/* Quick Links */}
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-500 mb-4">Oder besuche eine dieser Seiten:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/fuer-arbeitgeber" className="text-gray-400 hover:text-brand-red transition-colors">
                Für Arbeitgeber
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/bewerbungstipps" className="text-gray-400 hover:text-brand-red transition-colors">
                Bewerbungstipps
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/faq" className="text-gray-400 hover:text-brand-red transition-colors">
                FAQ
              </Link>
              <span className="text-gray-700">•</span>
              <Link href="/kontakt" className="text-gray-400 hover:text-brand-red transition-colors">
                Kontakt
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© 2026 JobNachbar. Alle Rechte vorbehalten.</p>
          <div className="flex gap-4">
            <Link href="/impressum" className="hover:text-gray-300 transition-colors">
              Impressum
            </Link>
            <Link href="/datenschutz" className="hover:text-gray-300 transition-colors">
              Datenschutz
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
