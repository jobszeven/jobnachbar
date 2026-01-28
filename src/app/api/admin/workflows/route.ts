import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

// POST: Execute automated workflow
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, params } = body

    switch (action) {
      case 'create_and_send_invoice':
        return await createAndSendInvoice(params)

      case 'activate_subscription':
        return await activateSubscription(params)

      case 'send_payment_reminder':
        return await sendPaymentReminder(params)

      case 'send_bulk_reminders':
        return await sendBulkReminders()

      case 'check_overdue_invoices':
        return await checkOverdueInvoices()

      case 'send_expiry_warnings':
        return await sendExpiryWarnings()

      case 'create_subscription_invoice':
        return await createSubscriptionInvoice(params)

      default:
        return NextResponse.json(
          { error: 'Unbekannte Aktion' },
          { status: 400 }
        )
    }
  } catch (error: any) {
    console.error('Workflow error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// Create invoice and send it immediately
async function createAndSendInvoice(params: {
  company_id: string
  items: Array<{ description: string; quantity: number; unit_price_cents: number }>
  due_days?: number
}) {
  const { company_id, items, due_days = 14 } = params

  // Get company
  const { data: company } = await supabase
    .from('companies')
    .select('*')
    .eq('id', company_id)
    .single()

  if (!company) throw new Error('Unternehmen nicht gefunden')

  // Generate invoice number
  const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number')

  // Calculate totals
  let subtotal = 0
  const processedItems = items.map((item, index) => {
    const itemTotal = item.quantity * item.unit_price_cents
    subtotal += itemTotal
    return { ...item, total_cents: itemTotal, position: index }
  })

  const taxRate = 19.00
  const taxCents = Math.round(subtotal * (taxRate / 100))
  const totalCents = subtotal + taxCents

  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + due_days)

  // Create invoice
  const { data: invoice } = await supabase
    .from('invoices')
    .insert({
      invoice_number: invoiceNumber,
      company_id: company.id,
      customer_name: company.company_name,
      customer_email: company.email,
      customer_address: company.street,
      customer_city: company.city,
      customer_zip: company.zip_code,
      due_date: dueDate.toISOString().split('T')[0],
      subtotal_cents: subtotal,
      tax_rate: taxRate,
      tax_cents: taxCents,
      total_cents: totalCents,
      status: 'sent'
    })
    .select()
    .single()

  // Create items
  await supabase.from('invoice_items').insert(
    processedItems.map(item => ({ ...item, invoice_id: invoice.id }))
  )

  // Send email
  const amount = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalCents / 100)

  await resend.emails.send({
    from: 'JobNachbar <rechnung@jobnachbar.com>',
    to: company.email,
    subject: `Ihre Rechnung ${invoiceNumber} von JobNachbar`,
    html: `
      <h2>Hallo ${company.contact_person},</h2>
      <p>vielen Dank für Ihre Bestellung!</p>
      <p>Rechnung: <strong>${invoiceNumber}</strong></p>
      <p>Betrag: <strong>${amount}</strong></p>
      <p>Fällig bis: ${dueDate.toLocaleDateString('de-DE')}</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/invoices/${invoice.id}/pdf">Rechnung als PDF</a></p>
    `
  })

  return NextResponse.json({
    success: true,
    invoice,
    message: `Rechnung ${invoiceNumber} erstellt und versendet`
  })
}

// Activate subscription (1-click after payment confirmed)
async function activateSubscription(params: { subscription_id: string }) {
  const { subscription_id } = params

  // Get subscription request
  const { data: subRequest } = await supabase
    .from('subscription_requests')
    .select('*, users (*)')
    .eq('id', subscription_id)
    .single()

  if (!subRequest) throw new Error('Abo-Anfrage nicht gefunden')

  // Create actual subscription
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + subRequest.duration_months)

  const { data: subscription } = await supabase
    .from('subscriptions')
    .insert({
      company_id: subRequest.user_id, // assuming user_id links to company
      tier: 'premium',
      price_monthly: subRequest.price / subRequest.duration_months,
      expires_at: endDate.toISOString().split('T')[0],
      status: 'active'
    })
    .select()
    .single()

  // Update request status
  await supabase
    .from('subscription_requests')
    .update({ status: 'paid' })
    .eq('id', subscription_id)

  // Update user premium status
  await supabase
    .from('users')
    .update({ is_premium: true })
    .eq('id', subRequest.user_id)

  // Send welcome email
  await resend.emails.send({
    from: 'JobNachbar <info@jobnachbar.com>',
    to: subRequest.email,
    subject: 'Willkommen bei JobNachbar Premium!',
    html: `
      <h2>Hallo ${subRequest.name},</h2>
      <p>Ihr Premium-Abo ist jetzt aktiv!</p>
      <p>Gültig bis: ${endDate.toLocaleDateString('de-DE')}</p>
      <p>Sie können jetzt alle Premium-Features nutzen.</p>
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/arbeitgeber">Zum Dashboard</a></p>
    `
  })

  return NextResponse.json({
    success: true,
    subscription,
    message: 'Premium aktiviert und Willkommens-E-Mail versendet'
  })
}

// Send payment reminder for a specific invoice
async function sendPaymentReminder(params: { invoice_id: string; reminder_level?: number }) {
  const { invoice_id, reminder_level = 1 } = params

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*')
    .eq('id', invoice_id)
    .single()

  if (!invoice) throw new Error('Rechnung nicht gefunden')

  const amount = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(invoice.total_cents / 100)
  const dueDate = new Date(invoice.due_date).toLocaleDateString('de-DE')

  const subject = reminder_level === 1
    ? `Zahlungserinnerung: Rechnung ${invoice.invoice_number}`
    : `${reminder_level}. Mahnung: Rechnung ${invoice.invoice_number}`

  const urgency = reminder_level === 1
    ? 'freundlich daran erinnern'
    : reminder_level === 2
    ? 'dringend darauf hinweisen'
    : 'letztmalig auffordern'

  await resend.emails.send({
    from: 'JobNachbar <rechnung@jobnachbar.com>',
    to: invoice.customer_email,
    subject,
    html: `
      <h2>Hallo ${invoice.customer_name},</h2>
      <p>wir möchten Sie ${urgency}, dass die Rechnung <strong>${invoice.invoice_number}</strong> über <strong>${amount}</strong> noch offen ist.</p>
      <p>Fälligkeitsdatum: ${dueDate}</p>
      ${reminder_level >= 2 ? '<p><strong>Bitte überweisen Sie den Betrag umgehend, um weitere Mahngebühren zu vermeiden.</strong></p>' : ''}
      <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/invoices/${invoice.id}/pdf">Rechnung anzeigen</a></p>
    `
  })

  // Log reminder
  await supabase.from('payment_reminders').insert({
    invoice_id,
    reminder_level,
    sent_at: new Date().toISOString()
  })

  // Update invoice status
  if (invoice.status !== 'overdue') {
    await supabase
      .from('invoices')
      .update({ status: 'overdue' })
      .eq('id', invoice_id)
  }

  // Log activity
  await supabase.from('crm_activities').insert({
    company_id: invoice.company_id,
    invoice_id,
    activity_type: 'reminder_sent',
    title: `${reminder_level}. Zahlungserinnerung versendet`,
    description: `Mahnung für Rechnung ${invoice.invoice_number} versendet`,
    performed_by: 'admin'
  })

  return NextResponse.json({
    success: true,
    message: `${reminder_level}. Zahlungserinnerung versendet`
  })
}

// Send reminders for all overdue invoices
async function sendBulkReminders() {
  const today = new Date().toISOString().split('T')[0]

  // Find overdue invoices
  const { data: overdueInvoices } = await supabase
    .from('invoices')
    .select('*')
    .in('status', ['sent', 'overdue'])
    .lt('due_date', today)

  if (!overdueInvoices || overdueInvoices.length === 0) {
    return NextResponse.json({
      success: true,
      sent: 0,
      message: 'Keine überfälligen Rechnungen gefunden'
    })
  }

  let sentCount = 0

  for (const invoice of overdueInvoices) {
    // Check last reminder
    const { data: lastReminder } = await supabase
      .from('payment_reminders')
      .select('*')
      .eq('invoice_id', invoice.id)
      .order('reminder_level', { ascending: false })
      .limit(1)
      .single()

    const nextLevel = lastReminder ? lastReminder.reminder_level + 1 : 1

    // Only send up to 3 reminders
    if (nextLevel <= 3) {
      await sendPaymentReminder({ invoice_id: invoice.id, reminder_level: nextLevel })
      sentCount++
    }
  }

  return NextResponse.json({
    success: true,
    sent: sentCount,
    message: `${sentCount} Zahlungserinnerungen versendet`
  })
}

// Check and mark overdue invoices
async function checkOverdueInvoices() {
  const today = new Date().toISOString().split('T')[0]

  const { data: overdueInvoices, error } = await supabase
    .from('invoices')
    .update({ status: 'overdue' })
    .eq('status', 'sent')
    .lt('due_date', today)
    .select()

  return NextResponse.json({
    success: true,
    updated: overdueInvoices?.length || 0,
    message: `${overdueInvoices?.length || 0} Rechnungen als überfällig markiert`
  })
}

// Send expiry warnings for subscriptions
async function sendExpiryWarnings() {
  const in7Days = new Date()
  in7Days.setDate(in7Days.getDate() + 7)
  const in7DaysStr = in7Days.toISOString().split('T')[0]

  // Find expiring subscriptions
  const { data: expiringSubscriptions } = await supabase
    .from('subscriptions')
    .select('*, companies (*)')
    .eq('status', 'active')
    .lte('expires_at', in7DaysStr)
    .gte('expires_at', new Date().toISOString().split('T')[0])

  if (!expiringSubscriptions || expiringSubscriptions.length === 0) {
    return NextResponse.json({
      success: true,
      sent: 0,
      message: 'Keine auslaufenden Abos gefunden'
    })
  }

  let sentCount = 0

  for (const sub of expiringSubscriptions) {
    const company = sub.companies
    if (!company) continue

    await resend.emails.send({
      from: 'JobNachbar <info@jobnachbar.com>',
      to: company.email,
      subject: 'Ihr JobNachbar Premium läuft bald ab',
      html: `
        <h2>Hallo ${company.contact_person},</h2>
        <p>Ihr Premium-Abo läuft am <strong>${new Date(sub.expires_at).toLocaleDateString('de-DE')}</strong> ab.</p>
        <p>Verlängern Sie jetzt, um weiterhin alle Vorteile zu nutzen:</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/preise" style="background-color: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Jetzt verlängern</a></p>
      `
    })

    // Log activity
    await supabase.from('crm_activities').insert({
      company_id: company.id,
      activity_type: 'expiry_warning_sent',
      title: 'Ablaufwarnung versendet',
      description: `Erinnerung an Abo-Ablauf am ${sub.expires_at} versendet`,
      performed_by: 'system'
    })

    sentCount++
  }

  return NextResponse.json({
    success: true,
    sent: sentCount,
    message: `${sentCount} Ablaufwarnungen versendet`
  })
}

// Create invoice for subscription
async function createSubscriptionInvoice(params: {
  company_id: string
  tier: 'basic' | 'premium'
  months: number
}) {
  const { company_id, tier, months } = params

  const prices = {
    basic: 4900, // 49 EUR
    premium: 9900 // 99 EUR
  }

  const pricePerMonth = prices[tier]
  const totalPrice = pricePerMonth * months

  return createAndSendInvoice({
    company_id,
    items: [{
      description: `JobNachbar ${tier === 'premium' ? 'Premium' : 'Basic'} Abo (${months} ${months === 1 ? 'Monat' : 'Monate'})`,
      quantity: months,
      unit_price_cents: pricePerMonth
    }],
    due_days: 14
  })
}
