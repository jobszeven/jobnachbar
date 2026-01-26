'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, Circle, User, FileText, Image, MapPin, Bell, Sparkles, ChevronDown, ChevronUp, Trophy } from 'lucide-react'

interface ChecklistItem {
  id: string
  icon: React.ElementType
  title: string
  description: string
  href: string
  completed: boolean
}

interface OnboardingChecklistProps {
  userId: string
  userType: 'jobseeker' | 'employer'
  profile: {
    avatar_url?: string | null
    resume_url?: string | null
    location?: string | null
    email_notifications?: boolean
    profile_complete?: boolean
  }
}

export default function OnboardingChecklist({ userId, userType, profile }: OnboardingChecklistProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [items, setItems] = useState<ChecklistItem[]>([])

  useEffect(() => {
    if (userType === 'jobseeker') {
      setItems([
        {
          id: 'avatar',
          icon: Image,
          title: 'Profilbild hochladen',
          description: 'Mache einen guten ersten Eindruck',
          href: '/dashboard/bewerber/profil',
          completed: !!profile.avatar_url,
        },
        {
          id: 'resume',
          icon: FileText,
          title: 'Lebenslauf hochladen',
          description: 'Für schnelle Bewerbungen',
          href: '/dashboard/bewerber/profil',
          completed: !!profile.resume_url,
        },
        {
          id: 'location',
          icon: MapPin,
          title: 'Standort angeben',
          description: 'Für bessere Job-Matches',
          href: '/dashboard/bewerber/profil',
          completed: !!profile.location,
        },
        {
          id: 'notifications',
          icon: Bell,
          title: 'Benachrichtigungen aktivieren',
          description: 'Verpasse keine neuen Jobs',
          href: '/dashboard/bewerber/einstellungen',
          completed: !!profile.email_notifications,
        },
        {
          id: 'ai_tools',
          icon: Sparkles,
          title: 'KI-Tools ausprobieren',
          description: 'Lebenslauf-Check nutzen',
          href: '/tools/lebenslauf-check',
          completed: false, // Would need to track this separately
        },
      ])
    } else {
      setItems([
        {
          id: 'logo',
          icon: Image,
          title: 'Firmenlogo hochladen',
          description: 'Für mehr Sichtbarkeit',
          href: '/dashboard/arbeitgeber/profil',
          completed: !!profile.avatar_url,
        },
        {
          id: 'profile',
          icon: User,
          title: 'Firmenprofil vervollständigen',
          description: 'Beschreibung und Kontakt',
          href: '/dashboard/arbeitgeber/profil',
          completed: !!profile.profile_complete,
        },
        {
          id: 'location',
          icon: MapPin,
          title: 'Standort angeben',
          description: 'Für lokale Bewerber',
          href: '/dashboard/arbeitgeber/profil',
          completed: !!profile.location,
        },
        {
          id: 'job',
          icon: FileText,
          title: 'Erste Stelle ausschreiben',
          description: 'Finde passende Bewerber',
          href: '/dashboard/arbeitgeber/stelle-erstellen',
          completed: false, // Would need to track this separately
        },
      ])
    }
  }, [profile, userType])

  const completedCount = items.filter((item) => item.completed).length
  const totalCount = items.length
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0
  const isComplete = completedCount === totalCount

  if (isComplete) {
    return (
      <div className="card bg-gradient-to-r from-green-500/10 to-brand-dark-card border-green-500/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
            <Trophy className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Profil vollständig!</h3>
            <p className="text-gray-400 text-sm">
              Du hast alle Schritte abgeschlossen. Viel Erfolg bei der Jobsuche!
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-brand-red" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-white">Profil vervollständigen</h3>
            <p className="text-gray-400 text-sm">
              {completedCount} von {totalCount} Schritten abgeschlossen
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-red rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Checklist Items */}
      {isExpanded && (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                item.completed
                  ? 'bg-green-500/10 border border-green-500/30'
                  : 'bg-brand-dark hover:bg-gray-800/50 border border-gray-700 hover:border-brand-red/30'
              }`}
            >
              {/* Status Icon */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  item.completed
                    ? 'bg-green-500/20'
                    : 'bg-gray-700'
                }`}
              >
                {item.completed ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-500" />
                )}
              </div>

              {/* Item Icon */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  item.completed
                    ? 'bg-green-500/10'
                    : 'bg-brand-red/10'
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    item.completed ? 'text-green-500' : 'text-brand-red'
                  }`}
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${
                    item.completed ? 'text-gray-400 line-through' : 'text-white'
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-gray-500 text-sm truncate">
                  {item.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
