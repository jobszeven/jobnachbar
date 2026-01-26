'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DollarSign, ArrowLeft, TrendingUp, MapPin, Briefcase, Info, Sparkles, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

const industries = [
  { id: 'handwerk', name: 'Handwerk', avgSalary: 2800 },
  { id: 'einzelhandel', name: 'Einzelhandel', avgSalary: 2400 },
  { id: 'gastro', name: 'Gastronomie & Hotel', avgSalary: 2200 },
  { id: 'pflege', name: 'Pflege & Gesundheit', avgSalary: 3200 },
  { id: 'logistik', name: 'Logistik & Transport', avgSalary: 2600 },
  { id: 'buero', name: 'Büro & Verwaltung', avgSalary: 3000 },
  { id: 'it', name: 'IT & Technik', avgSalary: 4200 },
  { id: 'industrie', name: 'Industrie & Produktion', avgSalary: 3100 },
]

const experienceLevels = [
  { id: 'entry', name: 'Berufseinsteiger (0-2 Jahre)', multiplier: 0.85 },
  { id: 'mid', name: 'Mit Erfahrung (3-5 Jahre)', multiplier: 1.0 },
  { id: 'senior', name: 'Senior (6-10 Jahre)', multiplier: 1.2 },
  { id: 'expert', name: 'Experte (10+ Jahre)', multiplier: 1.4 },
]

interface SalaryResult {
  minSalary: number
  avgSalary: number
  maxSalary: number
  tips: string[]
}

export default function GehaltPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [selectedExperience, setSelectedExperience] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [result, setResult] = useState<SalaryResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [negotiationTips, setNegotiationTips] = useState<string[]>([])

  const calculateSalary = async () => {
    if (!selectedIndustry || !selectedExperience) {
      toast.error('Bitte wähle Branche und Erfahrung aus')
      return
    }

    setIsLoading(true)

    // Simulate calculation
    const industry = industries.find((i) => i.id === selectedIndustry)
    const experience = experienceLevels.find((e) => e.id === selectedExperience)

    if (industry && experience) {
      const avgSalary = Math.round(industry.avgSalary * experience.multiplier)
      const minSalary = Math.round(avgSalary * 0.85)
      const maxSalary = Math.round(avgSalary * 1.15)

      setTimeout(() => {
        setResult({
          minSalary,
          avgSalary,
          maxSalary,
          tips: [
            'Recherchiere den genauen Marktwert für deine Position',
            'Berücksichtige Zusatzleistungen wie Urlaub, Weiterbildung',
            'Verhandle immer erst nach dem Jobangebot',
          ],
        })
        setIsLoading(false)
        toast.success('Gehaltsschätzung berechnet!')
      }, 1000)
    }
  }

  const getNegotiationTips = async () => {
    setIsLoading(true)
    try {
      const industry = industries.find((i) => i.id === selectedIndustry)
      const experience = experienceLevels.find((e) => e.id === selectedExperience)

      const response = await fetch('/api/ai/salary-negotiation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle: jobTitle || industry?.name || 'Position',
          experience: experience?.name || 'Berufseinsteiger',
          location: 'Zeven, Niedersachsen',
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Fehler beim Laden')
      }

      setNegotiationTips(data.result?.tips || [])
      toast.success('Verhandlungstipps geladen!')
    } catch (error) {
      toast.error('Fehler beim Laden. Bitte versuche es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/bewerbungstipps" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu Bewerbungstipps
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-red/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Gehaltsrechner</h1>
              <p className="text-gray-400">Was kannst du in deiner Region verdienen?</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-6">Gehalt berechnen</h2>

              <div className="space-y-4">
                <div>
                  <label className="input-label">Branche</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Branche wählen...</option>
                    {industries.map((industry) => (
                      <option key={industry.id} value={industry.id}>
                        {industry.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Berufserfahrung</label>
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Erfahrung wählen...</option>
                    {experienceLevels.map((level) => (
                      <option key={level.id} value={level.id}>
                        {level.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Job-Titel (optional)</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="z.B. Verkäufer/in"
                    className="input-field"
                  />
                </div>

                <button
                  onClick={calculateSalary}
                  disabled={isLoading || !selectedIndustry || !selectedExperience}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Berechne...
                    </>
                  ) : (
                    <>
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Gehalt berechnen
                    </>
                  )}
                </button>
              </div>

              {/* Region Info */}
              <div className="mt-6 p-4 bg-brand-dark rounded-lg flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Region: Landkreis Rotenburg</p>
                  <p className="text-gray-400 text-sm">
                    Die Gehälter basieren auf Daten aus Zeven und Umgebung.
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Salary Range */}
                  <div className="card text-center">
                    <p className="text-gray-400 mb-2">Geschätztes Bruttogehalt/Monat</p>
                    <div className="text-4xl font-bold text-brand-red mb-4">
                      {formatCurrency(result.avgSalary)}
                    </div>
                    <div className="flex justify-center gap-8 text-sm">
                      <div>
                        <p className="text-gray-500">Minimum</p>
                        <p className="text-gray-300 font-medium">{formatCurrency(result.minSalary)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Maximum</p>
                        <p className="text-gray-300 font-medium">{formatCurrency(result.maxSalary)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips */}
                  <div className="card">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Info className="w-5 h-5 mr-2 text-brand-red" />
                      Hinweise
                    </h3>
                    <ul className="space-y-2">
                      {result.tips.map((tip, i) => (
                        <li key={i} className="text-gray-400 text-sm flex items-start">
                          <span className="text-brand-red mr-2">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Negotiation Tips */}
                  <div className="card">
                    <h3 className="font-semibold text-white mb-4 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-brand-red" />
                      Verhandlungstipps
                    </h3>
                    {negotiationTips.length > 0 ? (
                      <ul className="space-y-2">
                        {negotiationTips.map((tip, i) => (
                          <li key={i} className="text-gray-300 flex items-start">
                            <span className="text-brand-red mr-2">{i + 1}.</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <button
                        onClick={getNegotiationTips}
                        disabled={isLoading}
                        className="btn-secondary w-full"
                      >
                        <Sparkles className="w-5 h-5 mr-2" />
                        KI-Verhandlungstipps laden
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="card text-center py-16">
                  <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Gehaltsschätzung
                  </h3>
                  <p className="text-gray-400">
                    Wähle Branche und Erfahrung aus, um eine Schätzung zu erhalten.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
