import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Single invoice with items
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: invoice, error } = await supabase
      .from('invoices')
      .select(`
        *,
        companies (id, company_name, email, contact_person, phone),
        invoice_items (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    if (!invoice) {
      return NextResponse.json(
        { error: 'Rechnung nicht gefunden' },
        { status: 404 }
      )
    }

    return NextResponse.json({ invoice })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PATCH: Update invoice
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from('crm_activities').insert({
      company_id: invoice.company_id,
      invoice_id: invoice.id,
      activity_type: 'invoice_updated',
      title: 'Rechnung aktualisiert',
      description: `Rechnung ${invoice.invoice_number} wurde aktualisiert`,
      performed_by: 'admin'
    })

    return NextResponse.json({
      success: true,
      invoice,
      message: 'Rechnung aktualisiert'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// DELETE: Cancel invoice (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const { data: invoice, error } = await supabase
      .from('invoices')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from('crm_activities').insert({
      company_id: invoice.company_id,
      invoice_id: invoice.id,
      activity_type: 'invoice_cancelled',
      title: 'Rechnung storniert',
      description: `Rechnung ${invoice.invoice_number} wurde storniert`,
      performed_by: 'admin'
    })

    return NextResponse.json({
      success: true,
      message: 'Rechnung storniert'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
