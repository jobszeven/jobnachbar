import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ApplicationsManagement from './ApplicationsManagement'

export const metadata: Metadata = {
  title: 'Bewerbungen - Arbeitgeber Dashboard',
  description: 'Verwalten Sie eingehende Bewerbungen auf Ihre Stellenanzeigen.',
}

export default async function EmployerApplicationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Get user's company
  const { data: company } = await supabase
    .from('companies')
    .select('id')
    .eq('owner_id', user.id)
    .single()

  if (!company) {
    redirect('/dashboard/arbeitgeber/profil')
  }

  // Fetch applications for all company jobs
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      *,
      jobs (
        id,
        title,
        status
      ),
      users (
        id,
        email,
        full_name,
        avatar_url,
        phone,
        location
      )
    `)
    .eq('jobs.company_id', company.id)
    .order('created_at', { ascending: false })

  // Fetch jobs for filter
  const { data: jobs } = await supabase
    .from('jobs')
    .select('id, title')
    .eq('company_id', company.id)
    .eq('status', 'active')

  return (
    <ApplicationsManagement
      applications={applications || []}
      jobs={jobs || []}
      companyId={company.id}
    />
  )
}
