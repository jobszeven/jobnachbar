'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Eye,
  CheckCircle,
  XCircle,
  Calendar,
  MessageSquare,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  Download,
  Clock,
  Star,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Application {
  id: string
  status: 'new' | 'viewed' | 'shortlisted' | 'invited' | 'rejected'
  cover_letter?: string
  resume_url?: string
  created_at: string
  updated_at: string
  jobs?: {
    id: string
    title: string
    status: string
  }
  users?: {
    id: string
    email: string
    full_name: string
    avatar_url?: string
    phone?: string
    location?: string
  }
}

interface Job {
  id: string
  title: string
}

interface ApplicationsManagementProps {
  applications: Application[]
  jobs: Job[]
  companyId: string
}

const statusConfig = {
  new: { label: 'Neu', color: 'blue' as const, icon: Clock },
  viewed: { label: 'Angesehen', color: 'gray' as const, icon: Eye },
  shortlisted: { label: 'Vorgemerkt', color: 'yellow' as const, icon: Star },
  invited: { label: 'Eingeladen', color: 'green' as const, icon: CheckCircle },
  rejected: { label: 'Abgesagt', color: 'red' as const, icon: XCircle },
}

export default function ApplicationsManagement({
  applications: initialApplications,
  jobs,
}: ApplicationsManagementProps) {
  const [applications, setApplications] = useState(initialApplications)
  const [selectedJob, setSelectedJob] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const filteredApplications = applications.filter((app) => {
    const matchesJob = selectedJob === 'all' || app.jobs?.id === selectedJob
    const matchesStatus = selectedStatus === 'all' || app.status === selectedStatus
    const matchesSearch =
      app.users?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      app.users?.email?.toLowerCase().includes(search.toLowerCase()) ||
      app.jobs?.title?.toLowerCase().includes(search.toLowerCase())
    return matchesJob && matchesStatus && matchesSearch
  })

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    setProcessingId(applicationId)
    try {
      const response = await fetch('/api/applications/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId, status: newStatus }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Fehler beim Aktualisieren')
        return
      }

      toast.success('Status aktualisiert!')
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus as Application['status'] } : app
        )
      )
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: Application['status']) => {
    const config = statusConfig[status]
    const colorClasses = {
      blue: 'bg-blue-500/20 text-blue-400',
      gray: 'bg-gray-500/20 text-gray-400',
      yellow: 'bg-yellow-500/20 text-yellow-400',
      green: 'bg-green-500/20 text-green-400',
      red: 'bg-red-500/20 text-red-400',
    }

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${colorClasses[config.color]}`}>
        <config.icon className="w-3 h-3" />
        {config.label}
      </span>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === 'new').length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    invited: applications.filter((a) => a.status === 'invited').length,
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/arbeitgeber" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Bewerbungen</h1>
              <p className="text-gray-400 text-sm">{stats.total} Bewerbungen insgesamt</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-400 text-sm">Gesamt</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Neu</p>
            <p className="text-2xl font-bold text-blue-400">{stats.new}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Vorgemerkt</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.shortlisted}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Eingeladen</p>
            <p className="text-2xl font-bold text-green-400">{stats.invited}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Name oder E-Mail..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            className="input-field"
          >
            <option value="all">Alle Stellen</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-field"
          >
            <option value="all">Alle Status</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="card text-center py-12">
              <User className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Keine Bewerbungen</h3>
              <p className="text-gray-400">
                Es sind noch keine Bewerbungen eingegangen, die den Filtern entsprechen.
              </p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={app.id} className="card">
                {/* Header */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-brand-red/20 rounded-full flex items-center justify-center flex-shrink-0">
                    {app.users?.avatar_url ? (
                      <img
                        src={app.users.avatar_url}
                        alt={app.users.full_name || 'Bewerber'}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      <User className="w-6 h-6 text-brand-red" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-1">
                      <h3 className="font-semibold text-white truncate">
                        {app.users?.full_name || 'Unbekannter Bewerber'}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>
                    <p className="text-gray-400 text-sm">
                      Bewerbung für: <span className="text-white">{app.jobs?.title}</span>
                    </p>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                      {app.users?.email && (
                        <span className="flex items-center">
                          <Mail className="w-4 h-4 mr-1" />
                          {app.users.email}
                        </span>
                      )}
                      {app.users?.phone && (
                        <span className="flex items-center">
                          <Phone className="w-4 h-4 mr-1" />
                          {app.users.phone}
                        </span>
                      )}
                      {app.users?.location && (
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {app.users.location}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(app.created_at)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    className="text-gray-400 hover:text-white"
                  >
                    {expandedId === app.id ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedId === app.id && (
                  <div className="mt-6 pt-6 border-t border-gray-700">
                    {/* Cover Letter */}
                    {app.cover_letter && (
                      <div className="mb-6">
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <MessageSquare className="w-4 h-4 mr-2 text-brand-red" />
                          Anschreiben
                        </h4>
                        <p className="text-gray-400 whitespace-pre-wrap bg-brand-dark p-4 rounded-lg">
                          {app.cover_letter}
                        </p>
                      </div>
                    )}

                    {/* Resume */}
                    {app.resume_url && (
                      <div className="mb-6">
                        <h4 className="font-medium text-white mb-2 flex items-center">
                          <FileText className="w-4 h-4 mr-2 text-brand-red" />
                          Lebenslauf
                        </h4>
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary inline-flex items-center text-sm"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Lebenslauf herunterladen
                        </a>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {app.status !== 'shortlisted' && app.status !== 'invited' && app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'shortlisted')}
                          disabled={processingId === app.id}
                          className="btn-secondary text-sm py-2"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Vormerken
                        </button>
                      )}
                      {app.status !== 'invited' && app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'invited')}
                          disabled={processingId === app.id}
                          className="btn-primary text-sm py-2"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Zum Gespräch einladen
                        </button>
                      )}
                      {app.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(app.id, 'rejected')}
                          disabled={processingId === app.id}
                          className="btn-secondary text-sm py-2 text-red-400 border-red-400/30 hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Absagen
                        </button>
                      )}
                      <a
                        href={`mailto:${app.users?.email}`}
                        className="btn-secondary text-sm py-2"
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        E-Mail schreiben
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
