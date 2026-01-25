'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'

const INDUSTRIES = [
  { value: 'handwerk', label: 'Handwerk' },
  { value: 'pflege_gesundheit', label: 'Pflege & Gesundheit' },
  { value: 'gastro_hotel', label: 'Gastro & Hotel' },
  { value: 'einzelhandel', label: 'Einzelhandel' },
  { value: 'logistik_transport', label: 'Logistik & Transport' },
  { value: 'industrie_produktion', label: 'Industrie & Produktion' },
  { value: 'buero_verwaltung', label: 'Büro & Verwaltung' },
  { value: 'it_technik', label: 'IT & Technik' },
  { value: 'bau_architektur', label: 'Bau & Architektur' },
  { value: 'landwirtschaft', label: 'Landwirtschaft' },
  { value: 'bildung_soziales', label: 'Bildung & Soziales' },
  { value: 'sonstiges', label: 'Sonstiges' },
]

const EMPLOYMENT_TYPES = [
  { value: 'vollzeit', label: 'Vollzeit' },
  { value: 'teilzeit', label: 'Teilzeit' },
  { value: 'minijob', label: 'Minijob' },
  { value: 'ausbildung', label: 'Ausbildung' },
  { value: 'praktikum', label: 'Praktikum' },
  { value: 'werkstudent', label: 'Werkstudent' },
]

export default function BewerberRegistrierung() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    password: '',
    passwordConfirm: '',
    
    // Step 2: Personal Info
    firstName: '',
    lastName: '',
    phone: '',
    birthdate: '',
    
    // Step 3: Location
    zipCode: '',
    city: '',
    radiusKm: 30,
    
    // Step 4: Job Preferences
    jobTitleWanted: '',
    industries: [] as string[],
    employmentTypes: [] as string[],
    experienceYears: 0,
    availableFrom: '',
    salaryExpectation: '',
    
    // Step 5: About
    aboutMe: '',
    emailNotifications: true,
    whatsappNotifications: false,
    whatsappNumber: '',
  })

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayItem = (field: string, value: string) => {
    setFormData(prev => {
      const arr = prev[field as keyof typeof prev] as string[]
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...arr, value] }
      }
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    
    try {
      const supabase = createClient()
      
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: 'applicant',
            first_name: formData.firstName,
            last_name: formData.lastName,
          }
        }
      })
      
      if (authError) throw authError
      if (!authData.user) throw new Error('Registrierung fehlgeschlagen')
      
      // 2. Create user profile
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          auth_id: authData.user.id,
          email: formData.email,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          birthdate: formData.birthdate || null,
          zip_code: formData.zipCode,
          city: formData.city,
          radius_km: formData.radiusKm,
          job_title_wanted: formData.jobTitleWanted,
          industries: formData.industries,
          employment_types: formData.employmentTypes,
          experience_years: formData.experienceYears,
          available_from: formData.availableFrom || null,
          salary_expectation: formData.salaryExpectation,
          about_me: formData.aboutMe,
          email_notifications: formData.emailNotifications,
          whatsapp_notifications: formData.whatsappNotifications,
          whatsapp_number: formData.whatsappNumber,
        })
      
      if (profileError) throw profileError
      
      // Success - redirect to dashboard
      router.push('/dashboard/bewerber?welcome=true')
      
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    // Validation for each step
    if (step === 1) {
      if (!formData.email || !formData.password) {
        setError('Bitte fülle alle Pflichtfelder aus')
        return
      }
      if (formData.password !== formData.passwordConfirm) {
        setError('Passwörter stimmen nicht überein')
        return
      }
      if (formData.password.length < 8) {
        setError('Passwort muss mindestens 8 Zeichen haben')
        return
      }
    }
    if (step === 2) {
      if (!formData.firstName || !formData.lastName) {
        setError('Bitte fülle alle Pflichtfelder aus')
        return
      }
    }
    if (step === 3) {
      if (!formData.zipCode || !formData.city) {
        setError('Bitte fülle alle Pflichtfelder aus')
        return
      }
    }
    
    setError('')
    setStep(prev => prev + 1)
  }

  const prevStep = () => {
    setError('')
    setStep(prev => prev - 1)
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <nav className="border-b border-gray-800 bg-brand-dark sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Logo size="md" />
            </Link>
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Bereits registriert? Anmelden
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div 
                key={i}
                className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium
                  ${i < step ? 'bg-brand-emerald text-white' : 
                    i === step ? 'bg-brand-blue text-brand-navy' : 
                    'bg-gray-700 text-gray-400'}`}
              >
                {i < step ? <CheckCircle className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className="h-2 bg-brand-blue rounded-full transition-all"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="card">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Step 1: Account */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Account erstellen</h2>
              <p className="text-gray-400 mb-6">Deine Login-Daten für JobNachbar</p>
              
              <div className="space-y-4">
                <div>
                  <label className="input-label">E-Mail Adresse *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="max@beispiel.de"
                    value={formData.email}
                    onChange={e => updateFormData('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Passwort *</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Mindestens 8 Zeichen"
                    value={formData.password}
                    onChange={e => updateFormData('password', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Passwort wiederholen *</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder="Passwort bestätigen"
                    value={formData.passwordConfirm}
                    onChange={e => updateFormData('passwordConfirm', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Personal Info */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Persönliche Daten</h2>
              <p className="text-gray-400 mb-6">Wie können Arbeitgeber dich erreichen?</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Vorname *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Max"
                      value={formData.firstName}
                      onChange={e => updateFormData('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Nachname *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Mustermann"
                      value={formData.lastName}
                      onChange={e => updateFormData('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Telefonnummer</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="0151 12345678"
                    value={formData.phone}
                    onChange={e => updateFormData('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Geburtsdatum</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.birthdate}
                    onChange={e => updateFormData('birthdate', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Dein Standort</h2>
              <p className="text-gray-400 mb-6">Wo möchtest du arbeiten?</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Postleitzahl *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="27404"
                      maxLength={5}
                      value={formData.zipCode}
                      onChange={e => updateFormData('zipCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Stadt *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Zeven"
                      value={formData.city}
                      onChange={e => updateFormData('city', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">Suchradius: {formData.radiusKm} km</label>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="5"
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    value={formData.radiusKm}
                    onChange={e => updateFormData('radiusKm', parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-sm text-gray-400 mt-1">
                    <span>5 km</span>
                    <span>50 km</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Job Preferences */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Was suchst du?</h2>
              <p className="text-gray-400 mb-6">Je genauer, desto bessere Matches</p>
              
              <div className="space-y-6">
                <div>
                  <label className="input-label">Gewünschter Job / Berufsbezeichnung</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="z.B. KFZ-Mechatroniker, Pflegefachkraft, Verkäufer"
                    value={formData.jobTitleWanted}
                    onChange={e => updateFormData('jobTitleWanted', e.target.value)}
                  />
                </div>

                <div>
                  <label className="input-label">Branchen (mehrere möglich)</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {INDUSTRIES.map(industry => (
                      <label
                        key={industry.value}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                          ${formData.industries.includes(industry.value) 
                            ? 'border-brand-red bg-brand-blue/10 text-white' 
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.industries.includes(industry.value)}
                          onChange={() => toggleArrayItem('industries', industry.value)}
                        />
                        <span className="text-sm">{industry.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Beschäftigungsart (mehrere möglich)</label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {EMPLOYMENT_TYPES.map(type => (
                      <label
                        key={type.value}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                          ${formData.employmentTypes.includes(type.value) 
                            ? 'border-brand-red bg-brand-blue/10 text-white' 
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'}`}
                      >
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={formData.employmentTypes.includes(type.value)}
                          onChange={() => toggleArrayItem('employmentTypes', type.value)}
                        />
                        <span className="text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">Berufserfahrung (Jahre)</label>
                    <select
                      className="input-field"
                      value={formData.experienceYears}
                      onChange={e => updateFormData('experienceYears', parseInt(e.target.value))}
                    >
                      <option value={0}>Keine / Berufseinsteiger</option>
                      <option value={1}>1-2 Jahre</option>
                      <option value={3}>3-5 Jahre</option>
                      <option value={6}>6-10 Jahre</option>
                      <option value={10}>Mehr als 10 Jahre</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Verfügbar ab</label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.availableFrom}
                      onChange={e => updateFormData('availableFrom', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Gehaltsvorstellung (optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="z.B. 2.500€ brutto, 15€/Stunde, Verhandlungsbasis"
                    value={formData.salaryExpectation}
                    onChange={e => updateFormData('salaryExpectation', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: About & Notifications */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Fast geschafft!</h2>
              <p className="text-gray-400 mb-6">Erzähl uns noch etwas über dich</p>
              
              <div className="space-y-6">
                <div>
                  <label className="input-label">Über mich (optional)</label>
                  <textarea
                    className="input-field min-h-[120px]"
                    placeholder="Was macht dich aus? Welche Stärken hast du? Was ist dir bei der Arbeit wichtig?"
                    value={formData.aboutMe}
                    onChange={e => updateFormData('aboutMe', e.target.value)}
                  />
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <label className="input-label mb-4">Wie möchtest du über neue Jobs informiert werden?</label>
                  
                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600">
                      <div>
                        <div className="text-white font-medium">E-Mail Benachrichtigungen</div>
                        <div className="text-sm text-gray-400">Neue passende Jobs per E-Mail erhalten</div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-600 text-brand-red focus:ring-brand-blue"
                        checked={formData.emailNotifications}
                        onChange={e => updateFormData('emailNotifications', e.target.checked)}
                      />
                    </label>

                    <label className="flex items-center justify-between p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600">
                      <div>
                        <div className="text-white font-medium">WhatsApp Benachrichtigungen</div>
                        <div className="text-sm text-gray-400">Sofortige Alerts auf dein Handy</div>
                      </div>
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-600 text-brand-red focus:ring-brand-blue"
                        checked={formData.whatsappNotifications}
                        onChange={e => updateFormData('whatsappNotifications', e.target.checked)}
                      />
                    </label>

                    {formData.whatsappNotifications && (
                      <div className="ml-4">
                        <label className="input-label">WhatsApp Nummer</label>
                        <input
                          type="tel"
                          className="input-field"
                          placeholder="0151 12345678"
                          value={formData.whatsappNumber}
                          onChange={e => updateFormData('whatsappNumber', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  Mit der Registrierung akzeptierst du unsere{' '}
                  <Link href="/agb" className="text-brand-red hover:underline">AGB</Link> und{' '}
                  <Link href="/datenschutz" className="text-brand-red hover:underline">Datenschutzerklärung</Link>.
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button onClick={nextStep} className="btn-primary flex items-center">
                Weiter
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    Registrierung abschließen
                    <CheckCircle className="w-5 h-5 ml-2" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
