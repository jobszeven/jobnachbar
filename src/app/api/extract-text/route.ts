import { NextRequest, NextResponse } from 'next/server'
import { PDFParse } from 'pdf-parse'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'Keine Datei hochgeladen' }, { status: 400 })
    }

    const fileType = file.type
    let extractedText = ''

    // Handle plain text files
    if (fileType === 'text/plain') {
      extractedText = await file.text()
    }
    // Handle PDF files using pdf-parse
    else if (fileType === 'application/pdf') {
      try {
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        // Use PDFParse class for proper PDF text extraction
        const parser = new PDFParse({ data: uint8Array })
        const textResult = await parser.getText()
        await parser.destroy()

        // Combine all pages text
        extractedText = textResult.pages
          .map(page => page.text)
          .join('\n')

        // Clean up the extracted text
        extractedText = extractedText
          .replace(/\s+/g, ' ')
          .trim()

        // If we couldn't extract meaningful text, return an error
        if (extractedText.length < 50) {
          return NextResponse.json({
            error: 'PDF-Text konnte nicht extrahiert werden',
            message: 'Bitte kopiere den Text manuell aus deinem PDF.',
          }, { status: 422 })
        }
      } catch (pdfError) {
        console.error('PDF parse error:', pdfError)
        return NextResponse.json({
          error: 'PDF-Text konnte nicht extrahiert werden',
          message: 'Bitte kopiere den Text manuell aus deinem PDF.',
        }, { status: 422 })
      }
    }
    // Handle Word documents (simplified - recommend manual paste)
    else if (
      fileType === 'application/msword' ||
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      // For DOCX, we can try to extract from the XML content
      if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        try {
          const arrayBuffer = await file.arrayBuffer()
          const uint8Array = new Uint8Array(arrayBuffer)

          // DOCX files are ZIP archives - look for XML content
          let rawText = ''
          for (let i = 0; i < uint8Array.length; i++) {
            const char = uint8Array[i]
            if (char >= 32 && char <= 126) {
              rawText += String.fromCharCode(char)
            }
          }

          // Try to extract text from XML tags
          const textMatches = rawText.match(/<w:t[^>]*>([^<]+)<\/w:t>/g)
          if (textMatches) {
            extractedText = textMatches
              .map(m => m.replace(/<[^>]+>/g, ''))
              .join(' ')
          }

          if (extractedText.length < 50) {
            return NextResponse.json({
              error: 'Word-Text konnte nicht extrahiert werden',
              message: 'Bitte kopiere den Text manuell aus deinem Dokument.',
            }, { status: 422 })
          }
        } catch {
          return NextResponse.json({
            error: 'Fehler beim Lesen der Word-Datei',
            message: 'Bitte kopiere den Text manuell.',
          }, { status: 422 })
        }
      } else {
        // Old DOC format - can't easily parse without external library
        return NextResponse.json({
          error: 'DOC-Format wird nicht unterstützt',
          message: 'Bitte speichere als DOCX oder kopiere den Text manuell.',
        }, { status: 422 })
      }
    } else {
      return NextResponse.json({
        error: 'Nicht unterstütztes Dateiformat',
        message: 'Bitte lade eine PDF, DOCX oder TXT Datei hoch.',
      }, { status: 400 })
    }

    // Clean and return the text
    extractedText = extractedText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .join('\n')

    return NextResponse.json({
      success: true,
      text: extractedText,
      length: extractedText.length,
    })
  } catch (error) {
    console.error('Text extraction error:', error)
    return NextResponse.json({
      error: 'Fehler bei der Textextraktion',
      message: 'Bitte versuche es erneut oder kopiere den Text manuell.',
    }, { status: 500 })
  }
}
