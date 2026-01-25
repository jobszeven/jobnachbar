'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Briefcase, ArrowLeft, Send, Loader2, CheckCircle, 
  Building2, MapPin, Clock, AlertCircle
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function BewerbenPage({
  params,
}: {
  params: { jobId: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [job, setJob] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [coverLetter, setCoverLetter] = useState('')

  useEffect(() => {
    loadData()
  }, [params.jobId])

  async function loadData() {
    const supabase = createClient()
    
    // Check auth
    const { data: { user: authUser } } = await supabase.auth.getUser()
    setUser(authUser)
    
    if (authUser) {
      // Get user profile
      const { data: profileData } = await supabase
        .from('users')
        .select('*')
        .eq('auth_id', authUser.id)
        .single()
      
      setProfile(profileData)
    }
    
    // Get job details
    const { data: jobData, error: jobError } = await supabase
      .from('jobs')
      .select(`
        *,
        companies (
          id,
          company_name,
          logo_url,
          city
        )
      `)
      .eq('id', params.jobId)
      .eq('status', 'active')
      .single()
    
    if (jobError || !jobData) {
      setError('Stelle nicht gefunden')
    } else {
      setJob(jobData)
    }
    
    setLoading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!user || !profile) {
      router.push(`/login?redirect=/bewerben/${params.jobId}`)
      return
    }
    
    setSubmitting(true)
    setError('')
    
    try {
      const supabase = createClient()
      
      // Check if already applied
      const { data: existingApplication } = await supabase
        .from('applications')
        .select('id')
        .eq('user_id', profile.id)
        .eq('job_id', job.id)
        .single()
      
      if (existingApplication) {
        setError('Du hast dich bereits auf diese Stelle beworben.')
        setSubmitting(false)
        return
      }
      
      // Create application
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          user_id: profile.id,
          job_id: job.id,
          company_id: job.company_id,
          cover_letter: coverLetter || null,
          status: 'new',
        })
      
      if (insertError) throw insertError
      
      setSuccess(true)
      
    } catch (err: any) {
      setError(err.message || 'Ein Fehler ist aufgetreten')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Wird geladen...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-brand-dark">
        <nav className="border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-brand-navy" />
                </div>
                <span className="text-xl font-bold text-white">JobNachbar</span>
              </Link>
            </div>
          </div>
        </nav>
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="card text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Stelle nicht gefunden</h1>
            <p className="text-gray-400 mb-6">
              Diese Stelle existiert nicht mehr oder ist nicht mehr verfügbar.
            </p>
            <Link href="/jobs" className="btn-primary">
              Alle Jobs ansehen
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-brand-blue rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-brand-navy" />
              </div>
              <span className="text-xl font-bold text-white">JobNachbar</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link 
          href={`/jobs/${params.jobId}`}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Stelle
        </Link>

        {success ? (
          <div className="card text-center py-12">
            <div className="w-20 h-20 bg-brand-emerald/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-brand-emerald" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Bewerbung gesendet!</h1>
            <p className="text-gray-400 mb-6">
              Deine Bewerbung wurde erfolgreich an {job.companies?.company_name} übermittelt.
              Du erhältst eine Bestätigung per E-Mail.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard/bewerber" className="btn-primary">
                Zum Dashboard
              </Link>
              <Link href="/jobs" className="btn-secondary">
                Weitere Jobs ansehen
              </Link>
            </div>
          </div>
        ) : (
          <div className="card">
            <h1 className="text-2xl font-bold text-white mb-6">Bewerbung senden</h1>

            {/* Job Summary */}
            <div className="p-4 bg-brand-dark rounded-lg mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  {job.companies?.logo_url ? (
                    <img 
                      src={job.companies.logo_url} 
                      alt={job.companies.company_name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Building2 className="w-7 h-7 text-gray-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">{job.title}</h2>
                  <p className="text-gray-400">{job.companies?.company_name}</p>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {job.city}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {!user ? (
              // Not logged in
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Anmeldung erforderlich</h2>
                <p className="text-gray-400 mb-6">
                  Um dich zu bewerben, musst du angemeldet sein.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    href={`/login?redirect=/bewerben/${params.jobId}`}
                    className="btn-primary"
                  >
                    Anmelden
                  </Link>
                  <Link 
                    href={`/registrieren/bewerber?redirect=/bewerben/${params.jobId}`}
                    className="btn-secondary"
                  >
                    Registrieren
                  </Link>
                </div>
              </div>
            ) : (
              // Logged in - show application form
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
                    {error}
                  </div>
                )}

                {/* Profile Preview */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-white mb-3">Dein Profil</h3>
                  <div className="p-4 bg-brand-dark-card rounded-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-brand-blue/20 rounded-full flex items-center justify-center">
                        <span className="text-brand-red font-semibold">
                          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {profile?.first_name} {profile?.last_name}
                        </p>
                        <p className="text-sm text-gray-400">{profile?.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {profile?.job_title_wanted && (
                        <div>
                          <p className="text-gray-500">Gewünschter Job</p>
                          <p className="text-gray-300">{profile.job_title_wanted}</p>
                        </div>
                      )}
                      {profile?.city && (
                        <div>
                          <p className="text-gray-500">Wohnort</p>
                          <p className="text-gray-300">{profile.city}</p>
                        </div>
                      )}
                      {profile?.experience_years > 0 && (
                        <div>
                          <p className="text-gray-500">Erfahrung</p>
                          <p className="text-gray-300">{profile.experience_years} Jahre</p>
                        </div>
                      )}
                      {profile?.phone && (
                        <div>
                          <p className="text-gray-500">Telefon</p>
                          <p className="text-gray-300">{profile.phone}</p>
                        </div>
                      )}
                    </div>
                    <Link 
                      href="/dashboard/bewerber/profil"
                      className="text-brand-red text-sm hover:underline mt-4 inline-block"
                    >
                      Profil bearbeiten →
                    </Link>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="mb-6">
                  <label className="input-label">
                    Anschreiben <span className="text-gray-500">(optional)</span>
                  </label>
                  <textarea
                    className="input-field min-h-[150px]"
                    placeholder="Warum bist du der/die Richtige für diese Stelle? Erzähle etwas über dich und deine Motivation..."
                    value={coverLetter}
                    onChange={e => setCoverLetter(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Ein kurzes Anschreiben erhöht deine Chancen auf eine positive Rückmeldung.
                  </p>
                </div>

                {/* Info Box */}
                <div className="p-4 bg-brand-blue/10 border border-brand-red/30 rounded-lg mb-6">
                  <h4 className="text-white font-medium mb-2">Was passiert nach der Bewerbung?</h4>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Dein Profil wird an {job.companies?.company_name} übermittelt</li>
                    <li>• Du erhältst eine Bestätigung per E-Mail</li>
                    <li>• Der Arbeitgeber kann dich direkt kontaktieren</li>
                    <li>• Den Status siehst du in deinem Dashboard</li>
                  </ul>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Bewerbung absenden
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Mit dem Absenden stimmst du zu, dass deine Profildaten an den Arbeitgeber übermittelt werden.
                </p>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
