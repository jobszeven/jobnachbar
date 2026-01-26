'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, User, FileText, Search, Bell, Sparkles, CheckCircle } from 'lucide-react'

interface OnboardingStep {
  icon: React.ElementType
  title: string
  description: string
  image?: string
}

const applicantSteps: OnboardingStep[] = [
  {
    icon: User,
    title: 'Willkommen bei JobNachbar!',
    description: 'Wir freuen uns, dass du dabei bist. In wenigen Schritten zeigen wir dir, wie du JobNachbar optimal nutzen kannst.',
  },
  {
    icon: FileText,
    title: 'Vervollständige dein Profil',
    description: 'Je vollständiger dein Profil, desto bessere Job-Matches bekommst du. Lade deinen Lebenslauf hoch und füge ein Foto hinzu.',
  },
  {
    icon: Search,
    title: 'Finde passende Jobs',
    description: 'Nutze die Jobsuche, um Stellen in deiner Nähe zu finden. Filtere nach Branche, Arbeitszeit und Entfernung.',
  },
  {
    icon: Bell,
    title: 'Aktiviere Job-Benachrichtigungen',
    description: 'Erhalte neue passende Jobs direkt per E-Mail. Du verpasst keine Chance mehr!',
  },
  {
    icon: Sparkles,
    title: 'Nutze unsere KI-Tools',
    description: 'Lebenslauf-Check, Anschreiben-Generator und Interview-Coach helfen dir bei deiner Bewerbung.',
  },
  {
    icon: CheckCircle,
    title: 'Los geht\'s!',
    description: 'Du bist bereit! Starte jetzt mit der Jobsuche oder vervollständige zuerst dein Profil.',
  },
]

const employerSteps: OnboardingStep[] = [
  {
    icon: User,
    title: 'Willkommen bei JobNachbar!',
    description: 'Schön, dass Sie dabei sind. Wir zeigen Ihnen, wie Sie schnell qualifizierte Bewerber aus der Region finden.',
  },
  {
    icon: FileText,
    title: 'Firmenprofil einrichten',
    description: 'Erstellen Sie ein ansprechendes Firmenprofil mit Logo und Beschreibung. Bewerber möchten wissen, bei wem sie arbeiten werden.',
  },
  {
    icon: Search,
    title: 'Erste Stelle ausschreiben',
    description: 'Beschreiben Sie die Position, Anforderungen und was Sie bieten. Je detaillierter, desto passender die Bewerber.',
  },
  {
    icon: Bell,
    title: 'Bewerbungen verwalten',
    description: 'Alle eingehenden Bewerbungen finden Sie in Ihrem Dashboard. Sie werden per E-Mail benachrichtigt.',
  },
  {
    icon: CheckCircle,
    title: 'Bereit zum Starten!',
    description: 'Schreiben Sie jetzt Ihre erste Stelle aus und finden Sie passende Mitarbeiter aus der Region.',
  },
]

interface OnboardingModalProps {
  userType: 'jobseeker' | 'employer'
  onComplete: () => void
  isOpen: boolean
}

export default function OnboardingModal({ userType, onComplete, isOpen }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const steps = userType === 'employer' ? employerSteps : applicantSteps

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  const CurrentIcon = steps[currentStep].icon

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-brand-dark-card border border-gray-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl">
        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Überspringen"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-brand-red'
                    : index < currentStep
                    ? 'bg-brand-red/50'
                    : 'bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Icon */}
          <div className="w-20 h-20 bg-brand-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CurrentIcon className="w-10 h-10 text-brand-red" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-4">
            {steps[currentStep].title}
          </h2>

          {/* Description */}
          <p className="text-gray-400 leading-relaxed mb-8">
            {steps[currentStep].description}
          </p>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center text-gray-400 hover:text-white transition-colors ${
                currentStep === 0 ? 'invisible' : ''
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Zurück
            </button>

            <button
              onClick={handleNext}
              className="btn-primary"
            >
              {currentStep === steps.length - 1 ? (
                'Loslegen'
              ) : (
                <>
                  Weiter
                  <ChevronRight className="w-5 h-5 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
