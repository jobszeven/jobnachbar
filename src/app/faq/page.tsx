import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FAQContent from './FAQContent'

export const metadata: Metadata = {
  title: 'FAQ - Häufige Fragen - JobNachbar',
  description: 'Antworten auf häufig gestellte Fragen zu JobNachbar für Bewerber und Arbeitgeber.',
}

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <FAQContent />
      <Footer />
    </div>
  )
}
