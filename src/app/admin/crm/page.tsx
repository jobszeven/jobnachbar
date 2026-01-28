import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CRMDashboard from './CRMDashboard'

export const metadata: Metadata = {
  title: 'CRM - Admin Dashboard',
  description: 'Kundenbeziehungsmanagement',
}

export default async function CRMPage() {
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

  return <CRMDashboard />
}
