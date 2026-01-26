'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Crown, Check, ArrowLeft, Loader2, Mail, User, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function PremiumCheckoutPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    duration: '1', // months
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const getPrice = () => {
    const months = parseInt(formData.duration)
    const monthlyPrice = 4.99
    const discount = months >= 12 ? 0.2 : months >= 6 ? 0.1 : 0
    const totalPrice = monthlyPrice * months * (1 - discount)
    return {
      total: totalPrice.toFixed(2),
      monthly: (totalPrice / months).toFixed(2),
      discount: Math.round(discount * 100),
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.address || !formData.city || !formData.postalCode) {
      toast.error('Bitte fülle alle Felder aus')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/premium/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: getPrice().total,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Fehler bei der Anfrage')
        return
      }

      toast.success('Anfrage erfolgreich! Du erhältst eine E-Mail mit der Rechnung.')
      router.push('/premium/success')
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setIsSubmitting(false)
    }
  }

  const price = getPrice()

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/premium" className="inline-flex items-center text-gray-400 hover:text-white mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zur Übersicht
          </Link>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div>
              <div className="card sticky top-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Crown className="w-7 h-7 text-yellow-500" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">JobNachbar Premium</h2>
                    <p className="text-gray-400">Unbegrenzter Zugang zu allen KI-Tools</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    Unbegrenzte Lebenslauf-Checks
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    Unbegrenzte Anschreiben
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    Interview-Coach unbegrenzt
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    Gehaltstipps unbegrenzt
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Check className="w-5 h-5 text-green-500 mr-3" />
                    Premium-Badge im Profil
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4 mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Laufzeit wählen
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="1">1 Monat - 4,99€</option>
                    <option value="3">3 Monate - 14,97€</option>
                    <option value="6">6 Monate - 26,94€ (10% Rabatt)</option>
                    <option value="12">12 Monate - 47,90€ (20% Rabatt)</option>
                  </select>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <div className="flex justify-between text-gray-400 mb-2">
                    <span>Preis pro Monat</span>
                    <span>{price.monthly}€</span>
                  </div>
                  {price.discount > 0 && (
                    <div className="flex justify-between text-green-500 mb-2">
                      <span>Rabatt</span>
                      <span>-{price.discount}%</span>
                    </div>
                  )}
                  <div className="flex justify-between text-white text-xl font-bold">
                    <span>Gesamt</span>
                    <span>{price.total}€</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div>
              <div className="card">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-brand-red" />
                  Rechnungsdaten
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Vollständiger Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Max Mustermann"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      E-Mail-Adresse *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="max@beispiel.de"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Straße und Hausnummer *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Musterstraße 123"
                      className="input-field"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        PLZ *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="27404"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Ort *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Zeven"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm">
                    <p className="text-blue-400 font-medium mb-2">So funktioniert&apos;s:</p>
                    <ol className="text-gray-400 space-y-1 list-decimal list-inside">
                      <li>Du erhältst eine Rechnung per E-Mail</li>
                      <li>Überweise den Betrag auf das angegebene Konto</li>
                      <li>Nach Zahlungseingang wird dein Premium aktiviert</li>
                    </ol>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Wird verarbeitet...
                      </>
                    ) : (
                      <>
                        <Crown className="w-5 h-5 mr-2" />
                        Rechnung anfordern ({price.total}€)
                      </>
                    )}
                  </button>

                  <p className="text-gray-500 text-xs text-center">
                    Mit der Bestellung akzeptierst du unsere{' '}
                    <Link href="/agb" className="text-brand-red hover:underline">
                      AGB
                    </Link>{' '}
                    und{' '}
                    <Link href="/datenschutz" className="text-brand-red hover:underline">
                      Datenschutzerklärung
                    </Link>
                    .
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
