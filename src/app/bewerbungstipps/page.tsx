import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TipsContent from './TipsContent'

export const metadata: Metadata = {
  title: 'Bewerbungstipps - JobNachbar',
  description: 'Tipps und KI-Tools für deine erfolgreiche Bewerbung. Lebenslauf-Check, Anschreiben-Generator, Interview-Coach und mehr.',
}

export default function BewerbungstippsPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <TipsContent />
      <Footer />
    </div>
  )
}
