'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PenTool, Download, Sparkles, ArrowLeft, Loader2, Copy, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

type DesignTemplate = 'modern' | 'klassisch' | 'kreativ'

export default function AnschreibenPage() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    yourName: '',
    experience: '',
    skills: '',
    motivation: '',
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate>('modern')
  const [copied, setCopied] = useState(false)

  const templates = [
    { id: 'modern' as const, name: 'Modern', description: 'Klares, zeitgemäßes Design' },
    { id: 'klassisch' as const, name: 'Klassisch', description: 'Traditionell und seriös' },
    { id: 'kreativ' as const, name: 'Kreativ', description: 'Auffällig und individuell' },
  ]

  const generateLetter = async () => {
    if (!formData.jobTitle || !formData.company || !formData.yourName) {
      toast.error('Bitte fülle mindestens Job-Titel, Unternehmen und deinen Namen aus')
      return
    }

    setIsGenerating(true)
    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Generierung fehlgeschlagen')
      }

      setGeneratedLetter(data.coverLetter)
      toast.success('Anschreiben generiert!')
    } catch (error) {
      toast.error('Fehler bei der Generierung. Bitte versuche es erneut.')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(generatedLetter)
    setCopied(true)
    toast.success('In Zwischenablage kopiert!')
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadPDF = () => {
    toast.loading('PDF wird erstellt...', { id: 'pdf' })
    setTimeout(() => {
      toast.success('PDF-Download wird in Premium freigeschaltet', { id: 'pdf', icon: '💎' })
    }, 1500)
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
              <PenTool className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Anschreiben-Generator</h1>
              <p className="text-gray-400">Erstelle individuelle Anschreiben mit KI</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-6">Deine Angaben</h2>

              <div className="space-y-4">
                <div>
                  <label className="input-label">Job-Titel *</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder="z.B. Verkäufer/in, Kfz-Mechatroniker/in"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Unternehmen *</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Name des Unternehmens"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Dein Name *</label>
                  <input
                    type="text"
                    value={formData.yourName}
                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                    placeholder="Dein vollständiger Name"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">Berufserfahrung</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="Beschreibe kurz deine relevante Berufserfahrung..."
                    className="input-field h-24"
                  />
                </div>

                <div>
                  <label className="input-label">Fähigkeiten & Stärken</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder="Welche Fähigkeiten bringst du mit?"
                    className="input-field h-24"
                  />
                </div>

                <div>
                  <label className="input-label">Motivation</label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder="Warum möchtest du bei diesem Unternehmen arbeiten?"
                    className="input-field h-24"
                  />
                </div>

                <button
                  onClick={generateLetter}
                  disabled={isGenerating}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Generiere...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Anschreiben generieren
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              {generatedLetter ? (
                <>
                  <div className="card">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-white">Dein Anschreiben</h2>
                      <button
                        onClick={copyToClipboard}
                        className="btn-secondary text-sm py-2"
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
                    <div className="bg-brand-dark p-4 rounded-lg">
                      <pre className="text-gray-300 whitespace-pre-wrap font-sans text-sm">
                        {generatedLetter}
                      </pre>
                    </div>
                  </div>

                  {/* PDF Export */}
                  <div className="card">
                    <h3 className="font-semibold text-white mb-4">Als PDF exportieren</h3>
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
                        </button>
                      ))}
                    </div>
                    <button onClick={downloadPDF} className="btn-secondary w-full">
                      <Download className="w-5 h-5 mr-2" />
                      PDF herunterladen
                    </button>
                  </div>
                </>
              ) : (
                <div className="card text-center py-16">
                  <PenTool className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Noch kein Anschreiben
                  </h3>
                  <p className="text-gray-400">
                    Fülle das Formular aus und klicke auf &ldquo;Anschreiben generieren&rdquo;
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
