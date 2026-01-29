import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardRedirect() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check email verification
  if (!user.email_confirmed_at) {
    redirect('/verifizierung-ausstehend?email=' + encodeURIComponent(user.email || ''))
  }

  const userType = user.user_metadata?.user_type

  if (userType === 'employer') {
    redirect('/dashboard/arbeitgeber')
  } else if (userType === 'applicant') {
    redirect('/dashboard/bewerber')
  } else {
    // Check if admin
    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('auth_id', user.id)
      .single()

    if (userData?.is_admin) {
      redirect('/admin')
    }

    // Default fallback
    redirect('/dashboard/bewerber')
  }
}
