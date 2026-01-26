'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, CheckCircle, XCircle, Download, Mail, Crown, Search, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

interface Subscription {
  id: string
  user_id: string
  invoice_number: string
  name: string
  email: string
  address: string
  city: string
  postal_code: string
  duration_months: number
  price: number
  status: 'pending' | 'paid' | 'cancelled'
  start_date: string
  end_date: string
  created_at: string
  users?: {
    id: string
    email: string
    full_name: string
    is_premium: boolean
  }
}

interface SubscriptionManagementProps {
  subscriptions: Subscription[]
}

export default function SubscriptionManagement({ subscriptions: initialSubscriptions }: SubscriptionManagementProps) {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions)
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'cancelled'>('all')
  const [search, setSearch] = useState('')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesFilter = filter === 'all' || sub.status === filter
    const matchesSearch =
      sub.invoice_number.toLowerCase().includes(search.toLowerCase()) ||
      sub.name.toLowerCase().includes(search.toLowerCase()) ||
      sub.email.toLowerCase().includes(search.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const handleActivate = async (subscriptionId: string) => {
    setProcessingId(subscriptionId)
    try {
      const response = await fetch('/api/admin/subscriptions/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Fehler beim Aktivieren')
        return
      }

      toast.success('Premium aktiviert!')
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, status: 'paid' as const } : sub
        )
      )
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setProcessingId(null)
    }
  }

  const handleCancel = async (subscriptionId: string) => {
    if (!confirm('Bestellung wirklich stornieren?')) return

    setProcessingId(subscriptionId)
    try {
      const response = await fetch('/api/admin/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      })

      const data = await response.json()

      if (!response.ok) {
        toast.error(data.message || 'Fehler beim Stornieren')
        return
      }

      toast.success('Bestellung storniert')
      setSubscriptions((prev) =>
        prev.map((sub) =>
          sub.id === subscriptionId ? { ...sub, status: 'cancelled' as const } : sub
        )
      )
    } catch {
      toast.error('Ein Fehler ist aufgetreten')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 text-yellow-500 text-xs rounded-full">
            <Clock className="w-3 h-3" />
            Ausstehend
          </span>
        )
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 text-green-500 text-xs rounded-full">
            <CheckCircle className="w-3 h-3" />
            Bezahlt
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded-full">
            <XCircle className="w-3 h-3" />
            Storniert
          </span>
        )
      default:
        return null
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const stats = {
    pending: subscriptions.filter((s) => s.status === 'pending').length,
    paid: subscriptions.filter((s) => s.status === 'paid').length,
    revenue: subscriptions
      .filter((s) => s.status === 'paid')
      .reduce((sum, s) => sum + s.price, 0),
  }

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Abonnements verwalten</h1>
              <p className="text-gray-400 text-sm">Premium-Bestellungen und Rechnungen</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Ausstehend</p>
                <p className="text-2xl font-bold text-white">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Crown className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Aktive Premium</p>
                <p className="text-2xl font-bold text-white">{stats.paid}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-red/20 rounded-lg flex items-center justify-center">
                <span className="text-brand-red font-bold">€</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Umsatz (bezahlt)</p>
                <p className="text-2xl font-bold text-white">{formatPrice(stats.revenue)}</p>
              </div>
            </div>
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
              placeholder="Suche nach Rechnungsnummer, Name oder E-Mail..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className="input-field"
            >
              <option value="all">Alle Status</option>
              <option value="pending">Ausstehend</option>
              <option value="paid">Bezahlt</option>
              <option value="cancelled">Storniert</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-4 text-gray-400 font-medium">Rechnung</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Kunde</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Laufzeit</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Betrag</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Datum</th>
                  <th className="text-right p-4 text-gray-400 font-medium">Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubscriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      Keine Bestellungen gefunden
                    </td>
                  </tr>
                ) : (
                  filteredSubscriptions.map((sub) => (
                    <tr key={sub.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                      <td className="p-4">
                        <p className="text-white font-mono text-sm">{sub.invoice_number}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{sub.name}</p>
                        <p className="text-gray-400 text-sm">{sub.email}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white">{sub.duration_months} {sub.duration_months === 1 ? 'Monat' : 'Monate'}</p>
                      </td>
                      <td className="p-4">
                        <p className="text-white font-semibold">{formatPrice(sub.price)}</p>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(sub.status)}
                      </td>
                      <td className="p-4">
                        <p className="text-gray-400 text-sm">{formatDate(sub.created_at)}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          {sub.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleActivate(sub.id)}
                                disabled={processingId === sub.id}
                                className="btn-primary text-xs py-1.5 px-3"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Aktivieren
                              </button>
                              <button
                                onClick={() => handleCancel(sub.id)}
                                disabled={processingId === sub.id}
                                className="btn-secondary text-xs py-1.5 px-3 text-red-400 border-red-400/30 hover:bg-red-500/10"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => {
                              // TODO: Generate PDF invoice
                              toast.success('PDF-Export kommt bald!')
                            }}
                            className="btn-secondary text-xs py-1.5 px-3"
                          >
                            <Download className="w-4 h-4" />
                          </button>
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
