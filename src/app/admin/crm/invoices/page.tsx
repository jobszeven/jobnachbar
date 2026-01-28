'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  FileText,
  Search,
  Filter,
  Plus,
  Send,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Euro,
  Calendar,
  Clock,
  Mail
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Invoice {
  id: string
  invoice_number: string
  customer_name: string
  customer_email: string
  invoice_date: string
  due_date: string
  subtotal_cents: number
  tax_cents: number
  total_cents: number
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  company_id: string
  companies?: {
    id: string
    company_name: string
    email: string
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
    revenue: 0
  })

  useEffect(() => {
    loadInvoices()
  }, [statusFilter])

  async function loadInvoices() {
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)

      const res = await fetch(`/api/admin/invoices?${params}`)
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      setInvoices(data.invoices || [])

      // Calculate stats
      const allInvoices = data.invoices || []
      setStats({
        total: allInvoices.length,
        draft: allInvoices.filter((i: Invoice) => i.status === 'draft').length,
        sent: allInvoices.filter((i: Invoice) => i.status === 'sent').length,
        paid: allInvoices.filter((i: Invoice) => i.status === 'paid').length,
        overdue: allInvoices.filter((i: Invoice) => i.status === 'overdue').length,
        revenue: allInvoices
          .filter((i: Invoice) => i.status === 'paid')
          .reduce((sum: number, i: Invoice) => sum + i.total_cents, 0)
      })
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function sendInvoice(invoiceId: string) {
    try {
      const res = await fetch(`/api/admin/invoices/${invoiceId}/send`, { method: 'POST' })
      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success('Rechnung versendet')
      loadInvoices()
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
      loadInvoices()
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  async function sendReminder(invoiceId: string) {
    try {
      const res = await fetch('/api/admin/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send_payment_reminder',
          params: { invoice_id: invoiceId }
        })
      })

      const data = await res.json()

      if (data.error) throw new Error(data.error)

      toast.success(data.message)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE')
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
    invoice.customer_name.toLowerCase().includes(search.toLowerCase()) ||
    invoice.customer_email.toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Bezahlt</span>
      case 'sent':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-500 text-xs rounded-full"><Send className="w-3 h-3" />Versendet</span>
      case 'overdue':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full"><AlertTriangle className="w-3 h-3" />Überfällig</span>
      case 'cancelled':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded-full">Storniert</span>
      default:
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-500/20 text-gray-500 text-xs rounded-full"><Clock className="w-3 h-3" />Entwurf</span>
    }
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-brand-dark-card sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/crm" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Rechnungen</h1>
              <p className="text-gray-400 text-sm">Alle Rechnungen verwalten</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-400 text-sm">Gesamt</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Entwürfe</p>
            <p className="text-2xl font-bold text-gray-500">{stats.draft}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Versendet</p>
            <p className="text-2xl font-bold text-blue-500">{stats.sent}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Überfällig</p>
            <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
          </div>
          <div className="card">
            <p className="text-gray-400 text-sm">Umsatz</p>
            <p className="text-2xl font-bold text-green-500">{formatCurrency(stats.revenue)}</p>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Suche nach Rechnungsnummer, Kunde..."
              className="input-field pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field w-full sm:w-48"
          >
            <option value="all">Alle Status</option>
            <option value="draft">Entwürfe</option>
            <option value="sent">Versendet</option>
            <option value="paid">Bezahlt</option>
            <option value="overdue">Überfällig</option>
            <option value="cancelled">Storniert</option>
          </select>
          <button
            onClick={() => loadInvoices()}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Rechnung</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Kunde</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Datum</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Fällig</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Betrag</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                      Laden...
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Keine Rechnungen gefunden
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">
                        <p className="text-white font-mono">{invoice.invoice_number}</p>
                      </td>
                      <td className="p-4">
                        <Link
                          href={`/admin/crm/companies/${invoice.company_id}`}
                          className="text-white hover:text-brand-red"
                        >
                          {invoice.customer_name}
                        </Link>
                        <p className="text-gray-400 text-sm">{invoice.customer_email}</p>
                      </td>
                      <td className="p-4 text-gray-400">{formatDate(invoice.invoice_date)}</td>
                      <td className="p-4 text-gray-400">{formatDate(invoice.due_date)}</td>
                      <td className="p-4 text-white font-semibold">{formatCurrency(invoice.total_cents)}</td>
                      <td className="p-4">{getStatusBadge(invoice.status)}</td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`/api/admin/invoices/${invoice.id}/pdf`}
                            target="_blank"
                            className="btn-secondary text-xs py-1.5 px-3"
                            title="PDF anzeigen"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          {invoice.status === 'draft' && (
                            <button
                              onClick={() => sendInvoice(invoice.id)}
                              className="btn-primary text-xs py-1.5 px-3"
                            >
                              <Send className="w-4 h-4 mr-1" />
                              Senden
                            </button>
                          )}
                          {invoice.status === 'sent' && (
                            <button
                              onClick={() => markAsPaid(invoice.id)}
                              className="btn-primary text-xs py-1.5 px-3"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Bezahlt
                            </button>
                          )}
                          {invoice.status === 'overdue' && (
                            <>
                              <button
                                onClick={() => sendReminder(invoice.id)}
                                className="btn-secondary text-xs py-1.5 px-3 text-yellow-500"
                              >
                                <Mail className="w-4 h-4 mr-1" />
                                Mahnung
                              </button>
                              <button
                                onClick={() => markAsPaid(invoice.id)}
                                className="btn-primary text-xs py-1.5 px-3"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Bezahlt
                              </button>
                            </>
                          )}
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
