'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { PenTool, Download, Sparkles, ArrowLeft, Loader2, Copy, Check } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

type DesignTemplate = 'modern' | 'klassisch' | 'kreativ'

export default function AnschreibenPage() {
  const t = useTranslations('coverLetterPage')

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

  const templates: { id: DesignTemplate; name: string }[] = [
    { id: 'modern', name: t('templates.modern') },
    { id: 'klassisch', name: t('templates.klassisch') },
    { id: 'kreativ', name: t('templates.kreativ') },
  ]

  const generateLetter = async () => {
    if (!formData.jobTitle || !formData.company || !formData.yourName) {
      toast.error(t('errors.fillRequired'))
      return
    }

    setIsGenerating(true)
    try {
      const apiData = {
        jobTitle: formData.jobTitle,
        companyName: formData.company,
        jobDescription: `Position: ${formData.jobTitle} bei ${formData.company}`,
        userProfile: `Name: ${formData.yourName}\n${formData.experience ? `Erfahrung: ${formData.experience}\n` : ''}${formData.skills ? `Fähigkeiten: ${formData.skills}\n` : ''}${formData.motivation ? `Motivation: ${formData.motivation}` : ''}`,
      }

      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Generation failed')
      }

      setGeneratedLetter(data.result?.coverLetter || data.coverLetter || '')
      toast.success('Anschreiben generiert!')
    } catch (error) {
      console.error('Generation error:', error)
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
            {t('backLink')}
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-red/20 rounded-xl flex items-center justify-center">
              <PenTool className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
              <p className="text-gray-400">{t('subtitle')}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <div className="card">
              <h2 className="text-lg font-semibold text-white mb-6">{t('form.title')}</h2>

              <div className="space-y-4">
                <div>
                  <label className="input-label">{t('form.jobTitle')} {t('form.required')}</label>
                  <input
                    type="text"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                    placeholder={t('form.jobTitlePlaceholder')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">{t('form.company')} {t('form.required')}</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder={t('form.companyPlaceholder')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">{t('form.yourName')} {t('form.required')}</label>
                  <input
                    type="text"
                    value={formData.yourName}
                    onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                    placeholder={t('form.yourNamePlaceholder')}
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="input-label">{t('form.experience')}</label>
                  <textarea
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder={t('form.experiencePlaceholder')}
                    className="input-field h-24"
                  />
                </div>

                <div>
                  <label className="input-label">{t('form.skills')}</label>
                  <textarea
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    placeholder={t('form.skillsPlaceholder')}
                    className="input-field h-24"
                  />
                </div>

                <div>
                  <label className="input-label">{t('form.motivation')}</label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                    placeholder={t('form.motivationPlaceholder')}
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
                      {t('generating')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t('generate')}
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
                      <h2 className="text-lg font-semibold text-white">{t('result.title')}</h2>
                      <button
                        onClick={copyToClipboard}
                        className="btn-secondary text-sm py-2"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            {t('result.copied')}
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            {t('result.copy')}
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
                    <h3 className="font-semibold text-white mb-4">{t('result.exportTitle')}</h3>
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
                      {t('result.download')}
                    </button>
                  </div>
                </>
              ) : (
                <div className="card text-center py-16">
                  <PenTool className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('result.noResult')}
                  </h3>
                  <p className="text-gray-400">
                    {t('result.noResultHint')}
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
