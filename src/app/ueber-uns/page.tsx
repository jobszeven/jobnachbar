import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: 'Über uns - JobNachbar',
  description: 'Die Geschichte von JobNachbar: Wie wir zur größten lokalen Jobbörse für Zeven und Umgebung wurden.',
}

export default function UeberUnsPage() {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <AboutContent />
      <Footer />
    </div>
  )
}
