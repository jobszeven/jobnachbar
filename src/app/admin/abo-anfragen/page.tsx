import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import SubscriptionRequestsManager from './SubscriptionRequestsManager'

export const metadata: Metadata = {
  title: 'Abo-Anfragen - Admin - JobNachbar',
  description: 'Verwalten Sie Abo-Anfragen',
}

async function getSubscriptionRequests() {
  const supabase = await createClient()

  const { data: requests, error } = await supabase
    .from('subscription_requests')
    .select(`
      *,
      users (
        id,
        email,
        first_name,
        last_name,
        user_type
      )
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching subscription requests:', error)
    return []
  }

  return requests || []
}

export default async function AboAnfragenPage() {
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

  const requests = await getSubscriptionRequests()

  return (
    <div className="min-h-screen bg-brand-dark">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Back Link */}
        <Link
          href="/admin"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Zurück zum Dashboard
        </Link>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Abo-Anfragen</h1>
          <div className="flex items-center gap-2">
            <span className="bg-brand-red/20 text-brand-red px-3 py-1 rounded-full text-sm font-medium">
              {requests.filter(r => r.status === 'pending').length} offen
            </span>
          </div>
        </div>

        <SubscriptionRequestsManager initialRequests={requests} />
      </main>
    </div>
  )
}
