import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    template: '%s - KI-Tools - JobNachbar',
    default: 'KI-Tools - JobNachbar',
  },
  description: 'Nutze unsere KI-Tools für deine Bewerbung: Lebenslauf-Check, Anschreiben-Generator, Interview-Coach und mehr.',
}

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
