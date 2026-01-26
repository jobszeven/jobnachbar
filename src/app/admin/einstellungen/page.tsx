import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Building2, CreditCard, Mail, FileText } from 'lucide-react'
import Header from '@/components/Header'

export const metadata: Metadata = {
  title: 'Admin Einstellungen - JobNachbar',
  description: 'Administrationsbereich Einstellungen',
}

export default async function AdminEinstellungenPage() {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Einstellungen</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Rechnungsdaten */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-brand-red" />
              </div>
              <h2 className="text-xl font-semibold text-white">Rechnungsdaten</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Firmenname</label>
                <p className="font-medium">JobNachbar GmbH</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Adresse</label>
                <p>Musterstraße 1</p>
                <p>27404 Zeven</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Steuernummer</label>
                <p>DE123456789</p>
              </div>
            </div>
          </div>

          {/* Bankverbindung */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-brand-red" />
              </div>
              <h2 className="text-xl font-semibold text-white">Bankverbindung</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Kontoinhaber</label>
                <p className="font-medium">JobNachbar GmbH</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">IBAN</label>
                <p className="font-mono">DE89 3704 0044 0532 0130 00</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">BIC</label>
                <p className="font-mono">COBADEFFXXX</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Bank</label>
                <p>Commerzbank</p>
              </div>
            </div>
          </div>

          {/* E-Mail Einstellungen */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-brand-red" />
              </div>
              <h2 className="text-xl font-semibold text-white">E-Mail Einstellungen</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Absender E-Mail</label>
                <p className="font-medium">info@jobnachbar.com</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Support E-Mail</label>
                <p>info@jobnachbar.com</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Admin Benachrichtigungen</label>
                <p>info@jobnachbar.com</p>
              </div>
            </div>
          </div>

          {/* Unternehmensinfo */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-brand-red" />
              </div>
              <h2 className="text-xl font-semibold text-white">Unternehmensinfo</h2>
            </div>
            <div className="space-y-4 text-gray-300">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Geschäftsführer</label>
                <p className="font-medium">Max Mustermann</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Handelsregister</label>
                <p>Amtsgericht Tostedt, HRB 12345</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Telefon</label>
                <p>04281 / 123456</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preisübersicht */}
        <div className="card mt-8">
          <h2 className="text-xl font-semibold text-white mb-6">Aktuelle Preise</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Produkt</th>
                  <th className="text-left py-3 px-4 text-gray-400 font-medium">Zielgruppe</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Preis</th>
                  <th className="text-right py-3 px-4 text-gray-400 font-medium">Laufzeit</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Bewerber Premium</td>
                  <td className="py-3 px-4">Bewerber</td>
                  <td className="py-3 px-4 text-right">4,99 €</td>
                  <td className="py-3 px-4 text-right">pro Monat</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Bewerber Premium Jahr</td>
                  <td className="py-3 px-4">Bewerber</td>
                  <td className="py-3 px-4 text-right">29,00 €</td>
                  <td className="py-3 px-4 text-right">pro Jahr</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Starter</td>
                  <td className="py-3 px-4">Arbeitgeber</td>
                  <td className="py-3 px-4 text-right">29,00 €</td>
                  <td className="py-3 px-4 text-right">einmalig</td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-3 px-4">Basic</td>
                  <td className="py-3 px-4">Arbeitgeber</td>
                  <td className="py-3 px-4 text-right">49,00 €</td>
                  <td className="py-3 px-4 text-right">pro Monat</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">Premium</td>
                  <td className="py-3 px-4">Arbeitgeber</td>
                  <td className="py-3 px-4 text-right">99,00 €</td>
                  <td className="py-3 px-4 text-right">pro Monat</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-4 bg-brand-red/10 border border-brand-red/30 rounded-lg">
          <p className="text-gray-300 text-sm">
            <strong className="text-brand-red">Hinweis:</strong> Änderungen an den Einstellungen müssen aktuell direkt im Code oder in der Datenbank vorgenommen werden. Eine Admin-UI zur Bearbeitung ist in Planung.
          </p>
        </div>
      </main>
    </div>
  )
}
