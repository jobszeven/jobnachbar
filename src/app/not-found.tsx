import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import Logo from '@/components/Logo'

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
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <span className="text-8xl font-bold text-brand-red">404</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Seite nicht gefunden
          </h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Die Seite, die du suchst, existiert leider nicht oder wurde verschoben.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary inline-flex items-center justify-center">
              <Home className="w-5 h-5 mr-2" />
              Zur Startseite
            </Link>
            <Link href="/jobs" className="btn-secondary inline-flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Jobs durchsuchen
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
