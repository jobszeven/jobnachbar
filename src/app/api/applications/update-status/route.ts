import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendApplicationStatus } from '@/lib/email'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { applicationId, status } = await request.json()

    if (!applicationId || !status) {
      return NextResponse.json({
        error: 'Fehlende Daten',
        message: 'Application ID und Status erforderlich.',
      }, { status: 400 })
    }

    // Verify the user owns the company that owns the job
    const { data: application } = await supabase
      .from('applications')
      .select(`
        *,
        jobs (
          id,
          title,
          company_id,
          companies (
            owner_id,
            name
          )
        ),
        users (
          email,
          full_name
        )
      `)
      .eq('id', applicationId)
      .single()

    if (!application) {
      return NextResponse.json({
        error: 'Nicht gefunden',
        message: 'Bewerbung nicht gefunden.',
      }, { status: 404 })
    }

    const company = application.jobs?.companies as { owner_id: string; name: string } | null
    if (company?.owner_id !== user.id) {
      return NextResponse.json({
        error: 'Keine Berechtigung',
        message: 'Sie haben keine Berechtigung für diese Bewerbung.',
      }, { status: 403 })
    }

    // Update application status
    const { error } = await supabase
      .from('applications')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', applicationId)

    if (error) {
      console.error('Error updating application:', error)
      return NextResponse.json({
        error: 'Datenbankfehler',
        message: 'Status konnte nicht aktualisiert werden.',
      }, { status: 500 })
    }

    // Send email notification to applicant for important status changes
    const applicant = application.users as { email: string; full_name: string } | null
    if (applicant && (status === 'viewed' || status === 'invited' || status === 'rejected')) {
      try {
        await sendApplicationStatus(
          applicant.email,
          applicant.full_name,
          application.jobs?.title || 'Unbekannte Stelle',
          company?.name || 'Unbekanntes Unternehmen',
          status as 'viewed' | 'invited' | 'rejected'
        )
      } catch (emailError) {
        console.error('Error sending status email:', emailError)
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Status erfolgreich aktualisiert.',
    })
  } catch (error) {
    console.error('Application status update error:', error)
    return NextResponse.json({
      error: 'Serverfehler',
      message: 'Ein Fehler ist aufgetreten.',
    }, { status: 500 })
  }
}
