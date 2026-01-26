'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Euro, Loader2, Lightbulb, ArrowLeft, Crown, Download, MessageCircle, Target } from 'lucide-react'
import toast from 'react-hot-toast'

interface SalaryNegotiationResult {
  marketRange: { min: number; max: number }
  tips: string[]
  scripts: string[]
  preparation: string[]
}

const experienceLevels = [
  'Berufseinsteiger (0-1 Jahre)',
  'Mit Erfahrung (2-5 Jahre)',
  'Erfahren (5-10 Jahre)',
  'Senior (10+ Jahre)',
]

const locations = [
  'Zeven',
  'Rotenburg (Wümme)',
  'Bremervörde',
  'Sittensen',
  'Tarmstedt',
  'Scheeßel',
  'Sonstige im Landkreis',
]

export default function GehaltsverhandlungPage() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    experience: '',
    location: '',
    currentSalary: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<SalaryNegotiationResult | null>(null)
  const [remainingUses, setRemainingUses] = useState<number | string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.experience || !formData.location) {
      toast.error('Bitte fülle alle Pflichtfelder aus')
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch('/api/ai/salary-negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.limitReached) {
          setLimitReached(true)
        }
        toast.error(data.message || 'Fehler bei der Generierung')
        return
      }

      setResult(data.result)
      setRemainingUses(data.remainingUses)
      toast.success('Tipps erstellt!')
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setIsGenerating(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <>
      {/* Header */}
      <section className="py-8 px-4 border-b border-gray-800">
        <div className="max-w-4xl mx-auto">
          <Link href="/tools" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu KI-Tools
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Euro className="w-7 h-7 text-purple-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Gehaltsverhandlung
              </h1>
              <p className="text-gray-400">
                Tipps und Strategien für erfolgreiche Gehaltsverhandlungen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {limitReached ? (
            <div className="card text-center">
              <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">
                Kostenlose Nutzungen aufgebraucht
              </h2>
              <p className="text-gray-400 mb-6">
                Du hast deine 2 kostenlosen Gehaltstipps bereits genutzt.
                Upgrade auf Premium für unbegrenzten Zugang.
              </p>
              <Link href="/premium" className="btn-primary inline-flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Jetzt upgraden - nur 4,99€/Monat
              </Link>
            </div>
          ) : (
            <>
              {/* Input Form */}
              <div className="card mb-8">
                <h2 className="text-lg font-semibold text-white mb-4">
                  Für welche Position brauchst du Tipps?
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stellentitel *
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="z.B. Kfz-Mechatroniker"
                      className="input-field"
                      disabled={isGenerating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Erfahrungsstufe *
                    </label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input-field"
                      disabled={isGenerating}
                    >
                      <option value="">Bitte wählen...</option>
                      {experienceLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Standort *
                    </label>
                    <select
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="input-field"
                      disabled={isGenerating}
                    >
                      <option value="">Bitte wählen...</option>
                      {locations.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Aktuelles Gehalt (optional)
                    </label>
                    <input
                      type="text"
                      name="currentSalary"
                      value={formData.currentSalary}
                      onChange={handleChange}
                      placeholder="z.B. 35.000€ brutto/Jahr"
                      className="input-field"
                      disabled={isGenerating}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  {remainingUses !== null && remainingUses !== 'unlimited' && (
                    <span className="text-sm text-gray-400">
                      Noch {remainingUses} kostenlose Tipps
                    </span>
                  )}
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="btn-primary ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Erstelle Tipps...
                      </>
                    ) : (
                      <>
                        <Euro className="w-5 h-5 mr-2" />
                        Tipps erhalten
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="space-y-6">
                  {/* Salary Range */}
                  <div className="card text-center">
                    <h3 className="text-lg font-semibold text-white mb-4">
                      Geschätzte Gehaltsspanne in der Region
                    </h3>
                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-1">Von</p>
                        <p className="text-3xl font-bold text-white">
                          {formatCurrency(result.marketRange.min)}
                        </p>
                      </div>
                      <div className="text-gray-600 text-2xl">—</div>
                      <div className="text-center">
                        <p className="text-gray-400 text-sm mb-1">Bis</p>
                        <p className="text-3xl font-bold text-green-500">
                          {formatCurrency(result.marketRange.max)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Brutto pro Jahr • Basierend auf Erfahrung und Region
                    </p>
                  </div>

                  {/* Tips */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                      Verhandlungstipps
                    </h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="flex items-start text-gray-300">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Scripts */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <MessageCircle className="w-5 h-5 mr-2 text-green-500" />
                      Formulierungshilfen
                    </h3>
                    <div className="space-y-4">
                      {result.scripts.map((script, i) => (
                        <div
                          key={i}
                          className="bg-green-500/10 border border-green-500/30 rounded-lg p-4"
                        >
                          <p className="text-gray-300 italic">&ldquo;{script}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preparation */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Target className="w-5 h-5 mr-2 text-purple-500" />
                      Vorbereitung
                    </h3>
                    <ul className="space-y-2">
                      {result.preparation.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-300">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => {
                      const content = `GEHALTSVERHANDLUNG - TIPPS & STRATEGIEN\n\nPosition: ${formData.jobTitle}\nErfahrung: ${formData.experience}\nStandort: ${formData.location}\n${formData.currentSalary ? `Aktuelles Gehalt: ${formData.currentSalary}` : ''}\n\n---\n\nGESCHÄTZTE GEHALTSSPANNE:\n${formatCurrency(result.marketRange.min)} - ${formatCurrency(result.marketRange.max)} brutto/Jahr\n\n---\n\nVERHANDLUNGSTIPPS:\n${result.tips.map(t => `• ${t}`).join('\n')}\n\n---\n\nFORMULIERUNGSHILFEN:\n${result.scripts.map((s, i) => `${i + 1}. "${s}"`).join('\n\n')}\n\n---\n\nVORBEREITUNG:\n${result.preparation.map(p => `• ${p}`).join('\n')}\n\n---\nErstellt mit JobNachbar KI-Tools\nwww.jobnachbar.com`
                      const blob = new Blob([content], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'gehaltsverhandlung-tipps.txt'
                      a.click()
                    }}
                    className="btn-secondary w-full"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Tipps herunterladen
                  </button>
                </div>
              )}

              {!result && !isGenerating && (
                <div className="card flex items-center justify-center min-h-[300px]">
                  <div className="text-center text-gray-500">
                    <Euro className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Fülle das Formular aus und erhalte personalisierte Tipps</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  )
}
