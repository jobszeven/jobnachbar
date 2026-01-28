import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET: List all companies with CRM data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const tier = searchParams.get('tier')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('companies')
      .select(`
        *,
        subscriptions (id, tier, status, started_at, expires_at),
        jobs (id, title, status, created_at)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,email.ilike.%${search}%,contact_person.ilike.%${search}%`)
    }

    if (tier && tier !== 'all') {
      query = query.eq('subscription_tier', tier)
    }

    const { data, error } = await query

    if (error) throw error

    // Get total count
    const { count } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })

    // Get stats
    const { count: freeCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'free')

    const { count: basicCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'basic')

    const { count: premiumCount } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .eq('subscription_tier', 'premium')

    return NextResponse.json({
      companies: data,
      total: count,
      stats: {
        total: count,
        free: freeCount,
        basic: basicCount,
        premium: premiumCount
      },
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
