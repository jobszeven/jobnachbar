import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  MapPin, Clock, Building2, ArrowLeft, 
  Calendar, Euro, CheckCircle, Send, Share2, Heart, Briefcase, Eye
} from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const INDUSTRIES: Record<string, string> = {
  handwerk: 'Handwerk',
  pflege_gesundheit: 'Pflege & Gesundheit',
  gastro_hotel: 'Gastro & Hotel',
  einzelhandel: 'Einzelhandel',
  logistik_transport: 'Logistik & Transport',
  industrie_produktion: 'Industrie & Produktion',
  buero_verwaltung: 'Büro & Verwaltung',
  it_technik: 'IT & Technik',
  bau_architektur: 'Bau & Architektur',
  landwirtschaft: 'Landwirtschaft',
  bildung_soziales: 'Bildung & Soziales',
  sonstiges: 'Sonstiges',
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  vollzeit: 'Vollzeit',
  teilzeit: 'Teilzeit',
  minijob: 'Minijob',
  ausbildung: 'Ausbildung',
  praktikum: 'Praktikum',
  werkstudent: 'Werkstudent',
}

async function getJob(id: string) {
  const supabase = await createClient()
  
  const { data: job, error } = await supabase
    .from('jobs')
    .select(`
      *,
      companies (
        id,
        company_name,
        logo_url,
        city,
        zip_code,
        website,
        about_company,
        company_size
      )
    `)
    .eq('id', id)
    .eq('status', 'active')
    .single()
  
  if (error || !job) {
    return null
  }
  
  // Increment view count
  await supabase
    .from('jobs')
    .update({ views: (job.views || 0) + 1 })
    .eq('id', id)
  
  return job
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

function formatRelativeDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Heute'
  if (diffDays === 1) return 'Gestern'
  if (diffDays < 7) return `vor ${diffDays} Tagen`
  if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`
  return formatDate(dateString)
}

export default async function JobDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const job = await getJob(params.id)
  
  if (!job) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Link */}
        <Link 
          href="/jobs"
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zur Übersicht
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="card">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  {job.companies?.logo_url ? (
                    <img 
                      src={job.companies.logo_url} 
                      alt={job.companies.company_name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Building2 className="w-10 h-10 text-gray-500" />
                  )}
                </div>

                <div className="flex-1">
                  {job.is_boosted && (
                    <span className="badge bg-brand-red/20 text-brand-red mb-2">⭐ Premium-Anzeige</span>
                  )}
                  <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                  <p className="text-lg text-gray-400">{job.companies?.company_name}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-4 text-gray-400">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-brand-red" />
                      {job.city}
                    </span>
                    <span className="flex items-center">
                      <Briefcase className="w-4 h-4 mr-1 text-brand-red" />
                      {EMPLOYMENT_TYPES[job.employment_type as keyof typeof EMPLOYMENT_TYPES] || job.employment_type}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatRelativeDate(job.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-700">
                <div>
                  <p className="text-sm text-gray-400">Branche</p>
                  <p className="text-white font-medium">
                    {INDUSTRIES[job.industry as keyof typeof INDUSTRIES] || job.industry}
                  </p>
                </div>
                {job.salary_min && (
                  <div>
                    <p className="text-sm text-gray-400">Gehalt</p>
                    <p className="text-brand-red font-medium">
                      {job.salary_min}€ - {job.salary_max}€ {job.salary_type === 'hourly' ? '/Std.' : '/Monat'}
                    </p>
                  </div>
                )}
                {job.start_date && (
                  <div>
                    <p className="text-sm text-gray-400">Startdatum</p>
                    <p className="text-white font-medium">{formatDate(job.start_date)}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-400">Aufrufe</p>
                  <p className="text-white font-medium flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {(job.views || 0) + 1}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card">
              <h2 className="text-xl font-semibold text-white mb-4">Stellenbeschreibung</h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Anforderungen</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="card">
                <h2 className="text-xl font-semibold text-white mb-4">Was wir bieten</h2>
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-wrap">{job.benefits}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-white mb-4">Jetzt bewerben</h3>
              
              <Link
                href={`/bewerben/${job.id}`}
                className="btn-primary w-full flex items-center justify-center mb-3"
              >
                <Send className="w-5 h-5 mr-2" />
                Bewerbung senden
              </Link>
              
              <div className="flex gap-2">
                <button className="btn-secondary flex-1 flex items-center justify-center text-sm">
                  <Heart className="w-4 h-4 mr-1" />
                  Merken
                </button>
                <button className="btn-secondary flex-1 flex items-center justify-center text-sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Teilen
                </button>
              </div>

              <p className="text-sm text-gray-400 mt-4 text-center">
                Kostenlos und in unter 2 Minuten
              </p>
            </div>

            {/* Company Card */}
            <div className="card">
              <h3 className="text-lg font-semibold text-white mb-4">Über das Unternehmen</h3>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                  {job.companies?.logo_url ? (
                    <img 
                      src={job.companies.logo_url} 
                      alt={job.companies.company_name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <Building2 className="w-6 h-6 text-gray-500" />
                  )}
                </div>
                <div>
                  <p className="text-white font-medium">{job.companies?.company_name}</p>
                  <p className="text-sm text-gray-400">{job.companies?.city}</p>
                </div>
              </div>

              {job.companies?.about_company && (
                <p className="text-gray-400 text-sm mb-4 line-clamp-4">
                  {job.companies.about_company}
                </p>
              )}

              {job.companies?.company_size && (
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <CheckCircle className="w-4 h-4 mr-2 text-brand-red" />
                  {job.companies.company_size} Mitarbeiter
                </div>
              )}

              {job.companies?.website && (
                <a
                  href={job.companies.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-red hover:underline text-sm"
                >
                  Website besuchen →
                </a>
              )}
            </div>

            {/* Location Hint */}
            <div className="card bg-brand-dark-lighter">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-red flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Standort</p>
                  <p className="text-gray-400 text-sm">
                    {job.zip_code} {job.city}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
