import { NextRequest, NextResponse } from 'next/server'

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
    // Handle PDF files - simple text extraction
    else if (fileType === 'application/pdf') {
      // For PDF, we'll try to extract using a simple approach
      // In production, you might want to use pdf-parse or similar library
      const arrayBuffer = await file.arrayBuffer()
      const uint8Array = new Uint8Array(arrayBuffer)

      // Convert to string and try to find readable text
      // This is a simplified approach - works for text-based PDFs
      let rawText = ''
      for (let i = 0; i < uint8Array.length; i++) {
        const char = uint8Array[i]
        if (char >= 32 && char <= 126) {
          rawText += String.fromCharCode(char)
        } else if (char === 10 || char === 13) {
          rawText += '\n'
        }
      }

      // Extract text between stream and endstream (PDF text content)
      const streamMatches = rawText.match(/stream[\s\S]*?endstream/g)
      if (streamMatches) {
        for (const match of streamMatches) {
          // Try to find readable text patterns
          const textContent = match.replace(/stream|endstream/g, '')
          // Look for text in parentheses (PDF text objects)
          const parenMatches = textContent.match(/\(([^)]+)\)/g)
          if (parenMatches) {
            extractedText += parenMatches
              .map(m => m.replace(/[()]/g, ''))
              .join(' ') + '\n'
          }
        }
      }

      // Clean up the extracted text
      extractedText = extractedText
        .replace(/\\n/g, '\n')
        .replace(/\\r/g, '')
        .replace(/\s+/g, ' ')
        .replace(/[^\w\s\-.,äöüÄÖÜß@]/g, '')
        .trim()

      // If we couldn't extract meaningful text, return an error
      if (extractedText.length < 50) {
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
