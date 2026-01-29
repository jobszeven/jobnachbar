import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export type UserRole = 'applicant' | 'employer'

export async function requireApplicant() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check email verification
  if (!user.email_confirmed_at) {
    redirect('/verifizierung-ausstehend?email=' + encodeURIComponent(user.email || ''))
  }

  const userType = user.user_metadata?.user_type as UserRole

  if (userType !== 'applicant') {
    redirect(userType === 'employer' ? '/dashboard/arbeitgeber' : '/login')
  }

  return { user, userType }
}

export async function requireEmployer() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check email verification
  if (!user.email_confirmed_at) {
    redirect('/verifizierung-ausstehend?email=' + encodeURIComponent(user.email || ''))
  }

  const userType = user.user_metadata?.user_type as UserRole

  if (userType !== 'employer') {
    redirect(userType === 'applicant' ? '/dashboard/bewerber' : '/login')
  }

  return { user, userType }
}

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check is_admin in database
  const { data: userData } = await supabase
    .from('users')
    .select('is_admin')
    .eq('auth_id', user.id)
    .single()

  if (!userData?.is_admin) {
    const userType = user.user_metadata?.user_type
    redirect(userType === 'employer' ? '/dashboard/arbeitgeber' : '/dashboard/bewerber')
  }

  return { user }
}

export async function getAuthUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
