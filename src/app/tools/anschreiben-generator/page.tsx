'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PenTool, Loader2, Lightbulb, ArrowLeft, Crown, Download, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

interface CoverLetterResult {
  coverLetter: string
  tips: string[]
}

export default function AnschreibenGeneratorPage() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    userProfile: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [result, setResult] = useState<CoverLetterResult | null>(null)
  const [remainingUses, setRemainingUses] = useState<number | string | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleGenerate = async () => {
    if (!formData.jobTitle || !formData.companyName || !formData.jobDescription || !formData.userProfile) {
      toast.error('Bitte fülle alle Felder aus')
      return
    }

    setIsGenerating(true)
    setResult(null)

    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
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
      toast.success('Anschreiben erstellt!')
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    if (result?.coverLetter) {
      await navigator.clipboard.writeText(result.coverLetter)
      setCopied(true)
      toast.success('In Zwischenablage kopiert!')
      setTimeout(() => setCopied(false), 2000)
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
            <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <PenTool className="w-7 h-7 text-blue-500" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Anschreiben-Generator
              </h1>
              <p className="text-gray-400">
                Erstelle ein individuelles Anschreiben mit KI-Unterstützung
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
                Du hast deine 2 kostenlosen Anschreiben bereits erstellt.
                Upgrade auf Premium für unbegrenzten Zugang.
              </p>
              <Link href="/premium" className="btn-primary inline-flex items-center">
                <Crown className="w-5 h-5 mr-2" />
                Jetzt upgraden - nur 4,99€/Monat
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Input */}
              <div className="space-y-6">
                <div className="card">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Stelleninformationen
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Stellentitel *
                      </label>
                      <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="z.B. Verkäufer/in im Einzelhandel"
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
                        Stellenbeschreibung *
                      </label>
                      <textarea
                        name="jobDescription"
                        value={formData.jobDescription}
                        onChange={handleChange}
                        placeholder="Kopiere hier die wichtigsten Anforderungen aus der Stellenanzeige..."
                        className="input-field min-h-[120px] resize-none"
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                </div>

                <div className="card">
                  <h2 className="text-lg font-semibold text-white mb-4">
                    Dein Profil
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Relevante Erfahrungen & Stärken *
                    </label>
                    <textarea
                      name="userProfile"
                      value={formData.userProfile}
                      onChange={handleChange}
                      placeholder="Beschreibe deine relevanten Erfahrungen, Qualifikationen und Stärken...

z.B.:
- 3 Jahre Erfahrung im Einzelhandel
- Kundenorientiert und freundlich
- Kassenführung und Warenpräsentation"
                      className="input-field min-h-[150px] resize-none"
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  {remainingUses !== null && remainingUses !== 'unlimited' && (
                    <span className="text-sm text-gray-400">
                      Noch {remainingUses} kostenlose Anschreiben
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
                        Generiere...
                      </>
                    ) : (
                      <>
                        <PenTool className="w-5 h-5 mr-2" />
                        Anschreiben erstellen
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {result ? (
                  <div className="space-y-6">
                    {/* Cover Letter */}
                    <div className="card">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white">
                          Dein Anschreiben
                        </h3>
                        <button
                          onClick={handleCopy}
                          className="btn-secondary text-sm py-2 px-3"
                        >
                          {copied ? (
                            <>
                              <Check className="w-4 h-4 mr-1" />
                              Kopiert!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              Kopieren
                            </>
                          )}
                        </button>
                      </div>
                      <div className="bg-brand-dark rounded-lg p-4 text-gray-300 whitespace-pre-wrap leading-relaxed">
                        {result.coverLetter}
                      </div>
                    </div>

                    {/* Tips */}
                    <div className="card">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
                        Tipps zur Verbesserung
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

                    {/* Download Button */}
                    <button
                      onClick={() => {
                        const content = `${result.coverLetter}\n\n---\n\nTIPPS ZUR VERBESSERUNG:\n${result.tips.map(t => `• ${t}`).join('\n')}\n\n---\nErstellt mit JobNachbar KI-Tools\nwww.jobnachbar.com`
                        const blob = new Blob([content], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'anschreiben.txt'
                        a.click()
                      }}
                      className="btn-secondary w-full"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Als Text herunterladen
                    </button>
                  </div>
                ) : (
                  <div className="card h-full flex items-center justify-center min-h-[400px]">
                    <div className="text-center text-gray-500">
                      <PenTool className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Fülle das Formular aus und klicke auf &quot;Anschreiben erstellen&quot;</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
