import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 400 }
      )
    }

    const secretKey = process.env.RECAPTCHA_SECRET_KEY

    if (!secretKey) {
      console.error('RECAPTCHA_SECRET_KEY not configured')
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      )
    }

    const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`

    const response = await fetch(verificationUrl, {
      method: 'POST',
    })

    const data = await response.json()

    if (data.success) {
      return NextResponse.json({
        success: true,
        score: data.score,
        action: data.action,
      })
    } else {
      return NextResponse.json({
        success: false,
        error: 'Verification failed',
        codes: data['error-codes'],
      })
    }
  } catch (error) {
    console.error('reCAPTCHA verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Verification request failed' },
      { status: 500 }
    )
  }
}
