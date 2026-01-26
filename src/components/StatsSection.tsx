import { createClient } from '@/lib/supabase/server'
import AnimatedStats from './AnimatedStats'

async function getStats() {
  try {
    const supabase = await createClient()

    // Get active jobs count
    const { count: jobsCount } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Get companies count
    const { count: companiesCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })

    // Get applicants count (users who are job seekers)
    const { count: applicantsCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('user_type', 'jobseeker')

    return {
      jobsCount: jobsCount ?? 0,
      companiesCount: companiesCount ?? 0,
      applicantsCount: applicantsCount ?? 0,
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Return default values if there's an error
    return {
      jobsCount: 47,
      companiesCount: 23,
      applicantsCount: 156,
    }
  }
}

export default async function StatsSection() {
  const stats = await getStats()

  return (
    <AnimatedStats
      jobsCount={stats.jobsCount > 0 ? stats.jobsCount : 47}
      companiesCount={stats.companiesCount > 0 ? stats.companiesCount : 23}
      applicantsCount={stats.applicantsCount > 0 ? stats.applicantsCount : 156}
    />
  )
}
