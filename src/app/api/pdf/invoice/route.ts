import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { InvoicePDF, InvoiceData } from '@/lib/pdf'
import * as React from 'react'

// Admin only endpoint for generating invoices
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication and admin status
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const { data: userData } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userData?.is_admin) {
      return NextResponse.json({ error: 'Keine Berechtigung' }, { status: 403 })
    }

    const data = await request.json() as InvoiceData

    if (!data.invoiceNumber || !data.customer || !data.items || data.items.length === 0) {
      return NextResponse.json({
        error: 'Unvollständige Daten',
        message: 'Bitte fülle alle erforderlichen Felder aus.',
      }, { status: 400 })
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(InvoicePDF, { data }) as React.ReactElement
    )

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="rechnung-${data.invoiceNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Invoice PDF generation error:', error)
    return NextResponse.json({
      error: 'Fehler bei der PDF-Erstellung',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
    }, { status: 500 })
  }
}
