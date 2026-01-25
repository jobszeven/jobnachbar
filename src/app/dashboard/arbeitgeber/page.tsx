'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Briefcase, Users, Bell, Building2, Settings, LogOut, 
  Plus, ChevronRight, Clock, Eye, CheckCircle, XCircle,
  FileText, TrendingUp, CreditCard, Mail, Phone, Calendar
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const EMPLOYMENT_TYPES = {
  vollzeit: 'Vollzeit',
  teilzeit: 'Teilzeit',
  minijob: 'Minijob',
  ausbildung: 'Ausbildung',
  praktikum: 'Praktikum',
  werkstudent: 'Werkstudent',
}

const PLAN_LIMITS = {
  free: { jobs: 1, applications: 3 },
  basic: { jobs: 5, applications: 10 },
  premium: { jobs: Infinity, applications: Infinity },
}

function ArbeitgeberDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'
  
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [company, setCompany] = useState<any>(null)
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('uebersicht')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const supabase = createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)
    
    // Get company profile
    const { data: companyData } = await supabase
      .from('companies')
      .select('*')
      .eq('auth_id', user.id)
      .single()
    
    setCompany(companyData)
    
    if (companyData) {
      // Get jobs
      const { data: jobsData } = await supabase
        .from('jobs')
        .select('*')
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false })
      
      setJobs(jobsData || [])
      
      // Get applications for all jobs
      const { data: applicationsData } = await supabase
        .from('applications')
        .select(`
          *,
          users (
            first_name,
            last_name,
            email,
            phone,
            job_title_wanted,
            experience_years,
            city
          ),
          jobs (
            title
          )
        `)
        .eq('company_id', companyData.id)
        .order('created_at', { ascending: false })
      
      setApplications(applicationsData || [])
    }
    
    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  async function updateApplicationStatus(appId: string, status: string) {
    const supabase = createClient()
    
    await supabase
      .from('applications')
      .update({ status })
      .eq('id', appId)
    
    // Refresh applications
    setApplications(prev => 
      prev.map(app => app.id === appId ? { ...app, status } : app)
    )
  }

  const activeJobs = jobs.filter(j => j.status === 'active')
  const newApplications = applications.filter(a => a.status === 'new')
  const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0)
  
  const planLimits = PLAN_LIMITS[company?.subscription_tier as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
  const canPostMoreJobs = activeJobs.length < planLimits.jobs

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Wird geladen...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header variant="arbeitgeber" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {isWelcome && (
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-emerald/20 to-brand-blue/20 rounded-xl border border-brand-emerald/30">
            <h2 className="text-2xl font-bold text-white mb-2">
              Willkommen bei JobNachbar, {company?.company_name}! 🎉
            </h2>
            <p className="text-gray-300 mb-4">
              Ihr Firmenaccount ist jetzt aktiv. Erstellen Sie Ihre erste Stellenanzeige und erreichen Sie qualifizierte Bewerber aus der Region.
            </p>
            <Link href="/dashboard/arbeitgeber/stelle-erstellen" className="btn-primary inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Erste Stelle erstellen
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              {company?.company_name}
            </h1>
            <p className="text-gray-400 mt-1">
              {company?.subscription_tier === 'free' ? 'Starter' : 
               company?.subscription_tier === 'basic' ? 'Basic' : 'Premium'} Plan
              {company?.subscription_expires && (
                <span className="ml-2">
                  • gültig bis {new Date(company.subscription_expires).toLocaleDateString('de-DE')}
                </span>
              )}
            </p>
          </div>
          {canPostMoreJobs ? (
            <Link href="/dashboard/arbeitgeber/stelle-erstellen" className="btn-primary mt-4 md:mt-0 inline-flex items-center">
              <Plus className="w-5 h-5 mr-2" />
              Neue Stelle
            </Link>
          ) : (
            <Link href="/dashboard/arbeitgeber/abo" className="btn-secondary mt-4 md:mt-0 inline-flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Upgrade für mehr Stellen
            </Link>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Briefcase className="w-8 h-8 text-brand-emerald mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{activeJobs.length}</p>
            <p className="text-sm text-gray-400">Aktive Stellen</p>
            {planLimits.jobs !== Infinity && (
              <p className="text-xs text-gray-500 mt-1">von {planLimits.jobs} möglich</p>
            )}
          </div>
          <div className="card text-center">
            <Users className="w-8 h-8 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{applications.length}</p>
            <p className="text-sm text-gray-400">Bewerbungen</p>
          </div>
          <div className="card text-center">
            <FileText className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{newApplications.length}</p>
            <p className="text-sm text-gray-400">Neu</p>
          </div>
          <div className="card text-center">
            <Eye className="w-8 h-8 text-brand-cyan mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{totalViews}</p>
            <p className="text-sm text-gray-400">Aufrufe gesamt</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('uebersicht')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'uebersicht' 
                ? 'text-brand-emerald border-b-2 border-brand-emerald' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Übersicht
          </button>
          <button
            onClick={() => setActiveTab('stellen')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'stellen' 
                ? 'text-brand-emerald border-b-2 border-brand-emerald' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Stellenanzeigen ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('bewerbungen')}
            className={`px-4 py-3 font-medium transition-colors relative ${
              activeTab === 'bewerbungen' 
                ? 'text-brand-emerald border-b-2 border-brand-emerald' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bewerbungen ({applications.length})
            {newApplications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-emerald text-brand-navy text-xs font-bold rounded-full flex items-center justify-center">
                {newApplications.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'uebersicht' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Neue Bewerbungen</h2>
                <button 
                  onClick={() => setActiveTab('bewerbungen')}
                  className="text-brand-emerald text-sm hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              
              {newApplications.length > 0 ? (
                <div className="space-y-3">
                  {newApplications.slice(0, 5).map((app: any) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-brand-dark"
                    >
                      <div className="w-10 h-10 bg-brand-emerald/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-brand-emerald font-semibold">
                          {app.users?.first_name?.[0]}{app.users?.last_name?.[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {app.users?.first_name} {app.users?.last_name}
                        </p>
                        <p className="text-sm text-gray-400 truncate">
                          für: {app.jobs?.title}
                        </p>
                      </div>
                      <span className="badge bg-yellow-500/20 text-yellow-400">Neu</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Noch keine neuen Bewerbungen</p>
                </div>
              )}
            </div>

            {/* Active Jobs */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Aktive Stellen</h2>
                <button 
                  onClick={() => setActiveTab('stellen')}
                  className="text-brand-emerald text-sm hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              
              {activeJobs.length > 0 ? (
                <div className="space-y-3">
                  {activeJobs.slice(0, 5).map((job: any) => (
                    <Link
                      key={job.id}
                      href={`/dashboard/arbeitgeber/stellen/${job.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-brand-dark hover:bg-gray-800 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{job.title}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-400">
                          <span>{job.city}</span>
                          <span>•</span>
                          <span>{job.views || 0} Aufrufe</span>
                        </div>
                      </div>
                      {job.is_boosted && (
                        <span className="badge badge-emerald text-xs">Premium</span>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Briefcase className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Noch keine Stellen erstellt</p>
                  <Link href="/dashboard/arbeitgeber/stelle-erstellen" className="text-brand-emerald text-sm hover:underline">
                    Erste Stelle erstellen →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'stellen' && (
          <div className="space-y-4">
            {jobs.length > 0 ? (
              jobs.map((job: any) => (
                <div key={job.id} className="card">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                        {job.status === 'active' ? (
                          <span className="badge bg-brand-emerald/20 text-brand-emerald">Aktiv</span>
                        ) : job.status === 'paused' ? (
                          <span className="badge bg-yellow-500/20 text-yellow-400">Pausiert</span>
                        ) : (
                          <span className="badge bg-gray-500/20 text-gray-400">Beendet</span>
                        )}
                        {job.is_boosted && (
                          <span className="badge badge-blue">Premium</span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span>{job.city}</span>
                        <span>{EMPLOYMENT_TYPES[job.employment_type as keyof typeof EMPLOYMENT_TYPES]}</span>
                        <span>{job.views || 0} Aufrufe</span>
                        <span>
                          {applications.filter(a => a.job_id === job.id).length} Bewerbungen
                        </span>
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/arbeitgeber/stellen/${job.id}`}
                      className="btn-secondary text-sm"
                    >
                      Bearbeiten
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="card text-center py-16">
                <Briefcase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Noch keine Stellenanzeigen</h2>
                <p className="text-gray-400 mb-6">
                  Erstellen Sie Ihre erste Stellenanzeige und erreichen Sie qualifizierte Bewerber.
                </p>
                <Link href="/dashboard/arbeitgeber/stelle-erstellen" className="btn-primary">
                  <Plus className="w-5 h-5 mr-2 inline" />
                  Stelle erstellen
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bewerbungen' && (
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app: any) => (
                <div key={app.id} className="card">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="w-14 h-14 bg-brand-emerald/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-brand-emerald font-semibold text-lg">
                        {app.users?.first_name?.[0]}{app.users?.last_name?.[0]}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">
                        {app.users?.first_name} {app.users?.last_name}
                      </h3>
                      <p className="text-gray-400">
                        Bewerbung für: <span className="text-white">{app.jobs?.title}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-400">
                        {app.users?.city && (
                          <span className="flex items-center">
                            <Building2 className="w-4 h-4 mr-1" />
                            {app.users.city}
                          </span>
                        )}
                        {app.users?.experience_years > 0 && (
                          <span>{app.users.experience_years} Jahre Erfahrung</span>
                        )}
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(app.created_at).toLocaleDateString('de-DE')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {app.status === 'new' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'viewed')}
                            className="btn-secondary text-sm"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ansehen
                          </button>
                        </>
                      )}
                      {app.status === 'viewed' && (
                        <>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'accepted')}
                            className="btn-primary text-sm bg-brand-emerald hover:bg-emerald-400"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Annehmen
                          </button>
                          <button
                            onClick={() => updateApplicationStatus(app.id, 'rejected')}
                            className="btn-secondary text-sm text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Ablehnen
                          </button>
                        </>
                      )}
                      {app.status === 'accepted' && (
                        <span className="badge bg-brand-emerald/20 text-brand-emerald">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Angenommen
                        </span>
                      )}
                      {app.status === 'rejected' && (
                        <span className="badge bg-red-500/20 text-red-400">
                          <XCircle className="w-3 h-3 mr-1" />
                          Abgelehnt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Expanded Contact Info when viewed/accepted */}
                  {(app.status === 'viewed' || app.status === 'accepted') && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-sm text-gray-400 mb-2">Kontaktdaten:</p>
                      <div className="flex flex-wrap gap-4">
                        {app.users?.email && (
                          <a 
                            href={`mailto:${app.users.email}`}
                            className="flex items-center text-brand-red hover:underline"
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            {app.users.email}
                          </a>
                        )}
                        {app.users?.phone && (
                          <a 
                            href={`tel:${app.users.phone}`}
                            className="flex items-center text-brand-red hover:underline"
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            {app.users.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="card text-center py-16">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Noch keine Bewerbungen</h2>
                <p className="text-gray-400 mb-6">
                  Sobald sich jemand auf Ihre Stellen bewirbt, sehen Sie die Bewerbungen hier.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default function ArbeitgeberDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center"><div className="text-white">Lädt...</div></div>}>
      <ArbeitgeberDashboardContent />
    </Suspense>
  )
}
