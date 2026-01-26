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

    // Update subscription status
    const { error } = await supabase
      .from('subscription_requests')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)

    if (error) {
      console.error('Error cancelling subscription:', error)
      return NextResponse.json({
        error: 'Datenbankfehler',
        message: 'Bestellung konnte nicht storniert werden.',
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Bestellung erfolgreich storniert.',
    })
  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return NextResponse.json({
      error: 'Serverfehler',
      message: 'Ein Fehler ist aufgetreten.',
    }, { status: 500 })
  }
}
