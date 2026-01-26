'use client'
import { useState } from 'react'
import { Mail, MapPin, Send } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function KontaktPage() {
  const [success, setSuccess] = useState(false)
  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSuccess(true) }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-white mb-4">Kontakt</h1>
        <p className="text-gray-400 mb-12">Haben Sie Fragen? Wir helfen Ihnen gerne.</p>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="card"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center"><Mail className="w-6 h-6 text-brand-red" /></div><div><h3 className="text-white font-semibold mb-1">E-Mail</h3><p className="text-gray-400"><a href="mailto:info@jobnachbar.com" className="hover:text-brand-red">info@jobnachbar.com</a></p></div></div></div>
            <div className="card"><div className="flex items-start gap-4"><div className="w-12 h-12 bg-brand-red/10 rounded-lg flex items-center justify-center"><MapPin className="w-6 h-6 text-brand-red" /></div><div><h3 className="text-white font-semibold mb-1">Adresse</h3><p className="text-gray-400">Idris Akkurt<br/>Feldstraße 22<br/>27404 Zeven</p></div></div></div>
          </div>
          <div className="card">
            {success ? (
              <div className="text-center py-8"><Send className="w-12 h-12 text-green-400 mx-auto mb-4" /><h2 className="text-xl font-semibold text-white mb-2">Nachricht gesendet!</h2><p className="text-gray-400">Wir melden uns bald.</p></div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="input-label">Name *</label><input type="text" className="input-field" required /></div>
                <div><label className="input-label">E-Mail *</label><input type="email" className="input-field" required /></div>
                <div><label className="input-label">Betreff</label><input type="text" className="input-field" /></div>
                <div><label className="input-label">Nachricht *</label><textarea className="input-field h-32" required /></div>
                <button type="submit" className="btn-primary w-full">Senden</button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
