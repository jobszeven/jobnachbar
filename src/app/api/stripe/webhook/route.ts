import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    const stripe = getStripe()
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutComplete(session)
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('Invoice paid:', invoice.id)
        break
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log('Payment succeeded:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  const { userId, companyId, tier, months } = session.metadata || {}

  if (!companyId) {
    console.error('No companyId in session metadata')
    return
  }

  const monthsNum = parseInt(months || '1')
  const endDate = new Date()
  endDate.setMonth(endDate.getMonth() + monthsNum)

  // Create subscription in database
  const { data: subscription, error: subError } = await supabase
    .from('subscriptions')
    .insert({
      company_id: companyId,
      tier: tier || 'premium',
      price_monthly: (session.amount_total || 0) / 100 / monthsNum,
      expires_at: endDate.toISOString().split('T')[0],
      status: 'active'
    })
    .select()
    .single()

  if (subError) {
    console.error('Error creating subscription:', subError)
  }

  // Update company subscription tier
  await supabase
    .from('companies')
    .update({
      subscription_tier: tier || 'premium',
      subscription_expires: endDate.toISOString().split('T')[0]
    })
    .eq('id', companyId)

  // Get company info for email
  const { data: company } = await supabase
    .from('companies')
    .select('email, contact_person, company_name')
    .eq('id', companyId)
    .single()

  if (company) {
    // Generate invoice number
    const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number')

    // Create invoice in our system
    const amountCents = session.amount_total || 0
    const taxRate = 19
    const netCents = Math.round(amountCents / 1.19)
    const taxCents = amountCents - netCents

    await supabase.from('invoices').insert({
      invoice_number: invoiceNumber,
      company_id: companyId,
      customer_name: company.company_name,
      customer_email: company.email,
      customer_address: session.customer_details?.address?.line1 || '',
      customer_city: session.customer_details?.address?.city || '',
      customer_zip: session.customer_details?.address?.postal_code || '',
      due_date: new Date().toISOString().split('T')[0],
      subtotal_cents: netCents,
      tax_rate: taxRate,
      tax_cents: taxCents,
      total_cents: amountCents,
      status: 'paid',
      paid_at: new Date().toISOString(),
      payment_method: 'stripe',
      payment_reference: session.payment_intent as string
    })

    // Log activity
    await supabase.from('crm_activities').insert({
      company_id: companyId,
      activity_type: 'payment_received',
      title: 'Stripe-Zahlung erhalten',
      description: `${tier === 'premium' ? 'Premium' : 'Basic'} Abo für ${monthsNum} Monate aktiviert (${(amountCents / 100).toFixed(2)}€)`,
      performed_by: 'stripe'
    })

    // Send welcome email
    await resend.emails.send({
      from: 'JobNachbar <info@jobnachbar.com>',
      to: company.email,
      subject: 'Willkommen bei JobNachbar Premium!',
      html: `
        <h2>Hallo ${company.contact_person},</h2>
        <p>Vielen Dank für Ihre Bestellung!</p>
        <p>Ihr <strong>${tier === 'premium' ? 'Premium' : 'Basic'}</strong> Abo ist jetzt aktiv.</p>
        <p><strong>Gültig bis:</strong> ${endDate.toLocaleDateString('de-DE')}</p>
        <p>Sie können jetzt alle Features nutzen:</p>
        <ul>
          <li>Unbegrenzte Stellenanzeigen</li>
          <li>Bewerbungen direkt einsehen</li>
          <li>Premium-Support</li>
        </ul>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/arbeitgeber" style="background-color: #E63946; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Zum Dashboard</a></p>
        <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
        <p>Ihr JobNachbar Team</p>
      `
    })
  }

  console.log('Checkout completed successfully for company:', companyId)
}
