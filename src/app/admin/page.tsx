import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import AdminDashboard from './AdminDashboard'

export const metadata: Metadata = {
  title: 'Admin Dashboard - JobNachbar',
  description: 'Administrationsbereich für JobNachbar',
}

async function getStats() {
  const supabase = await createClient()

  // Users stats
  const { count: totalUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })

  const { count: jobseekers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_type', 'jobseeker')

  const { count: employers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('user_type', 'employer')

  const { count: premiumUsers } = await supabase
    .from('users')
    .select('*', { count: 'exact', head: true })
    .eq('is_premium', true)

  // Jobs stats
  const { count: totalJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })

  const { count: activeJobs } = await supabase
    .from('jobs')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'active')

  // Companies stats
  const { count: totalCompanies } = await supabase
    .from('companies')
    .select('*', { count: 'exact', head: true })

  // Applications stats
  const { count: totalApplications } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })

  // Pending subscriptions
  const { count: pendingSubscriptions } = await supabase
    .from('subscription_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  // Recent feedback
  const { count: unreadFeedback } = await supabase
    .from('feedback')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)

  // Get last 7 days registrations for chart
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data: recentUsers } = await supabase
    .from('users')
    .select('created_at, user_type')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  // Get last 7 days jobs
  const { data: recentJobs } = await supabase
    .from('jobs')
    .select('created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  return {
    users: {
      total: totalUsers || 0,
      jobseekers: jobseekers || 0,
      employers: employers || 0,
      premium: premiumUsers || 0,
    },
    jobs: {
      total: totalJobs || 0,
      active: activeJobs || 0,
    },
    companies: totalCompanies || 0,
    applications: totalApplications || 0,
    pendingSubscriptions: pendingSubscriptions || 0,
    unreadFeedback: unreadFeedback || 0,
    charts: {
      recentUsers: recentUsers || [],
      recentJobs: recentJobs || [],
    },
  }
}

export default async function AdminPage() {
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()

  if (!userData?.is_admin) {
    redirect('/dashboard')
  }

  const stats = await getStats()

  return <AdminDashboard stats={stats} />
}
