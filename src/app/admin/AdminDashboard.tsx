'use client'

import Link from 'next/link'
import {
  Users,
  Briefcase,
  Building2,
  FileText,
  Crown,
  MessageSquare,
  Bell,
  Settings,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface Stats {
  users: {
    total: number
    jobseekers: number
    employers: number
    premium: number
  }
  jobs: {
    total: number
    active: number
  }
  companies: number
  applications: number
  pendingSubscriptions: number
  unreadFeedback: number
  charts: {
    recentUsers: Array<{ created_at: string; user_type: string }>
    recentJobs: Array<{ created_at: string }>
  }
}

interface AdminDashboardProps {
  stats: Stats
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  // Process chart data
  const processChartData = () => {
    const days: Record<string, { date: string; users: number; jobs: number }> = {}

    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const key = date.toISOString().split('T')[0]
      days[key] = {
        date: date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit' }),
        users: 0,
        jobs: 0,
      }
    }

    // Count users per day
    stats.charts.recentUsers.forEach((user) => {
      const key = user.created_at.split('T')[0]
      if (days[key]) {
        days[key].users++
      }
    })

    // Count jobs per day
    stats.charts.recentJobs.forEach((job) => {
      const key = job.created_at.split('T')[0]
      if (days[key]) {
        days[key].jobs++
      }
    })

    return Object.values(days)
  }

  const chartData = processChartData()

  const quickLinks = [
    {
      title: 'CRM',
      description: 'Kunden & Rechnungen',
      icon: Building2,
      href: '/admin/crm',
      color: 'red',
    },
    {
      title: 'Abonnements',
      description: `${stats.pendingSubscriptions} ausstehend`,
      icon: Crown,
      href: '/admin/subscriptions',
      color: 'yellow',
      badge: stats.pendingSubscriptions > 0,
    },
    {
      title: 'Feedback',
      description: `${stats.unreadFeedback} ungelesen`,
      icon: MessageSquare,
      href: '/admin/feedback',
      color: 'blue',
      badge: stats.unreadFeedback > 0,
    },
    {
      title: 'Einstellungen',
      description: 'Konfiguration',
      icon: Settings,
      href: '/admin/settings',
      color: 'gray',
    },
  ]

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="border-b border-gray-800 bg-brand-dark-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400 text-sm">JobNachbar Verwaltung</p>
          </div>
          <Link href="/" className="btn-secondary text-sm">
            Zur Website
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Links with Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="card hover:border-brand-red/50 transition-colors relative group"
            >
              {link.badge && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-brand-red rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                  !
                </span>
              )}
              <div className={`w-10 h-10 bg-${link.color}-500/20 rounded-lg flex items-center justify-center mb-3`}>
                <link.icon className={`w-5 h-5 text-${link.color}-500`} />
              </div>
              <h3 className="font-medium text-white group-hover:text-brand-red transition-colors">
                {link.title}
              </h3>
              <p className="text-gray-500 text-sm">{link.description}</p>
            </Link>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Benutzer</p>
                <p className="text-2xl font-bold text-white">{stats.users.total}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-4 text-sm">
              <span className="text-gray-500">{stats.users.jobseekers} Bewerber</span>
              <span className="text-gray-500">{stats.users.employers} Arbeitgeber</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Jobs</p>
                <p className="text-2xl font-bold text-white">{stats.jobs.total}</p>
              </div>
            </div>
            <div className="mt-3">
              <span className="text-green-500 text-sm">{stats.jobs.active} aktiv</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Unternehmen</p>
                <p className="text-2xl font-bold text-white">{stats.companies}</p>
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
                <p className="text-2xl font-bold text-white">{stats.users.premium}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Registrations Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-brand-red" />
                Registrierungen (7 Tage)
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E63946" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#E63946" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F1F3A',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#E63946"
                    fill="url(#colorUsers)"
                    strokeWidth={2}
                    name="Neue Benutzer"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Jobs Chart */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-white flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-green-500" />
                Neue Stellen (7 Tage)
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="date"
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#6B7280"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1F1F3A',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#9CA3AF' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="jobs"
                    stroke="#22C55E"
                    fill="url(#colorJobs)"
                    strokeWidth={2}
                    name="Neue Stellen"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Applications Stats */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Bewerbungen
            </h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-brand-dark rounded-lg p-4 text-center">
              <p className="text-3xl font-bold text-white">{stats.applications}</p>
              <p className="text-gray-400 text-sm">Gesamt</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
