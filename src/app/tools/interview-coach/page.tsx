'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MessageSquare, Loader2, Lightbulb, ArrowLeft, Crown, Download, Search, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

interface InterviewPrepResult {
  commonQuestions: { question: string; suggestedAnswer: string }[]
  tips: string[]
  companyResearch: string[]
}

const industries = [
  'Einzelhandel',
  'Gastronomie',
  'Handwerk',
  'Logistik & Transport',
  'Gesundheitswesen',
  'Produktion & Fertigung',
  'Büro & Verwaltung',
  'IT & Technik',
  'Dienstleistungen',
  'Sonstiges',
]

export default function InterviewCoachPage() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    industry: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<InterviewPrepResult | null>(null)
  const [remainingUses, setRemainingUses] = useState<number | string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<number[]>([])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const toggleQuestion = (index: number) => {
    setExpandedQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.industry) {
      toast.error('Bitte fülle alle Felder aus')
      return
    }

    setIsGenerating(true)
    setResult(null)
    setExpandedQuestions([])

    try {
      const response = await fetch('/api/ai/interview-prep', {
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
      toast.success('Vorbereitung erstellt!')
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setIsGenerating(false)
    }
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
            <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Interview-Coach
              </h1>
              <p className="text-gray-400">
                Bereite dich optimal auf dein Vorstellungsgespräch vor
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
                Du hast deine 2 kostenlosen Interview-Vorbereitungen bereits genutzt.
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
                  Für welches Gespräch möchtest du dich vorbereiten?
                </h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Stellentitel *
                    </label>
                    <input
                      type="text"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="z.B. Verkäufer/in"
                      className="input-field"
                      disabled={isGenerating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Unternehmen *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="z.B. EDEKA Müller"
                      className="input-field"
                      disabled={isGenerating}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Branche *
                    </label>
                    <select
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className="input-field"
                      disabled={isGenerating}
                    >
                      <option value="">Branche wählen...</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-6">
                  {remainingUses !== null && remainingUses !== 'unlimited' && (
                    <span className="text-sm text-gray-400">
                      Noch {remainingUses} kostenlose Vorbereitungen
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
                        Erstelle Vorbereitung...
                      </>
                    ) : (
                      <>
                        <MessageSquare className="w-5 h-5 mr-2" />
                        Vorbereitung starten
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              {result && (
                <div className="space-y-6">
                  {/* Questions */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <MessageSquare className="w-5 h-5 mr-2 text-green-500" />
                      Häufige Fragen & Antworten
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Klicke auf eine Frage, um die vorgeschlagene Antwort zu sehen.
                    </p>
                    <div className="space-y-3">
                      {result.commonQuestions.map((item, index) => (
                        <div
                          key={index}
                          className="border border-gray-700 rounded-lg overflow-hidden"
                        >
                          <button
                            onClick={() => toggleQuestion(index)}
                            className="w-full flex items-center justify-between p-4 text-left bg-brand-dark hover:bg-gray-800/50 transition-colors"
                          >
                            <span className="font-medium text-white pr-4">
                              {item.question}
                            </span>
                            {expandedQuestions.includes(index) ? (
                              <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                            )}
                          </button>
                          {expandedQuestions.includes(index) && (
                            <div className="p-4 bg-green-500/10 border-t border-gray-700">
                              <p className="text-gray-300 leading-relaxed">
                                {item.suggestedAnswer}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                      Allgemeine Tipps
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

                  {/* Company Research */}
                  <div className="card">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Search className="w-5 h-5 mr-2 text-blue-500" />
                      Recherche-Empfehlungen
                    </h3>
                    <ul className="space-y-2">
                      {result.companyResearch.map((item, i) => (
                        <li key={i} className="flex items-start text-gray-300">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Download Button */}
                  <button
                    onClick={() => {
                      const content = `INTERVIEW-VORBEREITUNG\n\nPosition: ${formData.jobTitle}\nUnternehmen: ${formData.companyName}\nBranche: ${formData.industry}\n\n---\n\nHÄUFIGE FRAGEN & ANTWORTEN:\n\n${result.commonQuestions.map((q, i) => `${i + 1}. ${q.question}\n   Antwort: ${q.suggestedAnswer}`).join('\n\n')}\n\n---\n\nALLGEMEINE TIPPS:\n${result.tips.map(t => `• ${t}`).join('\n')}\n\n---\n\nRECHERCHE-EMPFEHLUNGEN:\n${result.companyResearch.map(r => `• ${r}`).join('\n')}\n\n---\nErstellt mit JobNachbar KI-Tools\nwww.jobnachbar.com`
                      const blob = new Blob([content], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = 'interview-vorbereitung.txt'
                      a.click()
                    }}
                    className="btn-secondary w-full"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Vorbereitung herunterladen
                  </button>
                </div>
              )}

              {!result && !isGenerating && (
                <div className="card flex items-center justify-center min-h-[300px]">
                  <div className="text-center text-gray-500">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Fülle das Formular aus und starte die Vorbereitung</p>
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
