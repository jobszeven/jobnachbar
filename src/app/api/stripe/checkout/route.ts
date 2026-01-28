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

const PRICES = {
  basic_1: { price: 4900, name: 'Basic Abo (1 Monat)', months: 1, tier: 'basic' },
  basic_3: { price: 13900, name: 'Basic Abo (3 Monate)', months: 3, tier: 'basic' },
  basic_6: { price: 24900, name: 'Basic Abo (6 Monate)', months: 6, tier: 'basic' },
  premium_1: { price: 9900, name: 'Premium Abo (1 Monat)', months: 1, tier: 'premium' },
  premium_3: { price: 27900, name: 'Premium Abo (3 Monate)', months: 3, tier: 'premium' },
  premium_6: { price: 54900, name: 'Premium Abo (6 Monate)', months: 6, tier: 'premium' },
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { priceId, userId, companyId } = body

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/premium/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/preise`,
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
