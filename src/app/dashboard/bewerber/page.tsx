'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  Briefcase, MapPin, Bell, User, Settings, LogOut, 
  ChevronRight, Clock, CheckCircle, XCircle, Eye,
  FileText, Zap, TrendingUp, Heart
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { OnboardingModal } from '@/components/onboarding'

const EMPLOYMENT_TYPES = {
  vollzeit: 'Vollzeit',
  teilzeit: 'Teilzeit',
  minijob: 'Minijob',
  ausbildung: 'Ausbildung',
  praktikum: 'Praktikum',
  werkstudent: 'Werkstudent',
}

function BewerberDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isWelcome = searchParams.get('welcome') === 'true'
  
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [applications, setApplications] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('uebersicht')
  const [showOnboarding, setShowOnboarding] = useState(false)

  useEffect(() => {
    // Show onboarding if first visit or welcome param
    const hasSeenOnboarding = localStorage.getItem('jobnachbar_onboarding_bewerber')
    if (!hasSeenOnboarding || isWelcome) {
      setShowOnboarding(true)
    }
  }, [isWelcome])

  const handleOnboardingComplete = () => {
    localStorage.setItem('jobnachbar_onboarding_bewerber', 'true')
    setShowOnboarding(false)
  }

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
    
    // Get profile
    const { data: profileData } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()
    
    setProfile(profileData)
    
    // Get applications
    const { data: applicationsData } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          city,
          employment_type,
          companies (
            company_name,
            logo_url
          )
        )
      `)
      .eq('user_id', profileData?.id)
      .order('created_at', { ascending: false })
    
    setApplications(applicationsData || [])
    
    // Get matches
    const { data: matchesData } = await supabase
      .from('matches')
      .select(`
        *,
        jobs (
          id,
          title,
          city,
          employment_type,
          salary_min,
          salary_max,
          companies (
            company_name,
            logo_url
          )
        )
      `)
      .eq('user_id', profileData?.id)
      .gte('match_score', 50)
      .order('match_score', { ascending: false })
      .limit(10)
    
    setMatches(matchesData || [])
    
    setLoading(false)
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
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

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header variant="bewerber" />
      <OnboardingModal
        userType="jobseeker"
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        {isWelcome && (
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-blue/20 to-brand-emerald/20 rounded-xl border border-brand-red/30">
            <h2 className="text-2xl font-bold text-white mb-2">
              Willkommen bei JobNachbar, {profile?.first_name}! 🎉
            </h2>
            <p className="text-gray-300">
              Dein Profil ist jetzt aktiv. Wir suchen bereits nach passenden Jobs für dich und benachrichtigen dich, sobald wir etwas finden.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Hallo, {profile?.first_name}!
            </h1>
            <p className="text-gray-400 mt-1">
              Hier siehst du deine Job-Matches und Bewerbungen
            </p>
          </div>
          <Link href="/jobs" className="btn-primary mt-4 md:mt-0">
            Jobs durchsuchen
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Zap className="w-8 h-8 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{matches.length}</p>
            <p className="text-sm text-gray-400">Job-Matches</p>
          </div>
          <div className="card text-center">
            <FileText className="w-8 h-8 text-brand-emerald mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{applications.length}</p>
            <p className="text-sm text-gray-400">Bewerbungen</p>
          </div>
          <div className="card text-center">
            <Eye className="w-8 h-8 text-brand-cyan mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">
              {applications.filter(a => a.status === 'viewed').length}
            </p>
            <p className="text-sm text-gray-400">Angesehen</p>
          </div>
          <div className="card text-center">
            <TrendingUp className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{profile?.radius_km || 30}km</p>
            <p className="text-sm text-gray-400">Suchradius</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b border-gray-800 mb-6">
          <button
            onClick={() => setActiveTab('uebersicht')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'uebersicht' 
                ? 'text-brand-red border-b-2 border-brand-red' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Übersicht
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'matches' 
                ? 'text-brand-red border-b-2 border-brand-red' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Job-Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('bewerbungen')}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === 'bewerbungen' 
                ? 'text-brand-red border-b-2 border-brand-red' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Bewerbungen ({applications.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'uebersicht' && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Recent Matches */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Neueste Matches</h2>
                <button 
                  onClick={() => setActiveTab('matches')}
                  className="text-brand-red text-sm hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              
              {matches.length > 0 ? (
                <div className="space-y-3">
                  {matches.slice(0, 3).map((match: any) => (
                    <Link
                      key={match.id}
                      href={`/jobs/${match.jobs.id}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-brand-dark hover:bg-gray-800 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{match.jobs.title}</p>
                        <p className="text-sm text-gray-400">{match.jobs.companies?.company_name}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="badge badge-blue">{match.match_score}%</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Zap className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Noch keine Matches</p>
                  <p className="text-sm">Wir suchen passende Jobs für dich</p>
                </div>
              )}
            </div>

            {/* Recent Applications */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Meine Bewerbungen</h2>
                <button 
                  onClick={() => setActiveTab('bewerbungen')}
                  className="text-brand-red text-sm hover:underline"
                >
                  Alle anzeigen
                </button>
              </div>
              
              {applications.length > 0 ? (
                <div className="space-y-3">
                  {applications.slice(0, 3).map((app: any) => (
                    <div
                      key={app.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-brand-dark"
                    >
                      <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Briefcase className="w-5 h-5 text-gray-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{app.jobs?.title}</p>
                        <p className="text-sm text-gray-400">{app.jobs?.companies?.company_name}</p>
                      </div>
                      <div className="flex-shrink-0">
                        {app.status === 'new' && (
                          <span className="badge bg-yellow-500/20 text-yellow-400">Gesendet</span>
                        )}
                        {app.status === 'viewed' && (
                          <span className="badge bg-brand-red/20 text-brand-red">Angesehen</span>
                        )}
                        {app.status === 'accepted' && (
                          <span className="badge bg-brand-emerald/20 text-brand-emerald">Angenommen</span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="badge bg-red-500/20 text-red-400">Abgelehnt</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Noch keine Bewerbungen</p>
                  <Link href="/jobs" className="text-brand-red text-sm hover:underline">
                    Jobs durchsuchen →
                  </Link>
                </div>
              )}
            </div>

            {/* Profile Completeness */}
            <div className="card md:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Dein Profil</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-brand-emerald" />
                  <span className="text-gray-300">E-Mail verifiziert</span>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.job_title_wanted ? (
                    <CheckCircle className="w-5 h-5 text-brand-emerald" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-gray-300">Wunschjob angegeben</span>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.industries?.length > 0 ? (
                    <CheckCircle className="w-5 h-5 text-brand-emerald" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-gray-300">Branchen ausgewählt</span>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.about_me ? (
                    <CheckCircle className="w-5 h-5 text-brand-emerald" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-gray-300">Über mich ausgefüllt</span>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.phone ? (
                    <CheckCircle className="w-5 h-5 text-brand-emerald" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-gray-300">Telefonnummer hinterlegt</span>
                </div>
                <div className="flex items-center gap-3">
                  {profile?.cv_url ? (
                    <CheckCircle className="w-5 h-5 text-brand-emerald" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-500" />
                  )}
                  <span className="text-gray-300">Lebenslauf hochgeladen</span>
                </div>
              </div>
              <Link 
                href="/dashboard/bewerber/profil"
                className="btn-secondary mt-4 inline-flex items-center"
              >
                Profil bearbeiten
                <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-4">
            {matches.length > 0 ? (
              matches.map((match: any) => (
                <Link
                  key={match.id}
                  href={`/jobs/${match.jobs.id}`}
                  className="card block hover:border-brand-red transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-7 h-7 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{match.jobs.title}</h3>
                      <p className="text-gray-400">{match.jobs.companies?.company_name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {match.jobs.city}
                        </span>
                        <span>
                          {EMPLOYMENT_TYPES[match.jobs.employment_type as keyof typeof EMPLOYMENT_TYPES]}
                        </span>
                        {match.jobs.salary_min && (
                          <span className="text-brand-emerald">
                            {match.jobs.salary_min}€ - {match.jobs.salary_max}€
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-brand-red">{match.match_score}%</div>
                      <div className="text-xs text-gray-400">Match</div>
                    </div>
                    <ChevronRight className="w-6 h-6 text-gray-500" />
                  </div>
                </Link>
              ))
            ) : (
              <div className="card text-center py-16">
                <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Noch keine Matches</h2>
                <p className="text-gray-400 mb-6">
                  Sobald neue Jobs veröffentlicht werden, die zu dir passen, siehst du sie hier.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'bewerbungen' && (
          <div className="space-y-4">
            {applications.length > 0 ? (
              applications.map((app: any) => (
                <div key={app.id} className="card">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-7 h-7 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{app.jobs?.title}</h3>
                      <p className="text-gray-400">{app.jobs?.companies?.company_name}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {new Date(app.created_at).toLocaleDateString('de-DE')}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {app.jobs?.city}
                        </span>
                      </div>
                    </div>
                    <div>
                      {app.status === 'new' && (
                        <span className="badge bg-yellow-500/20 text-yellow-400">
                          <Clock className="w-3 h-3 mr-1" />
                          Gesendet
                        </span>
                      )}
                      {app.status === 'viewed' && (
                        <span className="badge bg-brand-red/20 text-brand-red">
                          <Eye className="w-3 h-3 mr-1" />
                          Angesehen
                        </span>
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
                </div>
              ))
            ) : (
              <div className="card text-center py-16">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-white mb-2">Noch keine Bewerbungen</h2>
                <p className="text-gray-400 mb-6">
                  Finde passende Jobs und bewirb dich mit einem Klick.
                </p>
                <Link href="/jobs" className="btn-primary">
                  Jobs durchsuchen
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default function BewerberDashboard() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-dark flex items-center justify-center"><div className="text-white">Lädt...</div></div>}>
      <BewerberDashboardContent />
    </Suspense>
  )
}
