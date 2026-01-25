'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Briefcase, ArrowLeft, ArrowRight, CheckCircle, Loader2, Building2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

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

const COMPANY_SIZES = [
  { value: '1-10', label: '1-10 Mitarbeiter' },
  { value: '11-50', label: '11-50 Mitarbeiter' },
  { value: '51-200', label: '51-200 Mitarbeiter' },
  { value: '200+', label: 'Mehr als 200 Mitarbeiter' },
]

const PLANS = {
  free: { name: 'Starter', price: 0, jobs: 1, applications: 3 },
  basic: { name: 'Basic', price: 49, jobs: 5, applications: 10 },
  premium: { name: 'Premium', price: 99, jobs: 'Unbegrenzt', applications: 'Unbegrenzt' },
}

export default function ArbeitgeberRegistrierung() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center"><div className="text-white">Lädt...</div></div>}>
      <ArbeitgeberRegistrierungContent />
    </Suspense>
  )
}

function ArbeitgeberRegistrierungContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPlan = searchParams.get('plan') as keyof typeof PLANS || 'free'
  
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    // Step 1: Account
    email: '',
    password: '',
    passwordConfirm: '',
    
    // Step 2: Company Info
    companyName: '',
    contactPerson: '',
    phone: '',
    
    // Step 3: Address
    street: '',
    zipCode: '',
    city: '',
    
    // Step 4: Details
    website: '',
    industry: '',
    companySize: '',
    aboutCompany: '',
    
    // Step 5: Plan
    selectedPlan: preselectedPlan,
  })

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
            user_type: 'employer',
            company_name: formData.companyName,
          }
        }
      })
      
      if (authError) throw authError
      if (!authData.user) throw new Error('Registrierung fehlgeschlagen')
      
      // Calculate subscription expiry (1 month from now for paid plans)
      const expiryDate = new Date()
      expiryDate.setMonth(expiryDate.getMonth() + 1)
      
      // 2. Create company profile
      const { error: profileError } = await supabase
        .from('companies')
        .insert({
          auth_id: authData.user.id,
          email: formData.email,
          company_name: formData.companyName,
          contact_person: formData.contactPerson,
          phone: formData.phone,
          street: formData.street,
          zip_code: formData.zipCode,
          city: formData.city,
          website: formData.website,
          industry: formData.industry || null,
          company_size: formData.companySize,
          about_company: formData.aboutCompany,
          subscription_tier: formData.selectedPlan,
          subscription_expires: formData.selectedPlan === 'free' ? null : expiryDate.toISOString(),
        })
      
      if (profileError) throw profileError
      
      // Success - redirect to dashboard
      router.push('/dashboard/arbeitgeber?welcome=true')
      
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
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
      if (!formData.companyName || !formData.contactPerson) {
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
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-brand-navy" />
              </div>
              <span className="text-xl font-bold text-white">JobNachbar</span>
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
                    i === step ? 'bg-brand-emerald text-brand-navy' : 
                    'bg-gray-700 text-gray-400'}`}
              >
                {i < step ? <CheckCircle className="w-5 h-5" /> : i}
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className="h-2 bg-brand-emerald rounded-full transition-all"
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
              <div className="flex items-center mb-4">
                <Building2 className="w-8 h-8 text-brand-emerald mr-3" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Arbeitgeber-Account</h2>
                  <p className="text-gray-400">Erstelle deinen Firmenaccount</p>
                </div>
              </div>
              
              <div className="space-y-4 mt-6">
                <div>
                  <label className="input-label">Firmen-E-Mail Adresse *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder="personal@firma.de"
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

          {/* Step 2: Company Info */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Über Ihr Unternehmen</h2>
              <p className="text-gray-400 mb-6">Grundlegende Informationen</p>
              
              <div className="space-y-4">
                <div>
                  <label className="input-label">Firmenname *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Musterfirma GmbH"
                    value={formData.companyName}
                    onChange={e => updateFormData('companyName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Ansprechpartner *</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Max Mustermann"
                    value={formData.contactPerson}
                    onChange={e => updateFormData('contactPerson', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Telefonnummer</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder="04281 12345"
                    value={formData.phone}
                    onChange={e => updateFormData('phone', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Address */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Firmenadresse</h2>
              <p className="text-gray-400 mb-6">Wo befindet sich Ihr Unternehmen?</p>
              
              <div className="space-y-4">
                <div>
                  <label className="input-label">Straße & Hausnummer</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="Musterstraße 123"
                    value={formData.street}
                    onChange={e => updateFormData('street', e.target.value)}
                  />
                </div>
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
              </div>
            </div>
          )}

          {/* Step 4: Details */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Weitere Details</h2>
              <p className="text-gray-400 mb-6">Helfen Sie Bewerbern, Sie besser kennenzulernen</p>
              
              <div className="space-y-4">
                <div>
                  <label className="input-label">Website (optional)</label>
                  <input
                    type="url"
                    className="input-field"
                    placeholder="https://www.ihre-firma.de"
                    value={formData.website}
                    onChange={e => updateFormData('website', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Branche</label>
                  <select
                    className="input-field"
                    value={formData.industry}
                    onChange={e => updateFormData('industry', e.target.value)}
                  >
                    <option value="">Bitte wählen...</option>
                    {INDUSTRIES.map(ind => (
                      <option key={ind.value} value={ind.value}>{ind.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Unternehmensgröße</label>
                  <select
                    className="input-field"
                    value={formData.companySize}
                    onChange={e => updateFormData('companySize', e.target.value)}
                  >
                    <option value="">Bitte wählen...</option>
                    {COMPANY_SIZES.map(size => (
                      <option key={size.value} value={size.value}>{size.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Über Ihr Unternehmen (optional)</label>
                  <textarea
                    className="input-field min-h-[100px]"
                    placeholder="Was macht Ihr Unternehmen besonders? Warum sollten Bewerber bei Ihnen arbeiten wollen?"
                    value={formData.aboutCompany}
                    onChange={e => updateFormData('aboutCompany', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Plan Selection */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Wählen Sie Ihr Paket</h2>
              <p className="text-gray-400 mb-6">Sie können jederzeit upgraden oder kündigen</p>
              
              <div className="space-y-4">
                {/* Free Plan */}
                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors
                    ${formData.selectedPlan === 'free' 
                      ? 'border-brand-emerald bg-brand-emerald/10' 
                      : 'border-gray-700 hover:border-gray-600'}`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value="free"
                    className="sr-only"
                    checked={formData.selectedPlan === 'free'}
                    onChange={() => updateFormData('selectedPlan', 'free')}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">Starter</div>
                      <div className="text-sm text-gray-400">1 Stellenanzeige, 3 Bewerbungen/Monat</div>
                    </div>
                    <div className="text-2xl font-bold text-white">0€</div>
                  </div>
                </label>

                {/* Basic Plan */}
                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors relative
                    ${formData.selectedPlan === 'basic' 
                      ? 'border-brand-red bg-brand-blue/10' 
                      : 'border-gray-700 hover:border-gray-600'}`}
                >
                  <div className="absolute -top-3 right-4">
                    <span className="bg-brand-blue text-brand-navy text-xs font-semibold px-2 py-1 rounded-full">
                      Empfohlen
                    </span>
                  </div>
                  <input
                    type="radio"
                    name="plan"
                    value="basic"
                    className="sr-only"
                    checked={formData.selectedPlan === 'basic'}
                    onChange={() => updateFormData('selectedPlan', 'basic')}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">Basic</div>
                      <div className="text-sm text-gray-400">5 Stellenanzeigen, 10 Bewerbungen/Monat, Matching</div>
                    </div>
                    <div className="text-2xl font-bold text-white">49€<span className="text-sm font-normal text-gray-400">/Monat</span></div>
                  </div>
                </label>

                {/* Premium Plan */}
                <label
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors
                    ${formData.selectedPlan === 'premium' 
                      ? 'border-brand-emerald bg-brand-emerald/10' 
                      : 'border-gray-700 hover:border-gray-600'}`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value="premium"
                    className="sr-only"
                    checked={formData.selectedPlan === 'premium'}
                    onChange={() => updateFormData('selectedPlan', 'premium')}
                  />
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-white font-semibold">Premium</div>
                      <div className="text-sm text-gray-400">Unbegrenzt alles, Prioritäts-Platzierung, WhatsApp-Alerts</div>
                    </div>
                    <div className="text-2xl font-bold text-white">99€<span className="text-sm font-normal text-gray-400">/Monat</span></div>
                  </div>
                </label>
              </div>

              {formData.selectedPlan !== 'free' && (
                <div className="mt-6 p-4 bg-brand-dark-card rounded-lg">
                  <p className="text-sm text-gray-400">
                    <strong className="text-white">Hinweis:</strong> Die Zahlung erfolgt per Rechnung. 
                    Sie erhalten nach der Registrierung eine E-Mail mit den Zahlungsdetails. 
                    Ihr Abo beginnt sofort und kann monatlich gekündigt werden.
                  </p>
                </div>
              )}

              <div className="mt-6 text-sm text-gray-400">
                Mit der Registrierung akzeptieren Sie unsere{' '}
                <Link href="/agb" className="text-brand-red hover:underline">AGB</Link> und{' '}
                <Link href="/datenschutz" className="text-brand-red hover:underline">Datenschutzerklärung</Link>.
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
              <button onClick={nextStep} className="btn-primary flex items-center bg-brand-emerald hover:bg-emerald-400">
                Weiter
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex items-center bg-brand-emerald hover:bg-emerald-400"
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
