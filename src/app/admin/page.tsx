'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Users, Briefcase, FileText, Euro, TrendingUp, 
  CheckCircle, XCircle, Clock, Send, Search,
  Building, User, Eye, Mail, Phone
} from 'lucide-react'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('bewerbungen')
  const [filterStatus, setFilterStatus] = useState('all')

  const stats = {
    bewerber: 156,
    arbeitgeber: 34,
    stellen: 47,
    bewerbungen: 89,
    umsatz: 2340,
    pending: 12,
  }

  const bewerbungen = [
    {
      id: '1',
      bewerber: 'Max Mustermann',
      email: 'max@email.de',
      tel: '0152 1234567',
      branche: 'Handwerk',
      erfahrung: '5 Jahre',
      stelle: 'Kfz-Mechatroniker',
      arbeitgeber: 'Autohaus Müller',
      arbeitgeberId: 'ag1',
      datum: '24.01.2026',
      status: 'pending',
      matchScore: 87,
    },
    {
      id: '2',
      bewerber: 'Anna Schmidt',
      email: 'anna@email.de',
      tel: '0171 9876543',
      branche: 'Pflege',
      erfahrung: '3 Jahre',
      stelle: 'Pflegefachkraft',
      arbeitgeber: 'Seniorenheim Am Park',
      arbeitgeberId: 'ag2',
      datum: '23.01.2026',
      status: 'pending',
      matchScore: 92,
    },
    {
      id: '3',
      bewerber: 'Peter Klein',
      email: 'peter@email.de',
      tel: '0160 5551234',
      branche: 'Gastronomie',
      erfahrung: '8 Jahre',
      stelle: 'Koch',
      arbeitgeber: 'Restaurant Zum Anker',
      arbeitgeberId: 'ag3',
      datum: '22.01.2026',
      status: 'approved',
      matchScore: 78,
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400"><Clock className="w-3 h-3 mr-1" />Ausstehend</span>
      case 'approved':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Freigegeben</span>
      case 'rejected':
        return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400"><XCircle className="w-3 h-3 mr-1" />Abgelehnt</span>
      default:
        return null
    }
  }

  const filteredBewerbungen = filterStatus === 'all' 
    ? bewerbungen 
    : bewerbungen.filter(b => b.status === filterStatus)

  return (
    <div className="min-h-screen bg-brand-dark">
      <div className="border-b border-gray-800 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <span className="badge bg-brand-red/20 text-brand-red">JobNachbar</span>
            </div>
            <Link href="/" className="text-gray-400 hover:text-white text-sm">
              Zur Website →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="card text-center">
            <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.bewerber}</p>
            <p className="text-gray-400 text-sm">Bewerber</p>
          </div>
          <div className="card text-center">
            <Building className="w-6 h-6 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.arbeitgeber}</p>
            <p className="text-gray-400 text-sm">Arbeitgeber</p>
          </div>
          <div className="card text-center">
            <Briefcase className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.stellen}</p>
            <p className="text-gray-400 text-sm">Stellen</p>
          </div>
          <div className="card text-center">
            <FileText className="w-6 h-6 text-orange-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.bewerbungen}</p>
            <p className="text-gray-400 text-sm">Bewerbungen</p>
          </div>
          <div className="card text-center">
            <Clock className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.pending}</p>
            <p className="text-gray-400 text-sm">Ausstehend</p>
          </div>
          <div className="card text-center">
            <Euro className="w-6 h-6 text-brand-red mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{stats.umsatz}€</p>
            <p className="text-gray-400 text-sm">Umsatz/Monat</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700 pb-4 overflow-x-auto">
          {[
            { id: 'bewerbungen', label: 'Bewerbungen', icon: FileText },
            { id: 'bewerber', label: 'Bewerber', icon: Users },
            { id: 'arbeitgeber', label: 'Arbeitgeber', icon: Building },
            { id: 'stellen', label: 'Stellen', icon: Briefcase },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-brand-red text-white'
                  : 'bg-brand-dark-card text-gray-400 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bewerbungen Tab */}
        {activeTab === 'bewerbungen' && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Suche nach Name, Stelle, Arbeitgeber..." 
                  className="input-field pl-10"
                />
              </div>
              <select 
                className="input-field md:w-48"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Alle Status</option>
                <option value="pending">Ausstehend</option>
                <option value="approved">Freigegeben</option>
                <option value="rejected">Abgelehnt</option>
              </select>
            </div>

            <div className="space-y-4">
              {filteredBewerbungen.map((b) => (
                <div key={b.id} className="card hover:border-gray-600 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{b.bewerber}</h3>
                        {getStatusBadge(b.status)}
                        <span className="badge bg-brand-red/20 text-brand-red">{b.matchScore}% Match</span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-400 mb-3">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {b.email}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {b.tel}
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="w-4 h-4" />
                          {b.branche} • {b.erfahrung}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {b.datum}
                        </div>
                      </div>

                      <div className="bg-brand-dark rounded-lg p-3">
                        <p className="text-sm text-gray-400">
                          Bewirbt sich auf: <span className="text-white font-medium">{b.stelle}</span>
                        </p>
                        <p className="text-sm text-gray-400">
                          bei: <span className="text-white">{b.arbeitgeber}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row lg:flex-col gap-2">
                      {b.status === 'pending' && (
                        <>
                          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors">
                            <CheckCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Freigeben</span>
                          </button>
                          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            <XCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">Ablehnen</span>
                          </button>
                        </>
                      )}
                      <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-dark-card text-gray-300 rounded-lg hover:bg-gray-700 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                      {b.status === 'approved' && (
                        <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-brand-red/20 text-brand-red rounded-lg hover:bg-brand-red/30 transition-colors">
                          <Send className="w-4 h-4" />
                          <span className="hidden sm:inline">An AG senden</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bewerber Tab */}
        {activeTab === 'bewerber' && (
          <div className="card">
            <p className="text-gray-400 text-center py-8">
              Bewerber-Übersicht wird geladen...
            </p>
          </div>
        )}

        {/* Arbeitgeber Tab */}
        {activeTab === 'arbeitgeber' && (
          <div className="card">
            <p className="text-gray-400 text-center py-8">
              Arbeitgeber-Übersicht wird geladen...
            </p>
          </div>
        )}

        {/* Stellen Tab */}
        {activeTab === 'stellen' && (
          <div className="card">
            <p className="text-gray-400 text-center py-8">
              Stellen-Übersicht wird geladen...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
