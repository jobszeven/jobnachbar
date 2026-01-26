import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { data: adminUser } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!adminUser?.is_admin) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const { requestId } = await request.json()

    // Update subscription request status
    const { error } = await supabase
      .from('subscription_requests')
      .update({ status: 'rejected', rejected_at: new Date().toISOString() })
      .eq('id', requestId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error rejecting subscription:', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
