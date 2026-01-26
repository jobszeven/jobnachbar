'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Upload, Loader2, CheckCircle, AlertTriangle, Lightbulb, ArrowLeft, Crown, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface AnalysisResult {
  score: number
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  summary: string
}

export default function LebenslaufCheckPage() {
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [remainingUses, setRemainingUses] = useState<number | string | null>(null)
  const [limitReached, setLimitReached] = useState(false)

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      toast.error('Bitte füge deinen Lebenslauf ein')
      return
    }

    if (resumeText.length < 100) {
      toast.error('Der Lebenslauf ist zu kurz. Bitte füge mehr Inhalt ein.')
      return
    }

    setIsAnalyzing(true)
    setResult(null)

    try {
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.limitReached) {
          setLimitReached(true)
        }
        toast.error(data.message || 'Fehler bei der Analyse')
        return
      }

      setResult(data.result)
      setRemainingUses(data.remainingUses)
      toast.success('Analyse abgeschlossen!')
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Sehr gut'
    if (score >= 60) return 'Gut'
    if (score >= 40) return 'Verbesserungswürdig'
    return 'Optimierungsbedarf'
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
            <div className="w-14 h-14 bg-brand-red/20 rounded-xl flex items-center justify-center">
              <FileText className="w-7 h-7 text-brand-red" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Lebenslauf-Check
              </h1>
              <p className="text-gray-400">
                Lass deinen Lebenslauf von unserer KI analysieren
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
                Du hast deine 3 kostenlosen Lebenslauf-Checks bereits genutzt.
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
              <div>
                <div className="card">
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <Upload className="w-5 h-5 mr-2 text-brand-red" />
                    Lebenslauf einfügen
                  </h2>
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Füge hier den Text deines Lebenslaufs ein...

Zum Beispiel:
- Persönliche Daten
- Berufserfahrung
- Ausbildung
- Fähigkeiten
- etc."
                    className="input-field min-h-[400px] resize-none"
                    disabled={isAnalyzing}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-gray-500">
                      {resumeText.length} Zeichen
                    </span>
                    {remainingUses !== null && remainingUses !== 'unlimited' && (
                      <span className="text-sm text-gray-400">
                        Noch {remainingUses} kostenlose Checks
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || resumeText.length < 100}
                    className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Analysiere...
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5 mr-2" />
                        Lebenslauf analysieren
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results */}
              <div>
                {result ? (
                  <div className="space-y-6">
                    {/* Score */}
                    <div className="card text-center">
                      <h3 className="text-lg font-semibold text-white mb-4">Gesamtbewertung</h3>
                      <div className={`text-6xl font-bold ${getScoreColor(result.score)} mb-2`}>
                        {result.score}
                      </div>
                      <div className={`text-lg ${getScoreColor(result.score)}`}>
                        {getScoreLabel(result.score)}
                      </div>
                      <p className="text-gray-400 mt-4">{result.summary}</p>
                    </div>

                    {/* Strengths */}
                    <div className="card">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                        Stärken
                      </h3>
                      <ul className="space-y-2">
                        {result.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start text-gray-300">
                            <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Improvements */}
                    <div className="card">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                        Verbesserungspotenzial
                      </h3>
                      <ul className="space-y-2">
                        {result.improvements.map((improvement, i) => (
                          <li key={i} className="flex items-start text-gray-300">
                            <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-3 flex-shrink-0" />
                            {improvement}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Suggestions */}
                    <div className="card">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Lightbulb className="w-5 h-5 mr-2 text-brand-red" />
                        Konkrete Vorschläge
                      </h3>
                      <ul className="space-y-2">
                        {result.suggestions.map((suggestion, i) => (
                          <li key={i} className="flex items-start text-gray-300">
                            <span className="w-2 h-2 bg-brand-red rounded-full mt-2 mr-3 flex-shrink-0" />
                            {suggestion}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Download Button */}
                    <button
                      onClick={() => {
                        const content = `LEBENSLAUF-ANALYSE\n\nBewertung: ${result.score}/100 - ${getScoreLabel(result.score)}\n\n${result.summary}\n\nSTÄRKEN:\n${result.strengths.map(s => `• ${s}`).join('\n')}\n\nVERBESSERUNGSPOTENZIAL:\n${result.improvements.map(i => `• ${i}`).join('\n')}\n\nKONKRETE VORSCHLÄGE:\n${result.suggestions.map(s => `• ${s}`).join('\n')}\n\n---\nErstellt mit JobNachbar KI-Tools\nwww.jobnachbar.com`
                        const blob = new Blob([content], { type: 'text/plain' })
                        const url = URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = 'lebenslauf-analyse.txt'
                        a.click()
                      }}
                      className="btn-secondary w-full"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Analyse herunterladen
                    </button>
                  </div>
                ) : (
                  <div className="card h-full flex items-center justify-center min-h-[400px]">
                    <div className="text-center text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Füge deinen Lebenslauf ein und klicke auf &quot;Analysieren&quot;</p>
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
