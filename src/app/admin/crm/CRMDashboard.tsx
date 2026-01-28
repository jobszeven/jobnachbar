'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Users,
  Crown,
  Search,
  Filter,
  Plus,
  Mail,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Zap,
  RefreshCw,
  ChevronRight,
  Euro,
  Calendar,
  MoreVertical
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Company {
  id: string
  company_name: string
  contact_person: string
  email: string
  phone: string
  city: string
  subscription_tier: 'free' | 'basic' | 'premium'
  created_at: string
  subscriptions?: any[]
  jobs?: any[]
}

interface Stats {
  total: number
  free: number
  basic: number
  premium: number
}

export default function CRMDashboard() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, free: 0, basic: 0, premium: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tierFilter, setTierFilter] = useState('all')
  const [workflowRunning, setWorkflowRunning] = useState<string | null>(null)

  useEffect(() => {
    loadCompanies()
  }, [search, tierFilter])

  async function loadCompanies() {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (tierFilter !== 'all') params.append('tier', tierFilter)

      const res = await fetch(`/api/admin/companies?${params}`)
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setCompanies(data.companies || [])
      setStats(data.stats || { total: 0, free: 0, basic: 0, premium: 0 })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function runWorkflow(action: string, params?: any) {
    setWorkflowRunning(action)
    try {
      const res = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, params })
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success(data.message)
      loadCompanies()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setWorkflowRunning(null)
    }
  }

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'premium':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
            <Crown className="w-3 h-3" />
            Premium
          </span>
        )
      case 'basic':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full">
            Basic
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded-full">
            Free
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-brand-dark-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">CRM Dashboard</h1>
              <p className="text-gray-400 text-sm">Kundenbeziehungsmanagement</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => runWorkflow('check_overdue_invoices')}
              disabled={workflowRunning !== null}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <AlertTriangle className="w-4 h-4" />
              Überfällige prüfen
            </button>
            <button
              onClick={() => runWorkflow('send_bulk_reminders')}
              disabled={workflowRunning !== null}
              className="btn-secondary text-sm flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              Mahnungen senden
            </button>
            <button
              onClick={() => runWorkflow('send_expiry_warnings')}
              disabled={workflowRunning !== null}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Ablauf-Warnungen
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Gesamt</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Free</p>
                <p className="text-2xl font-bold text-white">{stats.free}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Basic</p>
                <p className="text-2xl font-bold text-white">{stats.basic}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Premium</p>
                <p className="text-2xl font-bold text-white">{stats.premium}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/admin/crm/invoices" className="card hover:border-brand-red/50 transition-colors group">
            <FileText className="w-8 h-8 text-brand-red mb-2" />
            <h3 className="font-medium text-white group-hover:text-brand-red">Rechnungen</h3>
            <p className="text-gray-500 text-sm">Alle Rechnungen verwalten</p>
          </Link>
          <Link href="/admin/subscriptions" className="card hover:border-brand-red/50 transition-colors group">
            <Crown className="w-8 h-8 text-yellow-500 mb-2" />
            <h3 className="font-medium text-white group-hover:text-brand-red">Abonnements</h3>
            <p className="text-gray-500 text-sm">Premium verwalten</p>
          </Link>
          <Link href="/admin/abo-anfragen" className="card hover:border-brand-red/50 transition-colors group">
            <Clock className="w-8 h-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-white group-hover:text-brand-red">Abo-Anfragen</h3>
            <p className="text-gray-500 text-sm">Neue Anfragen</p>
          </Link>
          <Link href="/admin/crm/emails" className="card hover:border-brand-red/50 transition-colors group">
            <Mail className="w-8 h-8 text-green-500 mb-2" />
            <h3 className="font-medium text-white group-hover:text-brand-red">E-Mails</h3>
            <p className="text-gray-500 text-sm">Versendete E-Mails</p>
          </Link>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Unternehmen, Kontakt oder E-Mail..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="input-field w-full sm:w-48"
          >
            <option value="all">Alle Stufen</option>
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
          <button
            onClick={() => loadCompanies()}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Aktualisieren
          </button>
        </div>

        {/* Companies Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Unternehmen</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Kontakt</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Jobs</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Registriert</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Laden...
                    </td>
                  </tr>
                ) : companies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Keine Unternehmen gefunden
                    </td>
                  </tr>
                ) : (
                  companies.map((company) => (
                    <tr key={company.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-dark rounded-lg flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{company.company_name}</p>
                            <p className="text-gray-500 text-sm">{company.city}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{company.contact_person}</p>
                        <p className="text-gray-400 text-sm">{company.email}</p>
                      </td>
                      <td className="p-4">
                        {getTierBadge(company.subscription_tier)}
                      </td>
                      <td className="p-4">
                        <span className="text-white">
                          {company.jobs?.filter(j => j.status === 'active').length || 0} aktiv
                        </span>
                        <span className="text-gray-500 text-sm ml-1">
                          / {company.jobs?.length || 0} gesamt
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="text-gray-400 text-sm">
                          {new Date(company.created_at).toLocaleDateString('de-DE')}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/crm/companies/${company.id}`}
                            className="btn-secondary text-xs py-1.5 px-3"
                          >
                            Details
                            <ChevronRight className="w-4 h-4 ml-1" />
                          </Link>
                          <div className="relative group">
                            <button className="p-2 hover:bg-gray-700 rounded-lg">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                            <div className="absolute right-0 top-full mt-1 w-48 bg-brand-dark-card border border-gray-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                              <button
                                onClick={() => runWorkflow('create_subscription_invoice', {
                                  company_id: company.id,
                                  tier: 'premium',
                                  months: 1
                                })}
                                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-white flex items-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                Rechnung erstellen
                              </button>
                              <button
                                onClick={() => {
                                  toast.success('E-Mail Funktion kommt bald!')
                                }}
                                className="w-full text-left px-4 py-2 hover:bg-gray-700 text-sm text-white flex items-center gap-2"
                              >
                                <Mail className="w-4 h-4" />
                                E-Mail senden
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
