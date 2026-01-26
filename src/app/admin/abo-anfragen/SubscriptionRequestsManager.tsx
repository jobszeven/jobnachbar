'use client'

import { useState } from 'react'
import { Check, X, Clock, Mail, FileText, Euro, User, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface SubscriptionRequest {
  id: string
  user_id: string
  plan_name: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  invoice_number?: string
  created_at: string
  billing_address?: string
  users?: {
    id: string
    email: string
    first_name?: string
    last_name?: string
    user_type: 'jobseeker' | 'employer'
  }
}

interface Props {
  initialRequests: SubscriptionRequest[]
}

export default function SubscriptionRequestsManager({ initialRequests }: Props) {
  const [requests, setRequests] = useState(initialRequests)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const filteredRequests = requests.filter(r => {
    if (filter === 'all') return true
    return r.status === filter
  })

  const handleApprove = async (request: SubscriptionRequest) => {
    if (!confirm('Abo-Anfrage genehmigen und User freischalten?')) return

    setProcessingId(request.id)
    try {
      const response = await fetch('/api/admin/subscriptions/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      })

      if (!response.ok) {
        throw new Error('Fehler beim Genehmigen')
      }

      setRequests(prev =>
        prev.map(r => r.id === request.id ? { ...r, status: 'approved' as const } : r)
      )
      toast.success('Abo genehmigt und User freigeschaltet!')
    } catch (error) {
      toast.error('Fehler beim Genehmigen')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (request: SubscriptionRequest) => {
    if (!confirm('Abo-Anfrage ablehnen?')) return

    setProcessingId(request.id)
    try {
      const response = await fetch('/api/admin/subscriptions/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId: request.id }),
      })

      if (!response.ok) {
        throw new Error('Fehler beim Ablehnen')
      }

      setRequests(prev =>
        prev.map(r => r.id === request.id ? { ...r, status: 'rejected' as const } : r)
      )
      toast.success('Anfrage abgelehnt')
    } catch (error) {
      toast.error('Fehler beim Ablehnen')
    } finally {
      setProcessingId(null)
    }
  }

  const handleGenerateInvoice = async (request: SubscriptionRequest) => {
    toast.loading('Rechnung wird erstellt...', { id: 'invoice' })
    try {
      const response = await fetch('/api/pdf/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceNumber: request.invoice_number || `JN-${Date.now()}`,
          invoiceDate: new Date().toLocaleDateString('de-DE'),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE'),
          customer: {
            name: `${request.users?.first_name || ''} ${request.users?.last_name || ''}`.trim() || 'Kunde',
            email: request.users?.email || '',
            address: request.billing_address || 'Adresse nicht angegeben',
          },
          items: [{
            description: request.plan_name,
            quantity: 1,
            unitPrice: request.amount,
            total: request.amount,
          }],
          subtotal: request.amount,
          taxRate: 19,
          taxAmount: request.amount * 0.19,
          total: request.amount * 1.19,
          bankDetails: {
            accountHolder: 'JobNachbar GmbH',
            iban: 'DE89 3704 0044 0532 0130 00',
            bic: 'COBADEFFXXX',
            bank: 'Commerzbank',
          },
          notes: 'Bitte überweisen Sie den Betrag innerhalb von 7 Tagen.',
        }),
      })

      if (!response.ok) {
        throw new Error('Fehler bei der PDF-Erstellung')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rechnung-${request.invoice_number || request.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success('Rechnung erstellt!', { id: 'invoice' })
    } catch (error) {
      toast.error('Fehler bei der Rechnungserstellung', { id: 'invoice' })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
            <Clock className="w-3 h-3 mr-1" />
            Offen
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
            <Check className="w-3 h-3 mr-1" />
            Genehmigt
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
            <X className="w-3 h-3 mr-1" />
            Abgelehnt
          </span>
        )
      default:
        return null
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-brand-red text-white'
                : 'bg-brand-dark-card text-gray-400 hover:text-white'
            }`}
          >
            {f === 'all' ? 'Alle' : f === 'pending' ? 'Offen' : f === 'approved' ? 'Genehmigt' : 'Abgelehnt'}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="card text-center py-12">
          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Keine Anfragen</h3>
          <p className="text-gray-400">Es gibt keine Abo-Anfragen in dieser Kategorie.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div key={request.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      request.users?.user_type === 'employer'
                        ? 'bg-brand-red/20'
                        : 'bg-blue-500/20'
                    }`}>
                      {request.users?.user_type === 'employer' ? (
                        <Building2 className="w-5 h-5 text-brand-red" />
                      ) : (
                        <User className="w-5 h-5 text-blue-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {request.users?.first_name} {request.users?.last_name}
                      </h3>
                      <p className="text-gray-400 text-sm">{request.users?.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-gray-500 text-xs">Paket</p>
                      <p className="text-white font-medium">{request.plan_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Betrag</p>
                      <p className="text-white font-medium flex items-center">
                        <Euro className="w-4 h-4 mr-1 text-brand-red" />
                        {request.amount.toFixed(2)}€
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Datum</p>
                      <p className="text-gray-300">
                        {new Date(request.created_at).toLocaleDateString('de-DE')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Status</p>
                      {getStatusBadge(request.status)}
                    </div>
                  </div>

                  {request.billing_address && (
                    <div className="mt-4 p-3 bg-brand-dark rounded-lg">
                      <p className="text-gray-500 text-xs mb-1">Rechnungsadresse</p>
                      <p className="text-gray-300 text-sm whitespace-pre-line">
                        {request.billing_address}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  {request.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleApprove(request)}
                        disabled={processingId === request.id}
                        className="btn-primary text-sm px-4 py-2 disabled:opacity-50"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Genehmigen
                      </button>
                      <button
                        onClick={() => handleReject(request)}
                        disabled={processingId === request.id}
                        className="btn-secondary text-sm px-4 py-2 text-red-400 border-red-500/30 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Ablehnen
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleGenerateInvoice(request)}
                    className="btn-secondary text-sm px-4 py-2"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Rechnung
                  </button>
                  <a
                    href={`mailto:${request.users?.email}`}
                    className="btn-secondary text-sm px-4 py-2 text-center"
                  >
                    <Mail className="w-4 h-4 mr-1" />
                    E-Mail
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
