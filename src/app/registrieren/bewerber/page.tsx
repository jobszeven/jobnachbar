'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Logo from '@/components/Logo'
import { useTranslations } from 'next-intl'

export default function BewerberRegistrierung() {
  const router = useRouter()
  const t = useTranslations('register')
  const tIndustries = useTranslations('industries')
  const tEmploymentTypes = useTranslations('employmentTypes')

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const INDUSTRIES = [
    { value: 'handwerk', label: tIndustries('handwerk') },
    { value: 'pflege_gesundheit', label: tIndustries('pflege_gesundheit') },
    { value: 'gastro_hotel', label: tIndustries('gastro_hotel') },
    { value: 'einzelhandel', label: tIndustries('einzelhandel') },
    { value: 'logistik_transport', label: tIndustries('logistik_transport') },
    { value: 'industrie_produktion', label: tIndustries('industrie_produktion') },
    { value: 'buero_verwaltung', label: tIndustries('buero_verwaltung') },
    { value: 'it_technik', label: tIndustries('it_technik') },
    { value: 'bau_architektur', label: tIndustries('bau_architektur') },
    { value: 'landwirtschaft', label: tIndustries('landwirtschaft') },
    { value: 'bildung_soziales', label: tIndustries('bildung_soziales') },
    { value: 'sonstiges', label: tIndustries('sonstiges') },
  ]

  const EMPLOYMENT_TYPES = [
    { value: 'vollzeit', label: tEmploymentTypes('vollzeit') },
    { value: 'teilzeit', label: tEmploymentTypes('teilzeit') },
    { value: 'minijob', label: tEmploymentTypes('minijob') },
    { value: 'ausbildung', label: tEmploymentTypes('ausbildung') },
    { value: 'praktikum', label: tEmploymentTypes('praktikum') },
    { value: 'werkstudent', label: tEmploymentTypes('werkstudent') },
  ]

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
      if (!authData.user) throw new Error(t('applicant.errors.registrationFailed'))

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
      setError(err.message || t('applicant.errors.genericError'))
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    // Validation for each step
    if (step === 1) {
      if (!formData.email || !formData.password) {
        setError(t('applicant.errors.fillRequired'))
        return
      }
      if (formData.password !== formData.passwordConfirm) {
        setError(t('applicant.errors.passwordMismatch'))
        return
      }
      if (formData.password.length < 8) {
        setError(t('applicant.errors.passwordLength'))
        return
      }
    }
    if (step === 2) {
      if (!formData.firstName || !formData.lastName) {
        setError(t('applicant.errors.fillRequired'))
        return
      }
    }
    if (step === 3) {
      if (!formData.zipCode || !formData.city) {
        setError(t('applicant.errors.fillRequired'))
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
              {t('alreadyRegistered')}
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
              <h2 className="text-2xl font-bold text-white mb-2">{t('applicant.step1.title')}</h2>
              <p className="text-gray-400 mb-6">{t('applicant.step1.subtitle')}</p>

              <div className="space-y-4">
                <div>
                  <label className="input-label">{t('applicant.step1.email')} *</label>
                  <input
                    type="email"
                    className="input-field"
                    placeholder={t('applicant.step1.emailPlaceholder')}
                    value={formData.email}
                    onChange={e => updateFormData('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">{t('applicant.step1.password')} *</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder={t('applicant.step1.passwordPlaceholder')}
                    value={formData.password}
                    onChange={e => updateFormData('password', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">{t('applicant.step1.passwordConfirm')} *</label>
                  <input
                    type="password"
                    className="input-field"
                    placeholder={t('applicant.step1.passwordConfirmPlaceholder')}
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
              <h2 className="text-2xl font-bold text-white mb-2">{t('applicant.step2.title')}</h2>
              <p className="text-gray-400 mb-6">{t('applicant.step2.subtitle')}</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">{t('applicant.step2.firstName')} *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={t('applicant.step2.firstNamePlaceholder')}
                      value={formData.firstName}
                      onChange={e => updateFormData('firstName', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">{t('applicant.step2.lastName')} *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={t('applicant.step2.lastNamePlaceholder')}
                      value={formData.lastName}
                      onChange={e => updateFormData('lastName', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">{t('applicant.step2.phone')}</label>
                  <input
                    type="tel"
                    className="input-field"
                    placeholder={t('applicant.step2.phonePlaceholder')}
                    value={formData.phone}
                    onChange={e => updateFormData('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">{t('applicant.step2.birthdate')}</label>
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
              <h2 className="text-2xl font-bold text-white mb-2">{t('applicant.step3.title')}</h2>
              <p className="text-gray-400 mb-6">{t('applicant.step3.subtitle')}</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="input-label">{t('applicant.step3.zipCode')} *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={t('applicant.step3.zipCodePlaceholder')}
                      maxLength={5}
                      value={formData.zipCode}
                      onChange={e => updateFormData('zipCode', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">{t('applicant.step3.city')} *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder={t('applicant.step3.cityPlaceholder')}
                      value={formData.city}
                      onChange={e => updateFormData('city', e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label className="input-label">{t('applicant.step3.radius', { km: formData.radiusKm })}</label>
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
              <h2 className="text-2xl font-bold text-white mb-2">{t('applicant.step4.title')}</h2>
              <p className="text-gray-400 mb-6">{t('applicant.step4.subtitle')}</p>

              <div className="space-y-6">
                <div>
                  <label className="input-label">{t('applicant.step4.jobTitle')}</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={t('applicant.step4.jobTitlePlaceholder')}
                    value={formData.jobTitleWanted}
                    onChange={e => updateFormData('jobTitleWanted', e.target.value)}
                  />
                </div>

                <div>
                  <label className="input-label">{t('applicant.step4.industries')}</label>
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
                  <label className="input-label">{t('applicant.step4.employmentTypes')}</label>
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
                    <label className="input-label">{t('applicant.step4.experience')}</label>
                    <select
                      className="input-field"
                      value={formData.experienceYears}
                      onChange={e => updateFormData('experienceYears', parseInt(e.target.value))}
                    >
                      <option value={0}>{t('applicant.step4.experienceOptions.entry')}</option>
                      <option value={1}>{t('applicant.step4.experienceOptions.1-2')}</option>
                      <option value={3}>{t('applicant.step4.experienceOptions.3-5')}</option>
                      <option value={6}>{t('applicant.step4.experienceOptions.6-10')}</option>
                      <option value={10}>{t('applicant.step4.experienceOptions.10+')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">{t('applicant.step4.availableFrom')}</label>
                    <input
                      type="date"
                      className="input-field"
                      value={formData.availableFrom}
                      onChange={e => updateFormData('availableFrom', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">{t('applicant.step4.salaryExpectation')}</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder={t('applicant.step4.salaryPlaceholder')}
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
              <h2 className="text-2xl font-bold text-white mb-2">{t('applicant.step5.title')}</h2>
              <p className="text-gray-400 mb-6">{t('applicant.step5.subtitle')}</p>

              <div className="space-y-6">
                <div>
                  <label className="input-label">{t('applicant.step5.aboutMe')}</label>
                  <textarea
                    className="input-field min-h-[120px]"
                    placeholder={t('applicant.step5.aboutMePlaceholder')}
                    value={formData.aboutMe}
                    onChange={e => updateFormData('aboutMe', e.target.value)}
                  />
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <label className="input-label mb-4">{t('applicant.step5.notificationsLabel')}</label>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between p-4 rounded-lg border border-gray-700 cursor-pointer hover:border-gray-600">
                      <div>
                        <div className="text-white font-medium">{t('applicant.step5.emailNotifications')}</div>
                        <div className="text-sm text-gray-400">{t('applicant.step5.emailNotificationsDesc')}</div>
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
                        <div className="text-white font-medium">{t('applicant.step5.whatsappNotifications')}</div>
                        <div className="text-sm text-gray-400">{t('applicant.step5.whatsappNotificationsDesc')}</div>
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
                        <label className="input-label">{t('applicant.step5.whatsappNumber')}</label>
                        <input
                          type="tel"
                          className="input-field"
                          placeholder={t('applicant.step5.whatsappNumberPlaceholder')}
                          value={formData.whatsappNumber}
                          onChange={e => updateFormData('whatsappNumber', e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-sm text-gray-400">
                  {t('applicant.step5.termsText')}{' '}
                  <Link href="/agb" className="text-brand-red hover:underline">{t('applicant.step5.terms')}</Link> {t('applicant.step5.and')}{' '}
                  <Link href="/datenschutz" className="text-brand-red hover:underline">{t('applicant.step5.privacy')}</Link>.
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
                {t('back')}
              </button>
            ) : (
              <div />
            )}

            {step < 5 ? (
              <button onClick={nextStep} className="btn-primary flex items-center">
                {t('next')}
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
                    {t('applicant.step5.submitting')}
                  </>
                ) : (
                  <>
                    {t('applicant.step5.submit')}
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
