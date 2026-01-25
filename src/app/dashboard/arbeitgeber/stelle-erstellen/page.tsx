'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, CheckCircle, Info } from 'lucide-react'
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

export default function StelleErstellen() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [company, setCompany] = useState<any>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: '',
    benefits: '',
    industries: [] as string[],
    employmentTypes: [] as string[],
    zipCode: '',
    city: '',
    salaryMin: '',
    salaryMax: '',
    salaryType: 'monthly',
    startDate: '',
  })

  useEffect(() => {
    loadCompany()
  }, [])

  async function loadCompany() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    const { data: companyData } = await supabase
      .from('companies')
      .select('*')
      .eq('auth_id', user.id)
      .single()
    
    if (companyData) {
      setCompany(companyData)
      setFormData(prev => ({
        ...prev,
        zipCode: companyData.zip_code || '',
        city: companyData.city || '',
        industries: companyData.industry ? [companyData.industry] : [],
      }))
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const toggleArrayField = (field: 'industries' | 'employmentTypes', value: string) => {
    setFormData(prev => {
      const current = prev[field]
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(v => v !== value) }
      } else {
        return { ...prev, [field]: [...current, value] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    // Validation
    if (!formData.title) {
      setError('Bitte geben Sie einen Jobtitel ein')
      setLoading(false)
      return
    }
    if (!formData.description) {
      setError('Bitte geben Sie eine Beschreibung ein')
      setLoading(false)
      return
    }
    if (formData.industries.length === 0) {
      setError('Bitte wählen Sie mindestens eine Branche aus')
      setLoading(false)
      return
    }
    if (formData.employmentTypes.length === 0) {
      setError('Bitte wählen Sie mindestens eine Beschäftigungsart aus')
      setLoading(false)
      return
    }
    if (!formData.zipCode || !formData.city) {
      setError('Bitte geben Sie PLZ und Ort ein')
      setLoading(false)
      return
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      setError('Bitte geben Sie eine Gehaltsspanne ein')
      setLoading(false)
      return
    }
    if (!formData.requirements) {
      setError('Bitte geben Sie die Anforderungen ein')
      setLoading(false)
      return
    }
    if (!formData.benefits) {
      setError('Bitte geben Sie die Benefits ein')
      setLoading(false)
      return
    }
    if (!formData.startDate) {
      setError('Bitte geben Sie ein Startdatum ein')
      setLoading(false)
      return
    }
    
    try {
      const supabase = createClient()
      
      const { error: insertError } = await supabase
        .from('jobs')
        .insert({
          company_id: company.id,
          title: formData.title,
          description: formData.description,
          requirements: formData.requirements,
          benefits: formData.benefits,
          industry: formData.industries[0], // Primary for backward compatibility
          industries: formData.industries,
          employment_type: formData.employmentTypes[0], // Primary
          employment_types: formData.employmentTypes,
          zip_code: formData.zipCode,
          city: formData.city,
          salary_min: parseInt(formData.salaryMin),
          salary_max: parseInt(formData.salaryMax),
          salary_type: formData.salaryType,
          start_date: formData.startDate,
          status: 'active',
        })
      
      if (insertError) throw insertError
      
      router.push('/dashboard/arbeitgeber?created=true')
      
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Logo size="md" />
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard/arbeitgeber" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <div className="card">
          <h1 className="text-2xl font-bold text-white mb-2">Neue Stellenanzeige</h1>
          <p className="text-gray-400 mb-6">
            Erstellen Sie eine neue Stellenanzeige für {company?.company_name}
          </p>

          <div className="flex items-start gap-2 p-4 bg-brand-red/10 border border-brand-red/30 rounded-lg mb-6">
            <Info className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-300">
              Alle mit <span className="text-brand-red">*</span> markierten Felder sind Pflichtfelder. 
              Je vollständiger Ihre Anzeige, desto bessere Bewerber erreichen Sie!
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Grunddaten</h2>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Jobtitel <span className="text-brand-red">*</span></label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="z.B. KFZ-Mechatroniker (m/w/d)"
                    value={formData.title}
                    onChange={e => updateFormData('title', e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="input-label">Branche(n) <span className="text-brand-red">*</span> <span className="text-gray-500 text-xs">(mehrere möglich)</span></label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {INDUSTRIES.map(ind => (
                      <button
                        key={ind.value}
                        type="button"
                        onClick={() => toggleArrayField('industries', ind.value)}
                        className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                          formData.industries.includes(ind.value)
                            ? 'bg-brand-red border-brand-red text-white'
                            : 'bg-brand-dark border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {ind.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="input-label">Beschäftigungsart(en) <span className="text-brand-red">*</span> <span className="text-gray-500 text-xs">(mehrere möglich)</span></label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {EMPLOYMENT_TYPES.map(type => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => toggleArrayField('employmentTypes', type.value)}
                        className={`px-3 py-2 rounded-lg border transition-colors text-sm ${
                          formData.employmentTypes.includes(type.value)
                            ? 'bg-brand-red border-brand-red text-white'
                            : 'bg-brand-dark border-gray-600 text-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Arbeitsort</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">PLZ <span className="text-brand-red">*</span></label>
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
                  <label className="input-label">Stadt <span className="text-brand-red">*</span></label>
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

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Stellenbeschreibung</h2>
              <div className="space-y-4">
                <div>
                  <label className="input-label">Beschreibung <span className="text-brand-red">*</span></label>
                  <textarea
                    className="input-field min-h-[150px]"
                    placeholder="Beschreiben Sie die Stelle und die Aufgaben..."
                    value={formData.description}
                    onChange={e => updateFormData('description', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Anforderungen <span className="text-brand-red">*</span></label>
                  <textarea
                    className="input-field min-h-[100px]"
                    placeholder="Welche Qualifikationen und Erfahrungen werden benötigt?"
                    value={formData.requirements}
                    onChange={e => updateFormData('requirements', e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Was wir bieten <span className="text-brand-red">*</span></label>
                  <textarea
                    className="input-field min-h-[100px]"
                    placeholder="Welche Benefits bieten Sie? (z.B. Gehalt, Urlaub, Weiterbildung)"
                    value={formData.benefits}
                    onChange={e => updateFormData('benefits', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Salary & Dates */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-4">Gehalt & Termine</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="input-label">Gehalt von (€) <span className="text-brand-red">*</span></label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="2500"
                      value={formData.salaryMin}
                      onChange={e => updateFormData('salaryMin', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Gehalt bis (€) <span className="text-brand-red">*</span></label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="3500"
                      value={formData.salaryMax}
                      onChange={e => updateFormData('salaryMax', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="input-label">Bezahlung</label>
                    <select
                      className="input-field"
                      value={formData.salaryType}
                      onChange={e => updateFormData('salaryType', e.target.value)}
                    >
                      <option value="hourly">Pro Stunde</option>
                      <option value="monthly">Pro Monat</option>
                      <option value="yearly">Pro Jahr</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="input-label">Startdatum <span className="text-brand-red">*</span></label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.startDate}
                    onChange={e => updateFormData('startDate', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-700">
              <Link 
                href="/dashboard/arbeitgeber"
                className="w-full sm:w-auto text-center py-3 px-6 border border-gray-600 text-gray-300 rounded-lg hover:border-gray-500 transition-colors"
              >
                Abbrechen
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto btn-primary flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Wird erstellt...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Stelle veröffentlichen
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
