import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: Mark invoice as paid
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { payment_method, payment_reference } = body

    // Update invoice
    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: payment_method || 'bank_transfer',
        payment_reference
      })
      .eq('id', id)
      .select(`*, companies (id, auth_id)`)
      .single()

    if (error) throw error

    // If this is a subscription invoice, activate the subscription
    const { data: items } = await supabase
      .from('invoice_items')
      .select('subscription_id')
      .eq('invoice_id', id)
      .not('subscription_id', 'is', null)

    if (items && items.length > 0) {
      for (const item of items) {
        if (item.subscription_id) {
          await supabase
            .from('subscriptions')
            .update({ status: 'active' })
            .eq('id', item.subscription_id)

          // Update company subscription tier
          await supabase
            .from('companies')
            .update({ subscription_tier: 'premium' })
            .eq('id', invoice.company_id)
        }
      }
    }

    return NextResponse.json({
      success: true,
      invoice,
      message: 'Zahlung erfasst'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
