'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { FileText, Upload, Download, Sparkles, CheckCircle, AlertCircle, ArrowLeft, Loader2, File, X } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

type DesignTemplate = 'modern' | 'klassisch' | 'kreativ' | 'minimal' | 'professionell' | 'elegant' | 'executive' | 'tech' | 'akademisch' | 'kompakt'

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
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      toast.error('Bitte lade eine PDF, DOC, DOCX oder TXT Datei hoch')
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Die Datei ist zu groß. Maximal 5MB erlaubt.')
      return
    }

    setUploadedFile(file)
    setIsUploading(true)

    try {
      // For text files, read directly
      if (file.type === 'text/plain') {
        const text = await file.text()
        setResumeText(text)
        toast.success('Datei erfolgreich geladen!')
        setIsUploading(false)
        return
      }

      // For PDF/DOC files, use API to extract text
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        // If extraction fails, inform user to paste text manually
        toast.error('Text konnte nicht extrahiert werden. Bitte kopiere den Text manuell.')
        setUploadedFile(null)
        setIsUploading(false)
        return
      }

      const data = await response.json()
      if (data.text) {
        setResumeText(data.text)
        toast.success('Text wurde aus der Datei extrahiert!')
      }
    } catch (error) {
      console.error('File upload error:', error)
      toast.error('Fehler beim Hochladen. Bitte versuche es erneut.')
      setUploadedFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const removeUploadedFile = () => {
    setUploadedFile(null)
    setResumeText('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const templates = [
    { id: 'modern' as const, name: 'Modern', description: 'Zeitgemäß' },
    { id: 'klassisch' as const, name: 'Klassisch', description: 'Traditionell' },
    { id: 'kreativ' as const, name: 'Kreativ', description: 'Auffällig' },
    { id: 'minimal' as const, name: 'Minimal', description: 'Schlicht' },
    { id: 'professionell' as const, name: 'Professional', description: 'Business' },
    { id: 'elegant' as const, name: 'Elegant', description: 'Stilvoll' },
    { id: 'executive' as const, name: 'Executive', description: 'Premium' },
    { id: 'tech' as const, name: 'Tech', description: 'Developer' },
    { id: 'akademisch' as const, name: 'Akademisch', description: 'Wissenschaft' },
    { id: 'kompakt' as const, name: 'Kompakt', description: 'Einseiter' },
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

      setAnalysis(data.result)
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

    try {
      // Parse resume text into structured data (simplified parsing)
      const lines = resumeText.split('\n').filter(l => l.trim())
      const resumeData = {
        personal: {
          name: lines[0] || 'Name',
          email: 'email@beispiel.de',
          phone: '0123 456789',
          address: 'Musterstraße 1, 27404 Zeven',
        },
        summary: 'Basierend auf dem eingefügten Lebenslauf.',
        experience: [{
          title: 'Position',
          company: 'Unternehmen',
          location: 'Ort',
          startDate: '2020',
          endDate: 'Heute',
          description: lines.slice(1, 4).filter(l => l.length > 10),
        }],
        education: [{
          degree: 'Abschluss',
          institution: 'Institution',
          location: 'Ort',
          startDate: '2015',
          endDate: '2020',
        }],
        skills: lines.filter(l => l.length < 30 && l.length > 3).slice(0, 8),
      }

      const templateMap: Record<string, string> = {
        modern: 'modern',
        klassisch: 'classic',
        kreativ: 'creative',
        minimal: 'minimal',
        professionell: 'professional',
        elegant: 'elegant',
        executive: 'executive',
        tech: 'tech',
        akademisch: 'academic',
        kompakt: 'compact',
      }

      const response = await fetch('/api/pdf/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: templateMap[selectedTemplate] || 'modern',
          data: resumeData,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'PDF-Erstellung fehlgeschlagen')
      }

      // Download the PDF
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lebenslauf-${selectedTemplate}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('PDF wurde erstellt und heruntergeladen!', { id: 'pdf' })
    } catch (error) {
      console.error('PDF generation error:', error)
      toast.error('Fehler bei der PDF-Erstellung. Bitte versuche es erneut.', { id: 'pdf' })
    } finally {
      setIsGenerating(false)
    }
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

                {/* File Upload Area */}
                <div className="mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />

                  {uploadedFile ? (
                    <div className="flex items-center justify-between p-4 bg-brand-dark rounded-lg border border-gray-700">
                      <div className="flex items-center">
                        <File className="w-8 h-8 text-brand-red mr-3" />
                        <div>
                          <p className="text-white font-medium">{uploadedFile.name}</p>
                          <p className="text-gray-400 text-sm">
                            {(uploadedFile.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeUploadedFile}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-brand-red transition-colors"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-10 h-10 text-brand-red animate-spin mb-2" />
                          <p className="text-gray-400">Datei wird verarbeitet...</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-gray-500 mb-2" />
                          <p className="text-white font-medium">Datei hochladen</p>
                          <p className="text-gray-400 text-sm mt-1">PDF, DOC, DOCX oder TXT (max. 5MB)</p>
                        </>
                      )}
                    </label>
                  )}
                </div>

                <div className="relative">
                  <div className="absolute inset-x-0 top-0 flex items-center justify-center -mt-3">
                    <span className="px-3 bg-brand-dark-card text-gray-500 text-sm">oder Text einfügen</span>
                  </div>
                </div>

                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Füge hier deinen Lebenslauf-Text ein oder kopiere ihn aus einem Dokument..."
                  className="input-field h-48 resize-none mt-4"
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
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4">
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
