'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Upload, Download, Sparkles, CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

type DesignTemplate = 'modern' | 'klassisch' | 'kreativ'

interface AnalysisResult {
  score: number
  strengths: string[]
  improvements: string[]
  suggestions: string[]
}

export default function LebenslaufPage() {
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate>('modern')
  const [isGenerating, setIsGenerating] = useState(false)

  const templates = [
    { id: 'modern' as const, name: 'Modern', description: 'Klares, zeitgemäßes Design' },
    { id: 'klassisch' as const, name: 'Klassisch', description: 'Traditionell und seriös' },
    { id: 'kreativ' as const, name: 'Kreativ', description: 'Auffällig und individuell' },
  ]

  const analyzeResume = async () => {
    if (!resumeText.trim()) {
      toast.error('Bitte füge deinen Lebenslauf-Text ein')
      return
    }

    setIsAnalyzing(true)
    try {
      const response = await fetch('/api/ai/analyze-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analyse fehlgeschlagen')
      }

      setAnalysis(data)
      toast.success('Analyse abgeschlossen!')
    } catch (error) {
      toast.error('Fehler bei der Analyse. Bitte versuche es erneut.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generatePDF = async () => {
    if (!resumeText.trim()) {
      toast.error('Bitte füge deinen Lebenslauf-Text ein')
      return
    }

    setIsGenerating(true)
    toast.loading('PDF wird erstellt...', { id: 'pdf' })

    // Simulate PDF generation (in a real app, this would call a PDF generation API)
    setTimeout(() => {
      setIsGenerating(false)
      toast.success('PDF wurde erstellt!', { id: 'pdf' })
      // In a real implementation, this would trigger a download
      toast('PDF-Download wird in Premium freigeschaltet', { icon: '💎' })
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Link */}
          <Link href="/bewerbungstipps" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Zurück zu Bewerbungstipps
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-red/20 rounded-xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Lebenslauf-Check</h1>
              <p className="text-gray-400">Lass deinen Lebenslauf von unserer KI analysieren</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-brand-red" />
                  Lebenslauf eingeben
                </h2>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Füge hier deinen Lebenslauf-Text ein oder kopiere ihn aus einem Dokument..."
                  className="input-field h-64 resize-none"
                />
                <button
                  onClick={analyzeResume}
                  disabled={isAnalyzing || !resumeText.trim()}
                  className="btn-primary w-full mt-4 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analysiere...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Mit KI analysieren
                    </>
                  )}
                </button>
              </div>

              {/* PDF Generator */}
              <div className="card">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Download className="w-5 h-5 mr-2 text-brand-red" />
                  PDF erstellen
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  Wähle eine Design-Vorlage und erstelle ein professionelles PDF.
                </p>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`p-3 rounded-lg border-2 text-center transition-colors ${
                        selectedTemplate === template.id
                          ? 'border-brand-red bg-brand-red/10'
                          : 'border-gray-700 hover:border-gray-600'
                      }`}
                    >
                      <p className="text-white font-medium text-sm">{template.name}</p>
                      <p className="text-gray-500 text-xs mt-1">{template.description}</p>
                    </button>
                  ))}
                </div>
                <button
                  onClick={generatePDF}
                  disabled={isGenerating || !resumeText.trim()}
                  className="btn-secondary w-full disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Erstelle PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      PDF herunterladen
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Results Section */}
            <div>
              {analysis ? (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="card text-center">
                    <p className="text-gray-400 mb-2">Gesamtbewertung</p>
                    <div className="text-6xl font-bold text-brand-red mb-2">
                      {analysis.score}%
                    </div>
                    <p className="text-gray-400">
                      {analysis.score >= 80 ? 'Ausgezeichnet!' : analysis.score >= 60 ? 'Gut, mit Verbesserungspotenzial' : 'Verbesserungen empfohlen'}
                    </p>
                  </div>

                  {/* Strengths */}
                  <div className="card">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                      Stärken
                    </h3>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength, i) => (
                        <li key={i} className="text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div className="card">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
                      Verbesserungsvorschläge
                    </h3>
                    <ul className="space-y-2">
                      {analysis.improvements.map((improvement, i) => (
                        <li key={i} className="text-gray-300 flex items-start">
                          <span className="text-yellow-400 mr-2">!</span>
                          {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Suggestions */}
                  <div className="card">
                    <h3 className="font-semibold text-white mb-3 flex items-center">
                      <Sparkles className="w-5 h-5 mr-2 text-brand-red" />
                      KI-Empfehlungen
                    </h3>
                    <ul className="space-y-2">
                      {analysis.suggestions.map((suggestion, i) => (
                        <li key={i} className="text-gray-300 flex items-start">
                          <span className="text-brand-red mr-2">→</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="card text-center py-16">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Noch keine Analyse
                  </h3>
                  <p className="text-gray-400">
                    Füge deinen Lebenslauf links ein und klicke auf &ldquo;Mit KI analysieren&rdquo;
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
