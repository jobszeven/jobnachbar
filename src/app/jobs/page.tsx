'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MapPin, Clock, Building2, Search, Heart, Share2, ChevronDown, Euro } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useTranslations } from 'next-intl'

const INDUSTRY_KEYS = [
  'handwerk',
  'pflege_gesundheit',
  'gastro_hotel',
  'einzelhandel',
  'logistik_transport',
  'industrie_produktion',
  'buero_verwaltung',
  'it_technik',
  'bau_architektur',
  'landwirtschaft',
  'bildung_soziales',
  'sonstiges',
]

const EMPLOYMENT_TYPE_KEYS = [
  'vollzeit',
  'teilzeit',
  'minijob',
  'ausbildung',
  'praktikum',
  'werkstudent',
]

export default function JobsPage() {
  const t = useTranslations('jobsPage')
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [showIndustryFilter, setShowIndustryFilter] = useState(false)
  const [showTypeFilter, setShowTypeFilter] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    loadJobs()
    loadFavorites()
  }, [])

  async function loadJobs() {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('jobs')
      .select(`*, companies (company_name, logo_url, city)`)
      .eq('status', 'active')
      .order('is_boosted', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100)

    if (!error && data) {
      setJobs(data)
    }
    setLoading(false)
  }

  function loadFavorites() {
    const stored = localStorage.getItem('jobFavorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
  }

  function toggleFavorite(jobId: string) {
    setFavorites(prev => {
      const newFavorites = prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId]
      localStorage.setItem('jobFavorites', JSON.stringify(newFavorites))
      return newFavorites
    })
  }

  async function shareJob(job: any) {
    if (navigator.share) {
      try {
        await navigator.share({
          title: job.title,
          text: `${job.title} bei ${job.companies?.company_name} in ${job.city}`,
          url: `${window.location.origin}/jobs/${job.id}`,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.id}`)
      alert(t('linkCopied'))
    }
  }

  const toggleIndustry = (value: string) => {
    setSelectedIndustries(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  const toggleType = (value: string) => {
    setSelectedTypes(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return t('today')
    if (diffDays === 1) return t('yesterday')
    if (diffDays < 7) return t('daysAgo', { days: diffDays })
    if (diffDays < 30) return t('weeksAgo', { weeks: Math.floor(diffDays / 7) })
    return date.toLocaleDateString('de-DE')
  }

  // Filter jobs
  let filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.companies?.company_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesIndustry = selectedIndustries.length === 0 ||
      selectedIndustries.includes(job.industry)

    const matchesType = selectedTypes.length === 0 ||
      selectedTypes.includes(job.employment_type)

    return matchesSearch && matchesIndustry && matchesType
  })

  // Sort jobs
  if (sortBy === 'oldest') {
    filteredJobs = [...filteredJobs].reverse()
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{t('title')}</h1>
        <p className="text-gray-400 mb-8">{t('subtitle')}</p>

        {/* Search & Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative">
            {!searchQuery && (
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            )}
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className={`input-field w-full ${!searchQuery ? 'pl-12' : ''}`}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3">
            {/* Industry Filter */}
            <div className="relative">
              <button
                onClick={() => { setShowIndustryFilter(!showIndustryFilter); setShowTypeFilter(false) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedIndustries.length > 0
                    ? 'bg-brand-red/20 border-brand-red text-brand-red'
                    : 'bg-brand-dark-card border-gray-600 text-gray-300'
                }`}
              >
                {selectedIndustries.length > 0 ? `${selectedIndustries.length} ${t('industries')}` : t('allIndustries')}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showIndustryFilter && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-brand-dark-card border border-gray-700 rounded-lg shadow-xl z-50 p-4">
                  <p className="text-sm text-gray-400 mb-3">{t('selectIndustries')}</p>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {INDUSTRY_KEYS.map(key => (
                      <button
                        key={key}
                        onClick={() => toggleIndustry(key)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedIndustries.includes(key)
                            ? 'bg-brand-red text-white'
                            : 'bg-brand-dark border border-gray-600 text-gray-300'
                        }`}
                      >
                        {t(`industries_list.${key}`)}
                      </button>
                    ))}
                  </div>
                  {selectedIndustries.length > 0 && (
                    <button
                      onClick={() => setSelectedIndustries([])}
                      className="mt-3 text-sm text-gray-400 hover:text-white"
                    >
                      {t('resetAll')}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Employment Type Filter */}
            <div className="relative">
              <button
                onClick={() => { setShowTypeFilter(!showTypeFilter); setShowIndustryFilter(false) }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedTypes.length > 0
                    ? 'bg-brand-red/20 border-brand-red text-brand-red'
                    : 'bg-brand-dark-card border-gray-600 text-gray-300'
                }`}
              >
                {selectedTypes.length > 0 ? `${selectedTypes.length} ${t('types')}` : t('allTypes')}
                <ChevronDown className="w-4 h-4" />
              </button>

              {showTypeFilter && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-brand-dark-card border border-gray-700 rounded-lg shadow-xl z-50 p-4">
                  <p className="text-sm text-gray-400 mb-3">{t('selectTypes')}</p>
                  <div className="flex flex-wrap gap-2">
                    {EMPLOYMENT_TYPE_KEYS.map(key => (
                      <button
                        key={key}
                        onClick={() => toggleType(key)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedTypes.includes(key)
                            ? 'bg-brand-red text-white'
                            : 'bg-brand-dark border border-gray-600 text-gray-300'
                        }`}
                      >
                        {t(`employment_types.${key}`)}
                      </button>
                    ))}
                  </div>
                  {selectedTypes.length > 0 && (
                    <button
                      onClick={() => setSelectedTypes([])}
                      className="mt-3 text-sm text-gray-400 hover:text-white"
                    >
                      {t('resetAll')}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-gray-400">
            <span className="text-white font-semibold">{filteredJobs.length}</span> {filteredJobs.length === 1 ? t('jobFound') : t('jobsFound')}
          </p>
          <select
            className="input-field w-auto"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="oldest">{t('sortOldest')}</option>
          </select>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">{t('loading')}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="card text-center py-12">
            <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">{t('noJobsFound')}</h2>
            <p className="text-gray-400 mb-6">{t('noJobsHint')}</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedIndustries([]); setSelectedTypes([]) }}
              className="btn-secondary"
            >
              {t('resetFilters')}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job: any) => (
              <div key={job.id} className="card hover:border-brand-red/50 transition-colors group">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Logo placeholder */}
                  <div className="w-16 h-16 bg-brand-dark rounded-lg flex items-center justify-center flex-shrink-0">
                    {job.companies?.logo_url ? (
                      <img src={job.companies.logo_url} alt="" className="w-12 h-12 object-contain" />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <Link href={`/jobs/${job.id}`}>
                          <h2 className="text-xl font-semibold text-white group-hover:text-brand-red transition-colors">
                            {job.title}
                          </h2>
                        </Link>
                        <p className="text-gray-400">{job.companies?.company_name}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFavorite(job.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            favorites.includes(job.id)
                              ? 'text-brand-red bg-brand-red/20'
                              : 'text-gray-400 hover:text-brand-red hover:bg-brand-red/10'
                          }`}
                          title="Als Favorit speichern"
                        >
                          <Heart className={`w-5 h-5 ${favorites.includes(job.id) ? 'fill-current' : ''}`} />
                        </button>
                        <button
                          onClick={() => shareJob(job)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="Teilen"
                        >
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3 text-sm text-gray-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {t(`employment_types.${job.employment_type}`) || job.employment_type}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(job.created_at)}
                      </span>
                      {job.salary_min && job.salary_max && (
                        <span className="flex items-center gap-1 text-brand-red">
                          <Euro className="w-4 h-4" />
                          {job.salary_min} - {job.salary_max}€
                        </span>
                      )}
                    </div>

                    {/* CTA */}
                    <div className="mt-4">
                      <Link
                        href={`/jobs/${job.id}`}
                        className="inline-flex items-center text-brand-red hover:underline text-sm font-medium"
                      >
                        {t('viewDetails')} →
                      </Link>
                    </div>
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
