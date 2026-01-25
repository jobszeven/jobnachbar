'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Building, User, Lock, Bell, Trash2, Save } from 'lucide-react'

export default function ArbeitgeberEinstellungen() {
  const [activeTab, setActiveTab] = useState('firma')

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard/arbeitgeber" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">Einstellungen</h1>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-700 pb-4">
          {[
            { id: 'firma', icon: Building, label: 'Firmendaten' },
            { id: 'kontakt', icon: User, label: 'Kontaktperson' },
            { id: 'passwort', icon: Lock, label: 'Passwort' },
            { id: 'benachrichtigungen', icon: Bell, label: 'Benachrichtigungen' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-dark-card text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Firmendaten */}
        {activeTab === 'firma' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Firmendaten</h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Firmenname *</label>
                <input type="text" className="input-field" placeholder="Ihre Firma GmbH" />
              </div>
              <div>
                <label className="input-label">Branche *</label>
                <select className="input-field">
                  <option>Bitte wählen</option>
                  <option>Handwerk</option>
                  <option>Pflege</option>
                  <option>Gastronomie</option>
                  <option>Einzelhandel</option>
                  <option>Industrie</option>
                  <option>Sonstiges</option>
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">PLZ *</label>
                  <input type="text" className="input-field" placeholder="27404" />
                </div>
                <div>
                  <label className="input-label">Ort *</label>
                  <input type="text" className="input-field" placeholder="Zeven" />
                </div>
              </div>
              <div>
                <label className="input-label">Straße & Hausnummer</label>
                <input type="text" className="input-field" placeholder="Musterstraße 1" />
              </div>
              <div>
                <label className="input-label">Website (optional)</label>
                <input type="url" className="input-field" placeholder="https://www.ihre-firma.de" />
              </div>
              <div>
                <label className="input-label">Über uns (optional)</label>
                <textarea className="input-field h-32" placeholder="Beschreiben Sie Ihr Unternehmen..." />
              </div>
            </div>
            <button className="btn-primary mt-6 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Speichern
            </button>
          </div>
        )}

        {/* Kontaktperson */}
        {activeTab === 'kontakt' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Kontaktperson</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Vorname *</label>
                  <input type="text" className="input-field" placeholder="Max" />
                </div>
                <div>
                  <label className="input-label">Nachname *</label>
                  <input type="text" className="input-field" placeholder="Mustermann" />
                </div>
              </div>
              <div>
                <label className="input-label">Position</label>
                <input type="text" className="input-field" placeholder="Geschäftsführer" />
              </div>
              <div>
                <label className="input-label">E-Mail *</label>
                <input type="email" className="input-field" placeholder="max@firma.de" />
              </div>
              <div>
                <label className="input-label">Telefon</label>
                <input type="tel" className="input-field" placeholder="+49 123 456789" />
              </div>
            </div>
            <button className="btn-primary mt-6 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Speichern
            </button>
          </div>
        )}

        {/* Passwort */}
        {activeTab === 'passwort' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Passwort ändern</h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Aktuelles Passwort *</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="input-label">Neues Passwort *</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
              <div>
                <label className="input-label">Neues Passwort bestätigen *</label>
                <input type="password" className="input-field" placeholder="••••••••" />
              </div>
            </div>
            <button className="btn-primary mt-6 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Passwort ändern
            </button>
          </div>
        )}

        {/* Benachrichtigungen */}
        {activeTab === 'benachrichtigungen' && (
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Benachrichtigungen</h2>
            <div className="space-y-6">
              {[
                { id: 'email_bewerbung', label: 'E-Mail bei neuer Bewerbung', desc: 'Erhalten Sie eine E-Mail wenn sich jemand bewirbt' },
                { id: 'email_match', label: 'E-Mail bei neuem Match', desc: 'Benachrichtigung bei passenden Bewerbern' },
                { id: 'email_news', label: 'Newsletter & Updates', desc: 'Tipps und Neuigkeiten von JobNachbar' },
                { id: 'whatsapp', label: 'WhatsApp-Benachrichtigungen', desc: 'Sofortige Alerts auf Ihr Handy (Premium)' },
              ].map((item) => (
                <div key={item.id} className="flex items-start justify-between">
                  <div>
                    <p className="text-white font-medium">{item.label}</p>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-brand-red rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                  </label>
                </div>
              ))}
            </div>
            <button className="btn-primary mt-6 flex items-center gap-2">
              <Save className="w-4 h-4" />
              Speichern
            </button>
          </div>
        )}

        {/* Danger Zone */}
        <div className="card border-red-500/30 mt-8">
          <h2 className="text-xl font-semibold text-red-400 mb-4">Gefahrenzone</h2>
          <p className="text-gray-400 mb-4">
            Wenn Sie Ihren Account löschen, werden alle Ihre Daten unwiderruflich entfernt.
          </p>
          <button className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-400 rounded-lg hover:bg-red-500/10 transition-colors">
            <Trash2 className="w-4 h-4" />
            Account löschen
          </button>
        </div>
      </div>
    </div>
  )
}
