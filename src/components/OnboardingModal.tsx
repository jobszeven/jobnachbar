'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight, MapPin, FileText, Sparkles, Bell, CheckCircle } from 'lucide-react'

interface OnboardingModalProps {
  userType: 'bewerber' | 'arbeitgeber'
  onComplete: () => void
}

interface Step {
  icon: React.ElementType
  title: string
  description: string
  image?: string
}

const bewerberSteps: Step[] = [
  {
    icon: MapPin,
    title: 'Willkommen bei JobNachbar!',
    description: 'Die lokale Jobbörse für Zeven und Umgebung. Hier findest du Jobs direkt in deiner Nähe - keine langen Anfahrtswege mehr!',
  },
  {
    icon: FileText,
    title: 'Vervollständige dein Profil',
    description: 'Je vollständiger dein Profil, desto besser können wir passende Jobs für dich finden. Lade deinen Lebenslauf hoch und füge deine Fähigkeiten hinzu.',
  },
  {
    icon: Sparkles,
    title: 'Nutze unsere KI-Tools',
    description: 'Lass deinen Lebenslauf checken, generiere überzeugende Anschreiben und bereite dich mit dem Interview-Coach vor - alles mit KI-Unterstützung!',
  },
  {
    icon: Bell,
    title: 'Aktiviere Job-Alerts',
    description: 'Erhalte automatisch Benachrichtigungen, wenn neue Jobs erscheinen, die zu deinen Wünschen passen. So verpasst du keine Chance!',
  },
  {
    icon: CheckCircle,
    title: 'Los geht\'s!',
    description: 'Du bist bereit! Starte jetzt deine Jobsuche oder vervollständige erst dein Profil für bessere Ergebnisse.',
  },
]

const arbeitgeberSteps: Step[] = [
  {
    icon: MapPin,
    title: 'Willkommen bei JobNachbar!',
    description: 'Die lokale Jobbörse für Arbeitgeber in Zeven und Umgebung. Finden Sie qualifizierte Mitarbeiter aus der Region.',
  },
  {
    icon: FileText,
    title: 'Erstellen Sie Ihr Firmenprofil',
    description: 'Ein vollständiges Firmenprofil schafft Vertrauen. Laden Sie Ihr Logo hoch und beschreiben Sie Ihr Unternehmen.',
  },
  {
    icon: Sparkles,
    title: 'Stellenanzeigen schalten',
    description: 'Erstellen Sie überzeugende Stellenanzeigen. Unsere Vorlagen helfen Ihnen dabei, die richtigen Bewerber anzusprechen.',
  },
  {
    icon: Bell,
    title: 'Bewerbungen verwalten',
    description: 'Alle Bewerbungen an einem Ort. Sehen Sie Profile, kommunizieren Sie direkt und treffen Sie schnelle Entscheidungen.',
  },
  {
    icon: CheckCircle,
    title: 'Bereit!',
    description: 'Sie können jetzt loslegen. Erstellen Sie Ihre erste Stellenanzeige oder vervollständigen Sie erst Ihr Firmenprofil.',
  },
]

export default function OnboardingModal({ userType, onComplete }: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const steps = userType === 'bewerber' ? bewerberSteps : arbeitgeberSteps

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = () => {
    setIsVisible(false)
    setTimeout(() => {
      // Store in localStorage that onboarding is complete
      localStorage.setItem('onboarding_completed', 'true')
      onComplete()
    }, 300)
  }

  const handleSkip = () => {
    handleComplete()
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon
  const isLastStep = currentStep === steps.length - 1

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleSkip} />

      {/* Modal */}
      <div
        className={`relative bg-brand-dark-card border border-gray-800 rounded-2xl max-w-lg w-full mx-4 overflow-hidden transform transition-all duration-300 ${
          isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
          aria-label="Überspringen"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-brand-red/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Icon className="w-10 h-10 text-brand-red" />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-4">
            {currentStepData.title}
          </h2>

          {/* Description */}
          <p className="text-gray-400 mb-8 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'w-6 bg-brand-red'
                    : index < currentStep
                    ? 'bg-brand-red/50'
                    : 'bg-gray-600'
                }`}
                aria-label={`Gehe zu Schritt ${index + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                currentStep === 0
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Zurück
            </button>

            <button
              onClick={handleNext}
              className="btn-primary flex items-center"
            >
              {isLastStep ? 'Loslegen' : 'Weiter'}
              {!isLastStep && <ChevronRight className="w-5 h-5 ml-1" />}
            </button>
          </div>
        </div>

        {/* Skip Link */}
        <div className="text-center pb-6">
          <button
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
          >
            Überspringen
          </button>
        </div>
      </div>
    </div>
  )
}
