import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import SubscriptionManagement from './SubscriptionManagement'

export const metadata: Metadata = {
  title: 'Abonnements verwalten - Admin',
  description: 'Verwaltung von Premium-Abonnements und Rechnungen',
}

export default async function AdminSubscriptionsPage() {
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

  // Fetch subscription requests
  const { data: subscriptions } = await supabase
    .from('subscription_requests')
    .select(`
      *,
      users (
        id,
        email,
        full_name,
        is_premium
      )
    `)
    .order('created_at', { ascending: false })

  return (
    <SubscriptionManagement subscriptions={subscriptions || []} />
  )
}
