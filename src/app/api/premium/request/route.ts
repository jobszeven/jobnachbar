import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendPremiumSubscriptionConfirmation, sendAdminNewSubscriptionRequest } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, address, city, postalCode, duration, price } = body

    // Validate required fields
    if (!name || !email || !address || !city || !postalCode || !duration || !price) {
      return NextResponse.json({
        error: 'Fehlende Daten',
        message: 'Bitte fülle alle Pflichtfelder aus.',
      }, { status: 400 })
    }

    // Generate invoice number
    const invoiceNumber = `JN-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`

    // Calculate end date
    const startDate = new Date()
    const endDate = new Date()
    endDate.setMonth(endDate.getMonth() + parseInt(duration))

    // Create subscription request in database
    const { error: insertError } = await supabase
      .from('subscription_requests')
      .insert({
        user_id: user.id,
        invoice_number: invoiceNumber,
        name,
        email,
        address,
        city,
        postal_code: postalCode,
        duration_months: parseInt(duration),
        price: parseFloat(price),
        status: 'pending',
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      })

    if (insertError) {
      console.error('Error creating subscription request:', insertError)
      return NextResponse.json({
        error: 'Datenbankfehler',
        message: 'Anfrage konnte nicht gespeichert werden.',
      }, { status: 500 })
    }

    // Send confirmation email to user
    await sendPremiumSubscriptionConfirmation({
      email,
      name,
      invoiceNumber,
      amount: price,
      durationMonths: parseInt(duration),
      bankDetails: {
        accountHolder: 'JobNachbar GmbH',
        iban: 'DE89 3704 0044 0532 0130 00',
        bic: 'COBADEFFXXX',
        bank: 'Commerzbank',
      },
    })

    // Send notification to admin
    await sendAdminNewSubscriptionRequest({
      userName: name,
      userEmail: email,
      invoiceNumber,
      amount: price,
      durationMonths: parseInt(duration),
    })

    return NextResponse.json({
      success: true,
      invoiceNumber,
      message: 'Anfrage erfolgreich. Du erhältst eine E-Mail mit der Rechnung.',
    })
  } catch (error) {
    console.error('Premium request error:', error)
    return NextResponse.json({
      error: 'Serverfehler',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
    }, { status: 500 })
  }
}
