import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const { subscriptionId } = await request.json()

    if (!subscriptionId) {
      return NextResponse.json({
        error: 'Fehlende Daten',
        message: 'Subscription ID erforderlich.',
      }, { status: 400 })
    }

    // Get subscription details
    const { data: subscription, error: fetchError } = await supabase
      .from('subscription_requests')
      .select('*')
      .eq('id', subscriptionId)
      .single()

    if (fetchError || !subscription) {
      return NextResponse.json({
        error: 'Nicht gefunden',
        message: 'Bestellung nicht gefunden.',
      }, { status: 404 })
    }

    // Update subscription status
    const { error: updateSubError } = await supabase
      .from('subscription_requests')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)

    if (updateSubError) {
      console.error('Error updating subscription:', updateSubError)
      return NextResponse.json({
        error: 'Datenbankfehler',
        message: 'Bestellung konnte nicht aktualisiert werden.',
      }, { status: 500 })
    }

    // Activate premium for user
    const { error: updateUserError } = await supabase
      .from('users')
      .update({
        is_premium: true,
        premium_until: subscription.end_date,
      })
      .eq('id', subscription.user_id)

    if (updateUserError) {
      console.error('Error updating user premium status:', updateUserError)
      return NextResponse.json({
        error: 'Datenbankfehler',
        message: 'Premium-Status konnte nicht aktiviert werden.',
      }, { status: 500 })
    }

    // TODO: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: 'Premium erfolgreich aktiviert.',
    })
  } catch (error) {
    console.error('Subscription activation error:', error)
    return NextResponse.json({
      error: 'Serverfehler',
      message: 'Ein Fehler ist aufgetreten.',
    }, { status: 500 })
  }
}
