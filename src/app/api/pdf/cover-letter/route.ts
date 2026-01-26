import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { CoverLetterPDF, CoverLetterData } from '@/lib/pdf'
import * as React from 'react'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const data = await request.json() as CoverLetterData

    if (!data.sender || !data.recipient || !data.content) {
      return NextResponse.json({
        error: 'Unvollständige Daten',
        message: 'Bitte fülle alle erforderlichen Felder aus.',
      }, { status: 400 })
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(CoverLetterPDF, { data }) as React.ReactElement
    )

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="anschreiben.pdf"',
      },
    })
  } catch (error) {
    console.error('Cover letter PDF generation error:', error)
    return NextResponse.json({
      error: 'Fehler bei der PDF-Erstellung',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
    }, { status: 500 })
  }
}
