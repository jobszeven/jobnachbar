import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendSubscriptionActivated } from '@/lib/email'

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

    // Get the subscription request
    const { data: subscriptionRequest, error: fetchError } = await supabase
      .from('subscription_requests')
      .select(`
        *,
        users (
          id,
          email,
          first_name,
          last_name
        )
      `)
      .eq('id', requestId)
      .single()

    if (fetchError || !subscriptionRequest) {
      return NextResponse.json({ error: 'Anfrage nicht gefunden' }, { status: 404 })
    }

    // Update subscription request status
    const { error: updateRequestError } = await supabase
      .from('subscription_requests')
      .update({ status: 'approved', approved_at: new Date().toISOString() })
      .eq('id', requestId)

    if (updateRequestError) {
      throw updateRequestError
    }

    // Activate premium for the user
    const validUntil = new Date()
    validUntil.setMonth(validUntil.getMonth() + 1) // 1 month subscription

    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        is_premium: true,
        premium_valid_until: validUntil.toISOString(),
      })
      .eq('id', subscriptionRequest.user_id)

    if (updateUserError) {
      throw updateUserError
    }

    // Send confirmation email
    const userData = subscriptionRequest.users as { email: string; first_name?: string; last_name?: string }
    if (userData?.email) {
      await sendSubscriptionActivated(
        userData.email,
        `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Kunde',
        subscriptionRequest.plan_name,
        validUntil.toLocaleDateString('de-DE')
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error approving subscription:', error)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}
