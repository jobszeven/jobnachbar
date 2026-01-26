import { NextRequest, NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { createClient } from '@/lib/supabase/server'
import { ModernResume, ClassicResume, CreativeResume, MinimalResume, ProfessionalResume, ElegantResume, ExecutiveResume, TechResume, AcademicResume, CompactResume, ResumeData } from '@/lib/pdf'
import * as React from 'react'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 })
    }

    const body = await request.json()
    const { template = 'modern', data } = body as { template: string; data: ResumeData }

    if (!data || !data.personal || !data.experience || !data.education || !data.skills) {
      return NextResponse.json({
        error: 'Unvollständige Daten',
        message: 'Bitte fülle alle erforderlichen Felder aus.',
      }, { status: 400 })
    }

    // Select template
    let TemplateComponent: React.ComponentType<{ data: ResumeData }>
    switch (template) {
      case 'classic':
        TemplateComponent = ClassicResume
        break
      case 'creative':
        TemplateComponent = CreativeResume
        break
      case 'minimal':
        TemplateComponent = MinimalResume
        break
      case 'professional':
        TemplateComponent = ProfessionalResume
        break
      case 'elegant':
        TemplateComponent = ElegantResume
        break
      case 'executive':
        TemplateComponent = ExecutiveResume
        break
      case 'tech':
        TemplateComponent = TechResume
        break
      case 'academic':
        TemplateComponent = AcademicResume
        break
      case 'compact':
        TemplateComponent = CompactResume
        break
      case 'modern':
      default:
        TemplateComponent = ModernResume
        break
    }

    // Generate PDF
    const pdfBuffer = await renderToBuffer(
      React.createElement(TemplateComponent, { data }) as React.ReactElement
    )

    // Return PDF
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="lebenslauf-${template}.pdf"`,
      },
    })
  } catch (error) {
    console.error('PDF generation error:', error)
    return NextResponse.json({
      error: 'Fehler bei der PDF-Erstellung',
      message: 'Ein Fehler ist aufgetreten. Bitte versuche es erneut.',
    }, { status: 500 })
  }
}
