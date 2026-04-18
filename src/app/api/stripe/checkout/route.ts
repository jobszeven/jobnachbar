import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

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

// Preise in Cents (€ * 100)
const PRICES = {
  // Arbeitgeber Basic: 39€/Monat
  basic_1: { price: 3900, name: 'Basic Abo (1 Monat)', months: 1, tier: 'basic' },
  basic_3: { price: 11100, name: 'Basic Abo (3 Monate)', months: 3, tier: 'basic' }, // 37€/Monat
  basic_6: { price: 19800, name: 'Basic Abo (6 Monate)', months: 6, tier: 'basic' }, // 33€/Monat
  // Arbeitgeber Premium: 79€/Monat
  premium_1: { price: 7900, name: 'Premium Abo (1 Monat)', months: 1, tier: 'premium' },
  premium_3: { price: 22500, name: 'Premium Abo (3 Monate)', months: 3, tier: 'premium' }, // 75€/Monat
  premium_6: { price: 42000, name: 'Premium Abo (6 Monate)', months: 6, tier: 'premium' }, // 70€/Monat
  // Bewerber Premium: 4,99€/Monat
  bewerber_1: { price: 499, name: 'Bewerber Premium (1 Monat)', months: 1, tier: 'bewerber_premium' },
  bewerber_12: { price: 2900, name: 'Bewerber Premium (1 Jahr)', months: 12, tier: 'bewerber_premium' }, // 29€/Jahr
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, userId, companyId } = body

    // Dynamische Base URL für lokale Entwicklung vs Production
    const host = request.headers.get('host') || 'jobnachbar.com'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${protocol}://${host}`

    if (!priceId || !PRICES[priceId as keyof typeof PRICES]) {
      return NextResponse.json(
        { error: 'Ungültiger Preis' },
        { status: 400 }
      )
    }

    const priceConfig = PRICES[priceId as keyof typeof PRICES]

    // Get company/user info for prefilling
    let customerEmail = ''
    let customerName = ''

    if (companyId) {
      const { data: company } = await supabase
        .from('companies')
        .select('email, company_name')
        .eq('id', companyId)
        .single()

      if (company) {
        customerEmail = company.email
        customerName = company.company_name
      }
    }

    // Create Stripe checkout session
    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'sepa_debit'],
      mode: 'payment',
      locale: 'de',
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: priceConfig.name,
              description: `JobNachbar ${priceConfig.tier === 'premium' ? 'Premium' : 'Basic'} Zugang für ${priceConfig.months} ${priceConfig.months === 1 ? 'Monat' : 'Monate'}`,
              images: ['https://jobnachbar.com/logo.png'],
            },
            unit_amount: priceConfig.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || '',
        companyId: companyId || '',
        priceId,
        tier: priceConfig.tier,
        months: priceConfig.months.toString(),
      },
      success_url: `${baseUrl}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/preise`,
      billing_address_collection: 'required',
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: `JobNachbar ${priceConfig.name}`,
          footer: 'Vielen Dank für Ihr Vertrauen! - JobNachbar Team',
        },
      },
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  } catch (error: any) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
