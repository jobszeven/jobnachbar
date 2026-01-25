'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, CheckCircle, X, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function BewerberProfil() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  
  // Form data
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [zipCode, setZipCode] = useState('')
  const [city, setCity] = useState('')
  const [jobTitleWanted, setJobTitleWanted] = useState('')
  const [aboutMe, setAboutMe] = useState('')
  const [salaryExpectation, setSalaryExpectation] = useState('')
  const [searchRadius, setSearchRadius] = useState('30')
  const [availableFrom, setAvailableFrom] = useState('')
  const [selectedBranchen, setSelectedBranchen] = useState<string[]>([])
  const [selectedArten, setSelectedArten] = useState<string[]>([])
  const [fileName, setFileName] = useState('')
  const [cvUrl, setCvUrl] = useState('')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [whatsappNotifications, setWhatsappNotifications] = useState(false)

  const branchen = ['Handwerk', 'Pflege', 'Gastronomie', 'Einzelhandel', 'Industrie', 'Büro/Verwaltung', 'IT', 'Logistik', 'Sonstiges']
  const arten = ['Vollzeit', 'Teilzeit', 'Minijob', 'Ausbildung', 'Praktikum', 'Werkstudent']

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()

    if (profile) {
      setUserId(profile.id)
      setFirstName(profile.first_name || '')
      setLastName(profile.last_name || '')
      setEmail(profile.email || '')
      setPhone(profile.phone || '')
      setZipCode(profile.zip_code || '')
      setCity(profile.city || '')
      setJobTitleWanted(profile.job_title_wanted || '')
      setAboutMe(profile.about_me || '')
      setSalaryExpectation(profile.salary_expectation?.toString() || '')
      setSearchRadius(profile.search_radius?.toString() || '30')
      setAvailableFrom(profile.available_from || '')
      setSelectedBranchen(profile.industries || [])
      setSelectedArten(profile.employment_types || [])
      setCvUrl(profile.cv_url || '')
      setFileName(profile.cv_url ? 'Lebenslauf hochgeladen' : '')
      setEmailNotifications(profile.email_notifications !== false)
      setWhatsappNotifications(profile.whatsapp_notifications === true)
    }

    setLoading(false)
  }

  const toggleSelection = (item: string, current: string[], setter: (val: string[]) => void) => {
    if (current.includes(item)) {
      setter(current.filter((i) => i !== item))
    } else {
      setter([...current, item])
    }
  }

  const handleFileClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError('Datei ist zu groß (max. 5MB)')
      return
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      setError('Nur PDF oder Word-Dokumente erlaubt')
      return
    }

    setFileName(file.name)
    setError('')
    
    // Upload to Supabase Storage
    const supabase = createClient()
    const fileExt = file.name.split('.').pop()
    const filePath = `${userId}/${Date.now()}.${fileExt}`

    const { data, error: uploadError } = await supabase.storage
      .from('resumes')
      .upload(filePath, file)

    if (uploadError) {
      console.error('Upload error:', uploadError)
      setError('Fehler beim Hochladen. Bitte versuche es erneut.')
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from('resumes')
      .getPublicUrl(filePath)

    setCvUrl(publicUrl)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    const supabase = createClient()

    const { error: updateError } = await supabase
      .from('users')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        zip_code: zipCode,
        city: city,
        job_title_wanted: jobTitleWanted,
        about_me: aboutMe,
        salary_expectation: salaryExpectation ? parseInt(salaryExpectation) : null,
        search_radius: parseInt(searchRadius),
        available_from: availableFrom || null,
        industries: selectedBranchen,
        employment_types: selectedArten,
        cv_url: cvUrl || null,
        email_notifications: emailNotifications,
        whatsapp_notifications: whatsappNotifications,
        updated_at: new Date().toISOString(),
      })
      .eq('auth_id', (await supabase.auth.getUser()).data.user?.id)

    setSaving(false)

    if (updateError) {
      console.error('Save error:', updateError)
      setError('Fehler beim Speichern. Bitte versuche es erneut.')
      return
    }

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const calculateCompleteness = () => {
    let score = 0
    if (firstName && lastName) score += 15
    if (email) score += 10
    if (phone) score += 10
    if (zipCode && city) score += 10
    if (jobTitleWanted) score += 15
    if (selectedBranchen.length > 0) score += 10
    if (selectedArten.length > 0) score += 10
    if (aboutMe && aboutMe.length >= 50) score += 10
    if (cvUrl) score += 10
    return score
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Profil wird geladen...</p>
        </div>
      </div>
    )
  }

  const completeness = calculateCompleteness()

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/dashboard/bewerber" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Profil bearbeiten</h1>
        <p className="text-gray-400 mb-8">Je vollständiger dein Profil, desto bessere Matches!</p>

        {/* Success Message */}
        {saved && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400">Profil erfolgreich gespeichert!</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg flex items-center gap-3">
            <X className="w-5 h-5 text-red-400" />
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-medium">Profil-Vollständigkeit</span>
            <span className="text-brand-red font-semibold">{completeness}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brand-red rounded-full transition-all duration-500" 
              style={{ width: `${completeness}%` }} 
            />
          </div>
        </div>

        <div className="space-y-8">
          {/* Persönliche Daten */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              Persönliche Daten
              {firstName && lastName && email && <CheckCircle className="w-5 h-5 text-green-400" />}
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Vorname *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Max" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Nachname *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Mustermann" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="input-label">E-Mail *</label>
                <input 
                  type="email" 
                  className="input-field bg-gray-800" 
                  value={email}
                  disabled
                />
                <p className="text-gray-500 text-sm mt-1">E-Mail kann nicht geändert werden</p>
              </div>
              <div>
                <label className="input-label">Telefon *</label>
                <input 
                  type="tel" 
                  className="input-field" 
                  placeholder="+49 123 456789" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">PLZ *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="27404" 
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Ort *</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="Zeven" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Wunschjob */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Wunschjob</h2>
            <div className="space-y-4">
              <div>
                <label className="input-label">Gewünschte Position *</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="z.B. Kfz-Mechaniker, Pflegefachkraft, Koch..." 
                  value={jobTitleWanted}
                  onChange={(e) => setJobTitleWanted(e.target.value)}
                />
              </div>
              
              <div>
                <label className="input-label">Branchen * (mehrere möglich)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {branchen.map((branche) => (
                    <button
                      key={branche}
                      type="button"
                      onClick={() => toggleSelection(branche, selectedBranchen, setSelectedBranchen)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        selectedBranchen.includes(branche)
                          ? 'bg-brand-red border-brand-red text-white'
                          : 'bg-brand-dark border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {branche}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="input-label">Beschäftigungsart * (mehrere möglich)</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {arten.map((art) => (
                    <button
                      key={art}
                      type="button"
                      onClick={() => toggleSelection(art, selectedArten, setSelectedArten)}
                      className={`px-3 py-2 rounded-lg border transition-colors ${
                        selectedArten.includes(art)
                          ? 'bg-brand-red border-brand-red text-white'
                          : 'bg-brand-dark border-gray-600 text-gray-300 hover:border-gray-500'
                      }`}
                    >
                      {art}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="input-label">Gehaltsvorstellung (€/Monat)</label>
                  <input 
                    type="number" 
                    className="input-field" 
                    placeholder="2500" 
                    value={salaryExpectation}
                    onChange={(e) => setSalaryExpectation(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Suchradius (km)</label>
                  <select 
                    className="input-field"
                    value={searchRadius}
                    onChange={(e) => setSearchRadius(e.target.value)}
                  >
                    <option value="10">10 km</option>
                    <option value="30">30 km</option>
                    <option value="50">50 km</option>
                    <option value="100">100 km</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="input-label">Verfügbar ab</label>
                <input 
                  type="date" 
                  className="input-field" 
                  value={availableFrom}
                  onChange={(e) => setAvailableFrom(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Über mich */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Über mich</h2>
            <div>
              <label className="input-label">Beschreibe dich kurz *</label>
              <textarea 
                className="input-field h-32" 
                placeholder="Was macht dich aus? Welche Stärken hast du? Was ist dir bei der Arbeit wichtig?"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
              <p className={`text-sm mt-2 ${aboutMe.length >= 50 ? 'text-green-400' : 'text-gray-500'}`}>
                {aboutMe.length}/50 Zeichen (mindestens 50 für bessere Matches)
              </p>
            </div>
          </div>

          {/* Lebenslauf */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              Lebenslauf
              {cvUrl && <CheckCircle className="w-5 h-5 text-green-400" />}
            </h2>
            <div 
              onClick={handleFileClick}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                fileName 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-gray-600 hover:border-brand-red'
              }`}
            >
              {fileName ? (
                <>
                  <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-green-400 font-medium mb-2">{fileName}</p>
                  <p className="text-gray-500 text-sm">Klicke um zu ersetzen</p>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">PDF oder Word-Dokument hochladen</p>
                  <p className="text-gray-500 text-sm">Max. 5MB</p>
                </>
              )}
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
              />
            </div>
          </div>

          {/* Benachrichtigungen */}
          <div className="card">
            <h2 className="text-xl font-semibold text-white mb-6">Benachrichtigungen</h2>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium">E-Mail Benachrichtigungen</p>
                  <p className="text-gray-400 text-sm">Neue passende Jobs per E-Mail</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-brand-red rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                </label>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white font-medium">WhatsApp Benachrichtigungen</p>
                  <p className="text-gray-400 text-sm">Sofortige Alerts auf dein Handy</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={whatsappNotifications}
                    onChange={(e) => setWhatsappNotifications(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:ring-2 peer-focus:ring-brand-red rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-red"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Wird gespeichert...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Profil speichern
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
