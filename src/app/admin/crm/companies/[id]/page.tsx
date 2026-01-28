'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Crown,
  FileText,
  Briefcase,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  Send,
  Euro,
  Calendar,
  MessageSquare,
  Pin,
  MoreVertical,
  Edit,
  Trash2
} from 'lucide-react'
import toast from 'react-hot-toast'

interface CompanyData {
  company: any
  subscriptions: any[]
  invoices: any[]
  jobs: any[]
  activities: any[]
  notes: any[]
  emails: any[]
  stats: {
    totalJobs: number
    activeJobs: number
    totalInvoices: number
    paidInvoices: number
    openInvoices: number
    totalRevenue: number
  }
}

export default function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [data, setData] = useState<CompanyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'jobs' | 'activity'>('overview')
  const [newNote, setNewNote] = useState('')
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)

  useEffect(() => {
    loadCompany()
  }, [id])

  async function loadCompany() {
    try {
      const res = await fetch(`/api/admin/companies/${id}`)
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setData(data)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function addNote() {
    if (!newNote.trim()) return

    try {
      const res = await fetch(`/api/admin/companies/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success('Notiz hinzugefügt')
      setNewNote('')
      loadCompany()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function createQuickInvoice(tier: 'basic' | 'premium', months: number) {
    try {
      const res = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_subscription_invoice',
          params: { company_id: id, tier, months }
        })
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success(data.message)
      setShowInvoiceModal(false)
      loadCompany()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function sendInvoice(invoiceId: string) {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}/send`, { method: 'POST' })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success('Rechnung versendet')
      loadCompany()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function markAsPaid(invoiceId: string) {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}/mark-paid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_method: 'bank_transfer' })
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success('Zahlung erfasst')
      loadCompany()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-red"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <p className="text-gray-400">Unternehmen nicht gefunden</p>
      </div>
    )
  }

  const { company, subscriptions, invoices, jobs, activities, notes, stats } = data

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-brand-dark-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin/crm" className="text-gray-400 hover:text-white">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-brand-dark rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-brand-red" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">{company.company_name}</h1>
                  <p className="text-gray-400 text-sm">{company.contact_person}</p>
                </div>
              </div>
              <span className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                company.subscription_tier === 'premium' ? 'bg-yellow-500/20 text-yellow-500' :
                company.subscription_tier === 'basic' ? 'bg-blue-500/20 text-blue-500' :
                'bg-gray-500/20 text-gray-500'
              }`}>
                {company.subscription_tier === 'premium' && <Crown className="w-4 h-4 inline mr-1" />}
                {company.subscription_tier.charAt(0).toUpperCase() + company.subscription_tier.slice(1)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="btn-secondary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Rechnung erstellen
              </button>
              <button className="btn-primary flex items-center gap-2">
                <Mail className="w-4 h-4" />
                E-Mail senden
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mt-6">
            {['overview', 'invoices', 'jobs', 'activity'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`pb-3 px-1 border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-brand-red text-white'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab === 'overview' && 'Übersicht'}
                {tab === 'invoices' && `Rechnungen (${invoices.length})`}
                {tab === 'jobs' && `Jobs (${jobs.length})`}
                {tab === 'activity' && 'Aktivität'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Main Info */}
            <div className="md:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="card">
                  <p className="text-gray-400 text-sm">Umsatz</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalRevenue)}</p>
                </div>
                <div className="card">
                  <p className="text-gray-400 text-sm">Offene Rechnungen</p>
                  <p className="text-2xl font-bold text-yellow-500">{stats.openInvoices}</p>
                </div>
                <div className="card">
                  <p className="text-gray-400 text-sm">Aktive Jobs</p>
                  <p className="text-2xl font-bold text-green-500">{stats.activeJobs}</p>
                </div>
                <div className="card">
                  <p className="text-gray-400 text-sm">Gesamt Jobs</p>
                  <p className="text-2xl font-bold text-white">{stats.totalJobs}</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Kontaktdaten</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">E-Mail</p>
                      <a href={`mailto:${company.email}`} className="text-white hover:text-brand-red">
                        {company.email}
                      </a>
                    </div>
                  </div>
                  {company.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Telefon</p>
                        <a href={`tel:${company.phone}`} className="text-white hover:text-brand-red">
                          {company.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-gray-400 text-sm">Adresse</p>
                      <p className="text-white">
                        {company.street && `${company.street}, `}
                        {company.zip_code} {company.city}
                      </p>
                    </div>
                  </div>
                  {company.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-gray-400 text-sm">Website</p>
                        <a href={company.website} target="_blank" className="text-white hover:text-brand-red">
                          {company.website}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Invoices */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-white">Letzte Rechnungen</h3>
                  <button
                    onClick={() => setActiveTab('invoices')}
                    className="text-brand-red text-sm hover:underline"
                  >
                    Alle anzeigen
                  </button>
                </div>
                {invoices.length === 0 ? (
                  <p className="text-gray-500">Keine Rechnungen vorhanden</p>
                ) : (
                  <div className="space-y-3">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-3 bg-brand-dark rounded-lg">
                        <div>
                          <p className="text-white font-mono">{invoice.invoice_number}</p>
                          <p className="text-gray-400 text-sm">{formatDate(invoice.invoice_date)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-semibold">{formatCurrency(invoice.total_cents)}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            invoice.status === 'paid' ? 'bg-green-500/20 text-green-500' :
                            invoice.status === 'sent' ? 'bg-blue-500/20 text-blue-500' :
                            invoice.status === 'overdue' ? 'bg-red-500/20 text-red-500' :
                            'bg-gray-500/20 text-gray-500'
                          }`}>
                            {invoice.status === 'paid' ? 'Bezahlt' :
                             invoice.status === 'sent' ? 'Versendet' :
                             invoice.status === 'overdue' ? 'Überfällig' :
                             'Entwurf'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Notes */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Notizen
                </h3>
                <div className="mb-4">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Neue Notiz..."
                    className="input-field text-sm h-20 resize-none"
                  />
                  <button
                    onClick={addNote}
                    disabled={!newNote.trim()}
                    className="btn-primary text-sm w-full mt-2"
                  >
                    Notiz hinzufügen
                  </button>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={`p-3 rounded-lg ${note.is_pinned ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-brand-dark'}`}
                    >
                      {note.is_pinned && (
                        <Pin className="w-4 h-4 text-yellow-500 mb-1" />
                      )}
                      <p className="text-white text-sm">{note.content}</p>
                      <p className="text-gray-500 text-xs mt-2">
                        {note.author} - {formatDateTime(note.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="card">
                <h3 className="font-semibold text-white mb-4">Schnellaktionen</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setShowInvoiceModal(true)}
                    className="w-full btn-secondary text-left flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Neue Rechnung
                  </button>
                  <button
                    className="w-full btn-secondary text-left flex items-center gap-2"
                  >
                    <Crown className="w-4 h-4 text-yellow-500" />
                    Premium aktivieren
                  </button>
                  <button
                    className="w-full btn-secondary text-left flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Willkommens-E-Mail
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white">Alle Rechnungen</h3>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="btn-primary text-sm flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Neue Rechnung
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3 text-gray-400 font-medium">Nummer</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Datum</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Fällig</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Betrag</th>
                  <th className="text-left p-3 text-gray-400 font-medium">Status</th>
                  <th className="text-right p-3 text-gray-400 font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-gray-800">
                    <td className="p-3 text-white font-mono">{invoice.invoice_number}</td>
                    <td className="p-3 text-gray-400">{formatDate(invoice.invoice_date)}</td>
                    <td className="p-3 text-gray-400">{formatDate(invoice.due_date)}</td>
                    <td className="p-3 text-white font-semibold">{formatCurrency(invoice.total_cents)}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-500/20 text-green-500' :
                        invoice.status === 'sent' ? 'bg-blue-500/20 text-blue-500' :
                        invoice.status === 'overdue' ? 'bg-red-500/20 text-red-500' :
                        'bg-gray-500/20 text-gray-500'
                      }`}>
                        {invoice.status === 'paid' ? 'Bezahlt' :
                         invoice.status === 'sent' ? 'Versendet' :
                         invoice.status === 'overdue' ? 'Überfällig' :
                         'Entwurf'}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/api/admin/invoices/${invoice.id}/pdf`}
                          target="_blank"
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          PDF
                        </a>
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => sendInvoice(invoice.id)}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            <Send className="w-3 h-3 mr-1" />
                            Senden
                          </button>
                        )}
                        {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                          <button
                            onClick={() => markAsPaid(invoice.id)}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Bezahlt
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="card">
            <h3 className="font-semibold text-white mb-6">Stellenanzeigen</h3>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 bg-brand-dark rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{job.title}</h4>
                    <p className="text-gray-400 text-sm">{job.city} - {job.employment_type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      job.status === 'active' ? 'bg-green-500/20 text-green-500' :
                      'bg-gray-500/20 text-gray-500'
                    }`}>
                      {job.status === 'active' ? 'Aktiv' : job.status}
                    </span>
                    <span className="text-gray-400 text-sm">{formatDate(job.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="card">
            <h3 className="font-semibold text-white mb-6">Aktivitäts-Timeline</h3>
            <div className="space-y-4">
              {activities.map((activity) => (
                <div key={activity.id} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    activity.activity_type === 'payment_received' ? 'bg-green-500/20' :
                    activity.activity_type === 'invoice_created' ? 'bg-blue-500/20' :
                    activity.activity_type === 'email_sent' ? 'bg-purple-500/20' :
                    'bg-gray-500/20'
                  }`}>
                    {activity.activity_type === 'payment_received' && <Euro className="w-5 h-5 text-green-500" />}
                    {activity.activity_type === 'invoice_created' && <FileText className="w-5 h-5 text-blue-500" />}
                    {activity.activity_type === 'email_sent' && <Mail className="w-5 h-5 text-purple-500" />}
                    {activity.activity_type === 'note_added' && <MessageSquare className="w-5 h-5 text-gray-500" />}
                    {!['payment_received', 'invoice_created', 'email_sent', 'note_added'].includes(activity.activity_type) &&
                      <Clock className="w-5 h-5 text-gray-500" />
                    }
                  </div>
                  <div className="flex-1 pb-4 border-b border-gray-800">
                    <p className="text-white">{activity.title}</p>
                    <p className="text-gray-400 text-sm">{activity.description}</p>
                    <p className="text-gray-500 text-xs mt-1">
                      {activity.performed_by} - {formatDateTime(activity.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Invoice Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-brand-dark-card rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">Schnell-Rechnung erstellen</h3>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-2 block">Basic Abo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 6].map((months) => (
                    <button
                      key={months}
                      onClick={() => createQuickInvoice('basic', months)}
                      className="btn-secondary text-sm"
                    >
                      {months} {months === 1 ? 'Monat' : 'Monate'}
                      <span className="block text-xs text-gray-500">
                        {(49 * months).toFixed(0)}€
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-2 block">Premium Abo</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 3, 6].map((months) => (
                    <button
                      key={months}
                      onClick={() => createQuickInvoice('premium', months)}
                      className="btn-primary text-sm"
                    >
                      {months} {months === 1 ? 'Monat' : 'Monate'}
                      <span className="block text-xs opacity-80">
                        {(99 * months).toFixed(0)}€
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="btn-secondary flex-1"
              >
                Abbrechen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
