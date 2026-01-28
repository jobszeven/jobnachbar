import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: List all invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const companyId = searchParams.get('company_id')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('invoices')
      .select(`
        *,
        companies (id, company_name, email, contact_person),
        invoice_items (*)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    if (companyId) {
      query = query.eq('company_id', companyId)
    }

    const { data, error } = await query

    if (error) throw error

    // Get total count
    const { count } = await supabase
      .from('invoices')
      .select('*', { count: 'exact', head: true })

    return NextResponse.json({
      invoices: data,
      total: count,
      limit,
      offset
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// POST: Create new invoice
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      company_id,
      items,
      due_days = 14,
      notes,
      send_email = false
    } = body

    // Get company info
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('*')
      .eq('id', company_id)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Unternehmen nicht gefunden' },
        { status: 404 }
      )
    }

    // Generate invoice number
    const { data: invoiceNumber } = await supabase.rpc('generate_invoice_number')

    // Calculate totals
    let subtotal = 0
    const processedItems = items.map((item: any, index: number) => {
      const itemTotal = item.quantity * item.unit_price_cents
      subtotal += itemTotal
      return {
        description: item.description,
        quantity: item.quantity,
        unit_price_cents: item.unit_price_cents,
        total_cents: itemTotal,
        position: index
      }
    })

    const taxRate = 19.00
    const taxCents = Math.round(subtotal * (taxRate / 100))
    const totalCents = subtotal + taxCents

    // Create invoice
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + due_days)

    const { data: invoice, error: invoiceError } = await supabase
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
        status: 'draft',
        notes
      })
      .select()
      .single()

    if (invoiceError) throw invoiceError

    // Create invoice items
    const itemsWithInvoiceId = processedItems.map((item: any) => ({
      ...item,
      invoice_id: invoice.id
    }))

    const { error: itemsError } = await supabase
      .from('invoice_items')
      .insert(itemsWithInvoiceId)

    if (itemsError) throw itemsError

    // Send email if requested
    if (send_email) {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/admin/invoices/${invoice.id}/send`, {
        method: 'POST'
      })
    }

    return NextResponse.json({
      success: true,
      invoice,
      message: 'Rechnung erstellt'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
