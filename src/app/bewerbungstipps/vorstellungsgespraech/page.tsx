'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Users, Sparkles, ArrowLeft, Loader2, MessageSquare, ThumbsUp, AlertTriangle, RefreshCw } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'

interface InterviewQuestion {
  question: string
  tips: string[]
  exampleAnswer: string
}

export default function VorstellungsgespraechPage() {
  const t = useTranslations('interviewPage')

  const industries = t.raw('industries') as string[]

  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [questions, setQuestions] = useState<InterviewQuestion[]>([])
  const [activeQuestion, setActiveQuestion] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [feedback, setFeedback] = useState<{ rating: string; tips: string[] } | null>(null)
  const [isGettingFeedback, setIsGettingFeedback] = useState(false)

  const generateQuestions = async () => {
    if (!selectedIndustry || !jobTitle) {
      toast.error(t('errors.selectBoth'))
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/ai/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry: selectedIndustry, jobTitle }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error loading')
      }

      setQuestions(data.questions)
      setActiveQuestion(0)
      setUserAnswer('')
      setFeedback(null)
      toast.success('Interview-Fragen generiert!')
    } catch {
      toast.error('Fehler beim Generieren. Bitte versuche es erneut.')
    } finally {
      setIsLoading(false)
    }
  }

  const getFeedback = async () => {
    if (!userAnswer.trim()) {
      toast.error(t('errors.enterAnswer'))
      return
    }

    setIsGettingFeedback(true)
    setTimeout(() => {
      setFeedback({
        rating: userAnswer.length > 100 ? 'Gut' : 'Ausbaufähig',
        tips: [
          'Versuche konkrete Beispiele aus deiner Erfahrung zu nennen',
          'Halte die Antwort strukturiert: Situation, Aufgabe, Aktion, Ergebnis',
          'Zeige deine Motivation für genau diese Stelle',
        ],
      })
      setIsGettingFeedback(false)
      toast.success('Feedback erhalten!')
    }, 1500)
  }

  const nextQuestion = () => {
    if (activeQuestion < questions.length - 1) {
      setActiveQuestion(activeQuestion + 1)
      setUserAnswer('')
      setFeedback(null)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Link */}
          <Link href="/bewerbungstipps" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t('backLink')}
          </Link>

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-brand-red/20 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-brand-red" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{t('title')}</h1>
              <p className="text-gray-400">{t('subtitle')}</p>
            </div>
          </div>

          {questions.length === 0 ? (
            /* Setup Form */
            <div className="card max-w-xl mx-auto">
              <h2 className="text-lg font-semibold text-white mb-6">
                {t('setup.title')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="input-label">{t('setup.industry')}</label>
                  <select
                    value={selectedIndustry}
                    onChange={(e) => setSelectedIndustry(e.target.value)}
                    className="input-field"
                  >
                    <option value="">{t('setup.industryPlaceholder')}</option>
                    {industries.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">{t('setup.jobTitle')}</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder={t('setup.jobTitlePlaceholder')}
                    className="input-field"
                  />
                </div>

                <button
                  onClick={generateQuestions}
                  disabled={isLoading || !selectedIndustry || !jobTitle}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      {t('setup.loading')}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      {t('setup.start')}
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Interview Practice */
            <div className="space-y-6">
              {/* Progress */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">
                  {t('practice.questionOf', { current: activeQuestion + 1, total: questions.length })}
                </span>
                <button
                  onClick={() => {
                    setQuestions([])
                    setFeedback(null)
                    setUserAnswer('')
                  }}
                  className="text-gray-400 hover:text-white flex items-center"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  {t('practice.restart')}
                </button>
              </div>

              {/* Current Question */}
              <div className="card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-5 h-5 text-brand-red" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{t('practice.interviewer')}</p>
                    <p className="text-xl text-white font-medium">
                      {questions[activeQuestion].question}
                    </p>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-brand-dark p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium text-gray-300 mb-2">{t('practice.tips')}</p>
                  <ul className="space-y-1">
                    {questions[activeQuestion].tips.map((tip, i) => (
                      <li key={i} className="text-gray-400 text-sm flex items-start">
                        <span className="text-brand-red mr-2">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* User Answer */}
                <div className="mb-4">
                  <label className="input-label">{t('practice.yourAnswer')}</label>
                  <textarea
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder={t('practice.answerPlaceholder')}
                    className="input-field h-32"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={getFeedback}
                    disabled={isGettingFeedback || !userAnswer.trim()}
                    className="btn-primary flex-1 disabled:opacity-50"
                  >
                    {isGettingFeedback ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        {t('practice.analyzing')}
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        {t('practice.getFeedback')}
                      </>
                    )}
                  </button>
                  {activeQuestion < questions.length - 1 && (
                    <button onClick={nextQuestion} className="btn-secondary">
                      {t('practice.nextQuestion')}
                    </button>
                  )}
                </div>
              </div>

              {/* Feedback */}
              {feedback && (
                <div className="card">
                  <h3 className="font-semibold text-white mb-4 flex items-center">
                    {feedback.rating === 'Gut' ? (
                      <ThumbsUp className="w-5 h-5 mr-2 text-green-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                    )}
                    {t('practice.feedback')}: {feedback.rating}
                  </h3>
                  <ul className="space-y-2">
                    {feedback.tips.map((tip, i) => (
                      <li key={i} className="text-gray-300 flex items-start">
                        <span className="text-brand-red mr-2">→</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Example Answer */}
              <div className="card">
                <h3 className="font-semibold text-white mb-3">{t('practice.exampleAnswer')}</h3>
                <p className="text-gray-400 italic">
                  &ldquo;{questions[activeQuestion].exampleAnswer}&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
