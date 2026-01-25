'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Heart, MapPin, Clock, Euro, Briefcase, Trash2, Search } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/client'

interface Job {
  id: string
  title: string
  city: string
  employment_type: string
  salary_min?: number
  salary_max?: number
  created_at: string
  companies?: {
    company_name: string
    logo_url?: string
  }
}

const EMPLOYMENT_TYPES: Record<string, string> = {
  vollzeit: 'Vollzeit',
  teilzeit: 'Teilzeit',
  minijob: 'Minijob',
  ausbildung: 'Ausbildung',
  praktikum: 'Praktikum',
  werkstudent: 'Werkstudent',
}

export default function BewerberFavoriten() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  async function loadFavorites() {
    // Get favorites from localStorage
    const stored = localStorage.getItem('jobFavorites')
    const ids = stored ? JSON.parse(stored) : []
    setFavoriteIds(ids)

    if (ids.length === 0) {
      setLoading(false)
      return
    }

    // Fetch job details from Supabase
    const supabase = createClient()
    const { data: jobsData } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        city,
        employment_type,
        salary_min,
        salary_max,
        created_at,
        companies (
          company_name,
          logo_url
        )
      `)
      .in('id', ids)
      .eq('status', 'active')

    setJobs((jobsData as Job[]) || [])
    setLoading(false)
  }

  function removeFavorite(jobId: string) {
    const newFavorites = favoriteIds.filter(id => id !== jobId)
    setFavoriteIds(newFavorites)
    setJobs(jobs.filter(job => job.id !== jobId))
    localStorage.setItem('jobFavorites', JSON.stringify(newFavorites))
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Heute'
    if (diffDays === 1) return 'Gestern'
    if (diffDays < 7) return `vor ${diffDays} Tagen`
    if (diffDays < 30) return `vor ${Math.floor(diffDays / 7)} Wochen`
    return `vor ${Math.floor(diffDays / 30)} Monaten`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Favoriten werden geladen...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/dashboard/bewerber" className="inline-flex items-center text-gray-400 hover:text-white mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Meine Favoriten</h1>
            <p className="text-gray-400">{jobs.length} gespeicherte Stellen</p>
          </div>
          <Heart className="w-8 h-8 text-brand-red fill-brand-red" />
        </div>

        {jobs.length === 0 ? (
          <div className="card text-center py-12">
            <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Keine Favoriten</h2>
            <p className="text-gray-400 mb-6">
              Du hast noch keine Stellen gespeichert.<br />
              Klicke auf das Herz-Symbol bei einer Stellenanzeige, um sie hier zu speichern.
            </p>
            <Link href="/jobs" className="btn-primary inline-flex items-center gap-2">
              <Search className="w-5 h-5" />
              Jobs durchsuchen
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card hover:border-brand-red/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <Link href={`/jobs/${job.id}`} className="block group">
                      <h3 className="text-xl font-semibold text-white group-hover:text-brand-red transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-gray-400">{job.companies?.company_name}</p>
                    </Link>
                    
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-4 h-4" />
                        {EMPLOYMENT_TYPES[job.employment_type] || job.employment_type}
                      </span>
                      {job.salary_min && (
                        <span className="flex items-center gap-1 text-brand-red">
                          <Euro className="w-4 h-4" />
                          {job.salary_min} - {job.salary_max}€
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(job.created_at)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Link 
                      href={`/bewerben/${job.id}`}
                      className="btn-primary text-sm py-2"
                    >
                      Jetzt bewerben
                    </Link>
                    <button 
                      onClick={() => removeFavorite(job.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Aus Favoriten entfernen"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
