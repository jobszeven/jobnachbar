import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST: Add note to company
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { content, is_pinned = false, author = 'Admin' } = body

    const { data: note, error } = await supabase
      .from('crm_notes')
      .insert({
        company_id: id,
        content,
        is_pinned,
        author
      })
      .select()
      .single()

    if (error) throw error

    // Log activity
    await supabase.from('crm_activities').insert({
      company_id: id,
      activity_type: 'note_added',
      title: 'Notiz hinzugefügt',
      description: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
      performed_by: author
    })

    return NextResponse.json({
      success: true,
      note,
      message: 'Notiz hinzugefügt'
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
