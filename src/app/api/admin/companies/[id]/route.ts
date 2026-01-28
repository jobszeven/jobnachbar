import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: Single company with full CRM data
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get company
    const { data: company, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !company) {
      return NextResponse.json(
        { error: 'Unternehmen nicht gefunden' },
        { status: 404 }
      )
    }

    // Get subscriptions
    const { data: subscriptions } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })

    // Get invoices
    const { data: invoices } = await supabase
      .from('invoices')
      .select('*, invoice_items (*)')
      .eq('company_id', id)
      .order('created_at', { ascending: false })

    // Get jobs
    const { data: jobs } = await supabase
      .from('jobs')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })

    // Get activities
    const { data: activities } = await supabase
      .from('crm_activities')
      .select('*')
      .eq('company_id', id)
      .order('created_at', { ascending: false })
      .limit(50)

    // Get notes
    const { data: notes } = await supabase
      .from('crm_notes')
      .select('*')
      .eq('company_id', id)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })

    // Get emails sent
    const { data: emails } = await supabase
      .from('email_log')
      .select('*')
      .eq('company_id', id)
      .order('sent_at', { ascending: false })
      .limit(20)

    // Calculate stats
    const stats = {
      totalJobs: jobs?.length || 0,
      activeJobs: jobs?.filter(j => j.status === 'active').length || 0,
      totalInvoices: invoices?.length || 0,
      paidInvoices: invoices?.filter(i => i.status === 'paid').length || 0,
      openInvoices: invoices?.filter(i => i.status === 'sent' || i.status === 'overdue').length || 0,
      totalRevenue: invoices
        ?.filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total_cents, 0) || 0
    }

    return NextResponse.json({
      company,
      subscriptions,
      invoices,
      jobs,
      activities,
      notes,
      emails,
      stats
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

// PATCH: Update company
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data: company, error } = await supabase
      .from('companies')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from('crm_activities').insert({
      company_id: id,
      activity_type: 'company_updated',
      title: 'Unternehmen aktualisiert',
      description: `Unternehmensdaten wurden aktualisiert`,
      performed_by: 'admin'
    })

    return NextResponse.json({
      success: true,
      company,
      message: 'Unternehmen aktualisiert'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
